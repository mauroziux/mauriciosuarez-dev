#!/usr/bin/env python3
"""Validate article-based copy and upload ONLY drafts. Default: dry run.

python3 scripts/postiz-drafts.py --self-test
python3 scripts/postiz-drafts.py --apply --env-file /home/dev/apps/postiz/.env
"""
import argparse
import datetime as dt
import fcntl
import json
import os
import re
import tempfile
import unicodedata
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ARTICLES = ROOT / 'src/content/articles'
MANIFEST = ROOT / 'docs/social-drafts.json'
STATE = Path.home() / '.local/state/mauriciosuarez-dev/postiz-drafts.json'


def article_url(filename):
    path = (ARTICLES / filename).resolve()
    if not path.is_relative_to(ARTICLES.resolve()) or path.suffix != '.md':
        raise ValueError('Article must be inside src/content/articles')
    text = path.read_text()
    if not text.startswith('---\n') or '\n---\n' not in text[4:]:
        raise ValueError(f'Missing frontmatter: {filename}')
    frontmatter = text[4:].split('\n---\n', 1)[0]
    if not re.search(r'^draft: false\s*$', frontmatter, re.M):
        raise ValueError(f'Refusing unpublished article: {filename}')
    # ponytail: this repo uses JSON-quoted scalars; use a YAML parser if that changes.
    lang = json.loads(re.search(r'^lang: (".*")\s*$', frontmatter, re.M)[1])
    slug = json.loads(re.search(r'^routeSlug: (".*")\s*$', frontmatter, re.M)[1])
    if lang not in ('es', 'en') or not re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*', slug):
        raise ValueError(f'Invalid article route: {filename}')
    section = 'articulos' if lang == 'es' else 'writing'
    return f'https://mauriciosuarez.dev/{lang}/{section}/{slug}/'


def x_length(text, url):
    # Conservative for compound emoji; use twitter-text if exact emoji support matters.
    text = unicodedata.normalize('NFC', text).replace(url, 'x' * 23)
    return sum(1 if (ord(c) <= 0x10FF or 0x2000 <= ord(c) <= 0x200D
                     or 0x2010 <= ord(c) <= 0x201F or 0x2032 <= ord(c) <= 0x2037)
               else 2 for c in text)


def load_plans():
    plans = []
    seen = set()
    for entry in json.loads(MANIFEST.read_text()):
        for provider in ('linkedin', 'x'):
            source = entry['linkedin_article'] if provider == 'linkedin' else entry['article']
            url = article_url(source)
            lang = 'en' if provider == 'linkedin' else 'es'
            if not url.startswith(f'https://mauriciosuarez.dev/{lang}/'):
                raise ValueError(f'{provider} requires an article in {lang}: {source}')
            copy = [entry[provider]] if provider == 'linkedin' else entry[provider]
            if not isinstance(copy, list) or not copy or not all(isinstance(t, str) and t.strip() for t in copy):
                raise ValueError('Every draft needs nonempty text')
            if '\n'.join(copy).count('{article_url}') != 1:
                raise ValueError('Each draft/thread must cite its article exactly once')
            texts = [t.replace('{article_url}', url) for t in copy]
            limit = 280 if provider == 'x' else 3000
            if any((x_length(t, url) if provider == 'x' else len(t)) > limit for t in texts):
                raise ValueError(f'Text exceeds {provider} limit: {entry["article"]}')
            key = entry['article'] + ':' + provider
            if key in seen:
                raise ValueError('Duplicate article/provider in manifest')
            seen.add(key)
            image = entry['images'][provider]
            if not all(isinstance(image.get(k), str) and image[k].strip() for k in ('id', 'path', 'alt')):
                raise ValueError('Every piece needs an uploaded image and alt text')
            if not re.fullmatch(r'https://postiz\.mauriciosuarez\.dev/uploads/[A-Za-z0-9/_-]+\.(?:png|jpe?g)', image['path']):
                raise ValueError('Images must be uploaded to this Postiz instance')
            if len(image['alt']) > 500:
                raise ValueError('Image alt text exceeds 500 characters')
            plans.append({'key': key, 'provider': provider, 'url': url, 'texts': texts,
                          'image': {k: image[k] for k in ('id', 'path', 'alt')}})
    return plans


def payload(plan, integration_id):
    settings = {'__type': plan['provider']}
    if plan['provider'] == 'x':
        settings.update(who_can_reply_post='everyone', post_type='post')
    return {
        'type': 'draft',  # Never configurable: this uploader cannot schedule or publish.
        'date': dt.datetime.now(dt.timezone.utc).isoformat(),
        'shortLink': False, 'tags': [],
        'posts': [{'integration': {'id': integration_id}, 'settings': settings,
                   'value': [{'content': text, 'image': [plan['image']] if i == 0 else []}
                             for i, text in enumerate(plan['texts'])]}],
    }


def save_receipts(path, receipts):
    path.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    fd, temporary = tempfile.mkstemp(dir=path.parent, prefix='postiz-')
    try:
        with os.fdopen(fd, 'w') as stream:
            json.dump(receipts, stream, indent=2)
            stream.write('\n')
        os.replace(temporary, path)
    finally:
        if os.path.exists(temporary):
            os.unlink(temporary)


def upload(plans, integrations, request, receipts_path):
    receipts = json.loads(receipts_path.read_text()) if receipts_path.exists() else {}
    created = skipped = 0
    for plan in plans:
        previous = receipts.get(plan['key'])
        if previous:
            if previous.get('status') != 'created':
                raise ValueError('An earlier upload is uncertain; inspect Postiz before retrying: ' + plan['key'])
            skipped += 1
            continue
        candidates = [c for c in integrations if c.get('identifier') == plan['provider'] and not c.get('disabled')]
        if len(candidates) != 1:
            raise ValueError('Expected one enabled personal channel for ' + plan['provider'])
        # Reserve before sending: a timeout must not cause an automatic duplicate.
        receipts[plan['key']] = {'status': 'pending'}
        save_receipts(receipts_path, receipts)
        result = request('POST', '/posts', payload(plan, candidates[0]['id']))
        if not isinstance(result, list) or len(result) != 1 or not result[0].get('postId'):
            raise ValueError('Unexpected create response; inspect Postiz before retrying')
        receipts[plan['key']] = {'status': 'created', 'postId': result[0]['postId']}
        save_receipts(receipts_path, receipts)
        created += 1
    return {'created': created, 'skipped': skipped}


def self_test():
    plans = load_plans()
    assert plans
    assert all(('/en/writing/' if p['provider'] == 'linkedin' else '/es/articulos/') in p['url'] for p in plans)
    from unittest.mock import patch
    with patch(__name__ + '.article_url', return_value='https://mauriciosuarez.dev/es/articulos/example/'):
        try:
            load_plans()
        except ValueError:
            pass
        else:
            raise AssertionError('LinkedIn must reject a Spanish article URL')
    bad_image = json.loads(MANIFEST.read_text())
    bad_image[0]['images']['linkedin']['path'] = 'https://example.com/not-owned.png'
    with patch(__name__ + '.MANIFEST') as manifest:
        manifest.read_text.return_value = json.dumps(bad_image)
        try:
            load_plans()
        except ValueError:
            pass
        else:
            raise AssertionError('Reject image URLs outside our uploaded media')
    assert x_length('a' * 280, 'unused') == 280
    assert x_length('😀', 'unused') == 2
    assert x_length('https://example.com/long-path', 'https://example.com/long-path') == 23
    channels = [{'id': p, 'identifier': p, 'disabled': False} for p in ('x', 'linkedin')]
    calls = []
    def fake(method, path, body):
        assert method == 'POST' and path == '/posts' and body['type'] == 'draft'
        assert not body['shortLink'] and len(body['posts']) == 1
        messages = body['posts'][0]['value']
        assert len(messages[0]['image']) == 1 and messages[0]['image'][0]['alt']
        assert all(not m['image'] for m in messages[1:])
        calls.append(body)
        return [{'postId': 'mock-' + str(len(calls))}]
    with tempfile.TemporaryDirectory() as directory:
        ledger = Path(directory) / 'receipts.json'
        assert upload(plans, channels, fake, ledger)['created'] == len(plans)
        assert upload(plans, channels, fake, ledger)['skipped'] == len(plans)
        assert len(calls) == len(plans)
        receipts = json.loads(ledger.read_text())
        receipts[plans[0]['key']] = {'status': 'pending'}
        save_receipts(ledger, receipts)
        try:
            upload(plans, channels, fake, ledger)
        except ValueError:
            pass
        else:
            raise AssertionError('Pending uploads must block retries')
        assert len(calls) == len(plans)
    print('PASS: draft-only payloads, platform languages, root-only image/alt, media-host guard, text limits, idempotence and uncertain-upload guard; no network.')


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument('--apply', action='store_true')
    mode.add_argument('--self-test', action='store_true')
    parser.add_argument('--env-file', type=Path)
    args = parser.parse_args()
    if args.self_test:
        return self_test()
    plans = load_plans()
    if not args.apply:
        print(json.dumps([{'article_provider': p['key'], 'url': p['url'], 'parts': len(p['texts']),
                           'type': 'draft', 'image': p['image']['path']} for p in plans], ensure_ascii=False, indent=2))
        return
    key = os.environ.get('POSTIZ_API_KEY', '')
    if not key and args.env_file:
        key = next((line.split('=', 1)[1] for line in args.env_file.read_text().splitlines()
                    if line.startswith('POSTIZ_API_KEY=')), '')
    if not key:
        raise ValueError('POSTIZ_API_KEY is required for --apply')
    base = 'http://127.0.0.1:5000/api/public/v1'
    def request(method, path, body=None):
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(base + path, data=data, method=method,
            headers={'Authorization': key, 'Content-Type': 'application/json'})
        try:
            with urllib.request.urlopen(req, timeout=45) as response:
                return json.load(response)
        except urllib.error.HTTPError as error:
            raise ValueError(f'Postiz HTTP {error.code}; no automatic retry') from None
        except (urllib.error.URLError, TimeoutError):
            raise ValueError('Postiz request uncertain; inspect drafts/receipts before retrying') from None
    integrations = request('GET', '/integrations')
    STATE.parent.mkdir(parents=True, exist_ok=True, mode=0o700)
    # ponytail: one local uploader; use server-side idempotency for multiple machines.
    with STATE.with_suffix('.lock').open('a') as lock:
        fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        print(json.dumps(upload(plans, integrations, request, STATE)))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, KeyError, TypeError, OSError) as error:
        raise SystemExit(str(error))

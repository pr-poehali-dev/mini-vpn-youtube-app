import json
import os
import urllib.request
import urllib.parse

def handler(event: dict, context) -> dict:
    method = event.get('httpMethod', 'GET')

    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }

    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }

    api_key = os.environ.get('YOUTUBE_API_KEY')
    if not api_key:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'YouTube API key not configured'}),
            'isBase64Encoded': False
        }

    query_params = event.get('queryStringParameters') or {}
    search_query = query_params.get('q', '')
    max_results = min(int(query_params.get('maxResults', 12)), 50)

    if not search_query:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Search query is required'}),
            'isBase64Encoded': False
        }

    params = {
        'part': 'snippet',
        'q': search_query,
        'type': 'video',
        'maxResults': max_results,
        'key': api_key,
        'videoEmbeddable': 'true',
        'safeSearch': 'moderate'
    }

    url = f"https://www.googleapis.com/youtube/v3/search?{urllib.parse.urlencode(params)}"

    try:
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10) as response:
            data = json.loads(response.read().decode('utf-8'))

        videos = []
        for item in data.get('items', []):
            video_id = item['id'].get('videoId')
            snippet = item.get('snippet', {})
            
            videos.append({
                'id': video_id,
                'title': snippet.get('title', ''),
                'channel': snippet.get('channelTitle', ''),
                'thumbnail': snippet.get('thumbnails', {}).get('medium', {}).get('url', ''),
                'description': snippet.get('description', ''),
                'publishedAt': snippet.get('publishedAt', '')
            })

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'videos': videos,
                'total': len(videos)
            }),
            'isBase64Encoded': False
        }

    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        return {
            'statusCode': e.code,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'YouTube API error',
                'details': error_body
            }),
            'isBase64Encoded': False
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Internal server error',
                'message': str(e)
            }),
            'isBase64Encoded': False
        }

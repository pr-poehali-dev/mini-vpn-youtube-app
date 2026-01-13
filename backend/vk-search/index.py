import json
import os
import urllib.request
import urllib.parse

def handler(event: dict, context) -> dict:
    '''Поиск видео ВКонтакте через VK API'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    if method != 'GET':
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    service_token = os.environ.get('VK_SERVICE_TOKEN')
    if not service_token:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'VK_SERVICE_TOKEN not configured'})
        }
    
    query_params = event.get('queryStringParameters', {})
    search_query = query_params.get('q', '')
    count = int(query_params.get('count', 20))
    
    if not search_query:
        return {
            'statusCode': 400,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Missing query parameter'})
        }
    
    try:
        params = urllib.parse.urlencode({
            'q': search_query,
            'count': count,
            'adult': 0,
            'access_token': service_token,
            'v': '5.131'
        })
        
        url = f'https://api.vk.com/method/video.search?{params}'
        
        with urllib.request.urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode())
        
        if 'error' in data:
            error_msg = data['error'].get('error_msg', 'VK API error')
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': error_msg})
            }
        
        videos = []
        for item in data.get('response', {}).get('items', []):
            video_id = f"{item.get('owner_id')}_{item.get('id')}"
            
            thumbnail = ''
            for img_key in ['image', 'first_frame']:
                if img_key in item:
                    for size in item[img_key]:
                        if size.get('height', 0) >= 240:
                            thumbnail = size.get('url', '')
                            break
                    if thumbnail:
                        break
            
            videos.append({
                'id': video_id,
                'title': item.get('title', 'Без названия'),
                'description': item.get('description', ''),
                'duration': item.get('duration', 0),
                'views': item.get('views', 0),
                'thumbnail': thumbnail,
                'player': item.get('player', ''),
                'date': item.get('date', 0)
            })
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'videos': videos, 'count': len(videos)})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

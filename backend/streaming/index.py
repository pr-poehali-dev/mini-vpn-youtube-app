import json
import os
import psycopg2
from datetime import datetime

def get_db_connection():
    """Создает подключение к базе данных"""
    dsn = os.environ.get('DATABASE_URL')
    return psycopg2.connect(dsn)

def handler(event: dict, context) -> dict:
    '''API для управления стримами и начисления баллов стримерам'''
    
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': ''
        }
    
    path_params = event.get('pathParams', {})
    query_params = event.get('queryStringParameters', {})
    action = query_params.get('action', 'list')
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # GET /streaming?action=list - список активных стримов
        if method == 'GET' and action == 'list':
            cur.execute('''
                SELECT s.id, s.title, st.username, st.points, 
                       s.viewers_count, s.started_at, st.phone_id
                FROM streams s
                JOIN streamers st ON s.streamer_id = st.id
                WHERE s.status = 'active'
                ORDER BY s.viewers_count DESC
            ''')
            
            streams = []
            for row in cur.fetchall():
                streams.append({
                    'id': row[0],
                    'title': row[1],
                    'streamer': row[2],
                    'points': row[3],
                    'viewers': row[4],
                    'started_at': row[5].isoformat() if row[5] else None,
                    'phone_id': row[6]
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'streams': streams})
            }
        
        # GET /streaming?action=leaderboard - топ стримеров
        elif method == 'GET' and action == 'leaderboard':
            limit = int(query_params.get('limit', 10))
            
            cur.execute('''
                SELECT username, points, total_stream_time, is_streaming
                FROM streamers
                ORDER BY points DESC
                LIMIT %s
            ''', (limit,))
            
            leaderboard = []
            for row in cur.fetchall():
                leaderboard.append({
                    'username': row[0],
                    'points': row[1],
                    'total_stream_time': row[2],
                    'is_streaming': row[3]
                })
            
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'leaderboard': leaderboard})
            }
        
        # POST /streaming?action=start - начать стрим
        elif method == 'POST' and action == 'start':
            body = json.loads(event.get('body', '{}'))
            username = body.get('username')
            phone_id = body.get('phone_id')
            title = body.get('title', 'Прямой эфир')
            
            if not username or not phone_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'username and phone_id required'})
                }
            
            # Создать или получить стримера
            cur.execute('''
                INSERT INTO streamers (username, phone_id)
                VALUES (%s, %s)
                ON CONFLICT (phone_id) 
                DO UPDATE SET username = EXCLUDED.username
                RETURNING id
            ''', (username, phone_id))
            
            streamer_id = cur.fetchone()[0]
            
            # Обновить статус стримера
            cur.execute('''
                UPDATE streamers 
                SET is_streaming = TRUE, last_stream_at = CURRENT_TIMESTAMP
                WHERE id = %s
            ''', (streamer_id,))
            
            # Создать стрим
            cur.execute('''
                INSERT INTO streams (streamer_id, title, status)
                VALUES (%s, %s, 'active')
                RETURNING id
            ''', (streamer_id, title))
            
            stream_id = cur.fetchone()[0]
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'stream_id': stream_id,
                    'streamer_id': streamer_id,
                    'message': 'Stream started'
                })
            }
        
        # POST /streaming?action=stop - завершить стрим
        elif method == 'POST' and action == 'stop':
            body = json.loads(event.get('body', '{}'))
            stream_id = body.get('stream_id')
            
            if not stream_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'stream_id required'})
                }
            
            # Завершить стрим и рассчитать баллы
            cur.execute('''
                UPDATE streams 
                SET status = 'ended', 
                    ended_at = CURRENT_TIMESTAMP,
                    duration = EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - started_at))::INTEGER
                WHERE id = %s
                RETURNING streamer_id, duration, viewers_count
            ''', (stream_id,))
            
            result = cur.fetchone()
            if not result:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Stream not found'})
                }
            
            streamer_id, duration, viewers_count = result
            
            # Рассчитать баллы: 1 балл за каждую минуту + бонус за зрителей
            points = (duration // 60) + (viewers_count * 5)
            
            # Обновить баллы стримера
            cur.execute('''
                UPDATE streamers 
                SET points = points + %s,
                    total_stream_time = total_stream_time + %s,
                    is_streaming = FALSE
                WHERE id = %s
            ''', (points, duration, streamer_id))
            
            # Записать начисление баллов
            cur.execute('''
                INSERT INTO points_history (streamer_id, points, reason)
                VALUES (%s, %s, %s)
            ''', (streamer_id, points, f'Стрим завершен: {duration}с, {viewers_count} зрителей'))
            
            # Обновить баллы в записи стрима
            cur.execute('''
                UPDATE streams SET points_earned = %s WHERE id = %s
            ''', (points, stream_id))
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'points_earned': points,
                    'duration': duration,
                    'message': 'Stream ended'
                })
            }
        
        # POST /streaming?action=join - зритель присоединился
        elif method == 'POST' and action == 'join':
            body = json.loads(event.get('body', '{}'))
            stream_id = body.get('stream_id')
            
            if not stream_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'stream_id required'})
                }
            
            # Увеличить счетчик зрителей
            cur.execute('''
                UPDATE streams 
                SET viewers_count = viewers_count + 1
                WHERE id = %s AND status = 'active'
                RETURNING viewers_count
            ''', (stream_id,))
            
            result = cur.fetchone()
            if not result:
                cur.close()
                conn.close()
                return {
                    'statusCode': 404,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Stream not found'})
                }
            
            viewers_count = result[0]
            
            # Записать зрителя
            cur.execute('''
                INSERT INTO viewers (stream_id) VALUES (%s) RETURNING id
            ''', (stream_id,))
            
            viewer_id = cur.fetchone()[0]
            
            conn.commit()
            cur.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({
                    'viewer_id': viewer_id,
                    'viewers_count': viewers_count
                })
            }
        
        else:
            cur.close()
            conn.close()
            return {
                'statusCode': 400,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Invalid action'})
            }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }

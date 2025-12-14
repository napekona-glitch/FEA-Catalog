import http.client
import json
import gzip
from urllib.parse import urlencode

# Test different formats for multiple states
HOST = 'ui.boondmanager.com'
HEADERS = {
    'X-Jwt-Client-BoondManager': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyVG9rZW4iOiIzMzMwMzYyZTc3NjU2YjY1NzkiLCJjbGllbnRUb2tlbiI6Ijc3NjU2YjY1NzkiLCJ0aW1lIjoxNzY1NTQxNzQzLCJtb2RlIjoibm9ybWFsIn0=.EkckzY3EUIsd/o8v46kWkxYv609Coa6N5nCCw6wC7K8=',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip',
    'Content-Type': 'application/json',
}

def test_state_format(format_name, states_value):
    conn = http.client.HTTPSConnection(HOST, timeout=30)
    try:
        params = {
            'offset': 0,
            'limit': 5,
            'candidateStates': states_value,
            'columns': 'id,firstName,lastName,state'
        }
        url = f'/api/candidates?{urlencode(params)}'
        
        conn.request('GET', url, headers=HEADERS)
        response = conn.getresponse()
        data = response.read()
        
        if response.getheader('Content-Encoding') == 'gzip':
            data = gzip.decompress(data)
        
        if response.status == 200:
            result = json.loads(data)
            candidates = result.get('data', [])
            states_found = set()
            for candidate in candidates:
                state = candidate.get('attributes', {}).get('state')
                states_found.add(str(state))
            
            print(f'{format_name}: {states_value} -> Found {len(candidates)} candidates, States: {sorted(states_found)}')
        else:
            print(f'{format_name}: {states_value} -> HTTP {response.status}')
    finally:
        conn.close()

# Test different formats
test_state_format('Ampersand', '1&2&6')
test_state_format('Comma', '1,2,6')
test_state_format('Array format', '1,2,3,4,5')
test_state_format('Single state', '1')
test_state_format('No filter', '')

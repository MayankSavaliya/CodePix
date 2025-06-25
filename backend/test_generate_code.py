import requests
import json

def test_generate_code():
    url = 'http://localhost:5000/api/ai/generate'
    payload = {
        'prompt': 'Write a Python function to add two numbers.'
    }
    headers = {'Content-Type': 'application/json'}
    response = requests.post(url, data=json.dumps(payload), headers=headers)
    print('Status code:', response.status_code)
    print('Response:', response.json())

if __name__ == '__main__':
    test_generate_code() 
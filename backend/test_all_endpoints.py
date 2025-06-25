import requests
import json

def test_generate_code():
    """Test code generation endpoint"""
    print("=== Testing Code Generation ===")
    url = 'http://localhost:5000/api/ai/generate'
    payload = {
        'prompt': 'Write a Python function to add two numbers.',
        'modelProvider': 'gemini',
        'language': 'python',
        'complexity': 'beginner'
    }
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print('Status code:', response.status_code)
        print('Response:', json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")
    print()

def test_explain_code():
    """Test code explanation endpoint"""
    print("=== Testing Code Explanation ===")
    url = 'http://localhost:5000/api/ai/explain'
    payload = {
        'prompt': '''
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)
        ''',
        'modelProvider': 'groq'
    }
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print('Status code:', response.status_code)
        print('Response:', json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")
    print()

def test_translate_code():
    """Test code translation endpoint"""
    print("=== Testing Code Translation ===")
    url = 'http://localhost:5000/api/ai/translate'
    payload = {
        'code': '''
function addNumbers(a, b) {
    return a + b;
}

function multiplyNumbers(a, b) {
    return a * b;
}
        ''',
        'sourceLanguage': 'javascript',
        'targetLanguage': 'python',
        'modelProvider': 'gemini'
    }
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print('Status code:', response.status_code)
        print('Response:', json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")
    print()

def test_optimize_code():
    """Test code optimization endpoint"""
    print("=== Testing Code Optimization ===")
    url = 'http://localhost:5000/api/ai/optimize'
    payload = {
        'code': '''
def find_duplicates(arr):
    duplicates = []
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j] and arr[i] not in duplicates:
                duplicates.append(arr[i])
    return duplicates
        ''',
        'language': 'python',
        'modelProvider': 'groq'
    }
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, data=json.dumps(payload), headers=headers)
        print('Status code:', response.status_code)
        print('Response:', json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")
    print()

def test_api_status():
    """Test API status endpoint"""
    print("=== Testing API Status ===")
    url = 'http://localhost:5000/api/status'
    
    try:
        response = requests.get(url)
        print('Status code:', response.status_code)
        print('Response:', json.dumps(response.json(), indent=2))
    except Exception as e:
        print(f"Error: {e}")
    print()

if __name__ == '__main__':
    print("Starting API Tests...\n")
    
    # Test API status first
    test_api_status()
    
    # Test all AI endpoints
    test_generate_code()
    test_explain_code()
    test_translate_code()
    test_optimize_code()
    
    print("All tests completed!") 
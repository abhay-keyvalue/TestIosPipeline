import jwt
import requests
import time
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def generate_jwt(api_key_id, issuer_id, private_key):
    headers = {
        'kid': api_key_id,
        'typ': 'JWT',
        'alg': 'ES256',
    }
    payload = {
        'iss': issuer_id,
        'exp': time.time() + 20 * 60,  # Token expires in 20 minutes
        'aud': 'appstoreconnect-v1',
    }
    signed_jwt = jwt.encode(payload, private_key, algorithm='ES256', headers=headers)
    return signed_jwt

def increment_version_number(current_version):
    new_version = int(current_version) + 1
    return new_version

def fetch_latest_version(app_id):
    api_key_id = os.getenv('APP_STORE_CONNECT_API_KEY_ID')
    issuer_id = os.getenv('APP_STORE_CONNECT_ISSUER_ID')
    private_key = os.getenv('APP_STORE_CONNECT_API_PRIVATE_KEY').replace('\\n', '\n')

    token = generate_jwt(api_key_id, issuer_id, private_key)

    url = f"https://api.appstoreconnect.apple.com/v1/builds?filter[app]={app_id}"

    headers = {
        'Authorization': f'Bearer {token}',
        'Content-Type': 'application/json',
    }

    response = requests.get(url, headers=headers)

    if response.status_code == 200:
        data = response.json()
        if data['data']:
            latest_version = data['data'][0]['attributes']['version']
            new_version = increment_version_number(latest_version)
            return new_version
    return None

if __name__ == "__main__":
    APP_ID = os.getenv('APP_ID')
    new_version = fetch_latest_version(APP_ID)
    if new_version is not None:
        print(new_version)  # Only prints the number value

import json
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Constants
SCOPES = ['https://www.googleapis.com/auth/androidpublisher']
SERVICE_ACCOUNT_FILE = './key.json'  # Update with your actual JSON key file path
PACKAGE_NAME = 'org.courtapp.dev'

def fetch_latest_version_code():
    # Create credentials and build the service
    credentials = service_account.Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    service = build('androidpublisher', 'v3', credentials=credentials)

    # Start a new edit
    edit_request = service.edits().insert(body={}, packageName=PACKAGE_NAME)
    edit = edit_request.execute()

    # Get the version code from the internal track
    track_response = service.edits().tracks().get(packageName=PACKAGE_NAME, editId=edit['id'], track='internal').execute()
    latest_version_code = track_response['releases'][0]['versionCodes'][0]

    return latest_version_code

if __name__ == "__main__":
    try:
        latest_version_code = fetch_latest_version_code()
        print(f"Latest version code from Google Play: {latest_version_code}")

        # Increment the version code
        new_version_code = int(latest_version_code) + 1
        print(f"New version code: {new_version_code}")
    except Exception as e:
        print(f"An error occurred: {e}")
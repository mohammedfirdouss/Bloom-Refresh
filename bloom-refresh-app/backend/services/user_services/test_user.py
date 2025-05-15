"""Test script for user service endpoints."""

import requests

BASE_URL = "http://localhost:5002"  # Change port if user_services runs on a different port
DUMMY_USER_ID = "test_user_id_123"
DUMMY_JWT = "YOUR_JWT_TOKEN_HERE"  # Replace with a real JWT from your auth service

def test_health():
    """Test health endpoint."""
    url = f"{BASE_URL}/users/health"
    response = requests.get(url)
    print("\nHealth Check Response:", response.status_code)
    print(response.json())

def test_create_or_update_user():
    url = f"{BASE_URL}/users/{DUMMY_USER_ID}"
    headers = {"Authorization": f"Bearer {DUMMY_JWT}"}
    data = {
        "name": "Test User",
        "preferences": {"notifications": True},
        "avatarUrl": "http://example.com/avatar.jpg"
    }
    response = requests.put(url, json=data, headers=headers)
    print("\nCreate/Update User Response:", response.status_code)
    try:
        print(response.json())
    except Exception:
        print("Raw response:", response.text)

def test_get_user():
    url = f"{BASE_URL}/users/{DUMMY_USER_ID}"
    headers = {"Authorization": f"Bearer {DUMMY_JWT}"}
    response = requests.get(url, headers=headers)
    print("\nGet User Response:", response.status_code)
    try:
        print(response.json())
    except Exception:
        print("Raw response:", response.text)

if __name__ == "__main__":
    print("Testing User Service Endpoints...")
    test_health()
    test_create_or_update_user()
    test_get_user()
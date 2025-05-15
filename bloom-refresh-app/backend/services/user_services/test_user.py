"""Test script for user service endpoints."""

import requests

BASE_URL = "http://localhost:5002"  # Change port if user_services runs on a different port

def test_create_user():
    """Test user creation."""
    url = f"{BASE_URL}/user/create"
    data = {
        "email": "user2@example.com",
        "name": "Test User",
        "role": "volunteer"
    }
    response = requests.post(url, json=data)
    print("\nCreate User Response:", response.status_code)
    try:
        print(response.json())
    except Exception:
        print("Raw response:", response.text)
    return response.json().get("userId")

def test_get_user(user_id):
    """Test get user by ID."""
    url = f"{BASE_URL}/users/{user_id}"
    response = requests.get(url)
    print("\nGet User Response:", response.status_code)
    print(response.json())

def test_health():
    """Test health endpoint."""
    url = f"{BASE_URL}/users/health"
    response = requests.get(url)
    print("\nHealth Check Response:", response.status_code)
    print(response.json())

if __name__ == "__main__":
    print("Testing User Service Endpoints...")
    test_health()
    user_id = test_create_user()
    if user_id:
        test_get_user(user_id)
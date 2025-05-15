"""Test script for auth service endpoints."""

import requests
import json

BASE_URL = "http://localhost:5001"

def test_signup():
    """Test user signup."""
    url = f"{BASE_URL}/auth/signup"
    data = {
        "email": "test@example.com",
        "password": "testpass123",
        "role": "volunteer"
    }
    response = requests.post(url, json=data)
    print("\nSignup Response:", response.status_code)
    print(response.json())

def test_login():
    """Test user login."""
    url = f"{BASE_URL}/auth/login"
    data = {
        "email": "test@example.com",
        "password": "testpass123"
    }
    response = requests.post(url, json=data)
    print("\nLogin Response:", response.status_code)
    print(response.json())
    return response.json().get("access_token"), response.json().get("refresh_token")

def test_refresh_token(refresh_token):
    """Test token refresh."""
    url = f"{BASE_URL}/auth/refresh"
    headers = {"Authorization": f"Bearer {refresh_token}"}
    response = requests.post(url, headers=headers)
    print("\nRefresh Token Response:", response.status_code)
    print(response.json())

def test_health():
    """Test health endpoint."""
    url = f"{BASE_URL}/auth/health"
    response = requests.get(url)
    print("\nHealth Check Response:", response.status_code)
    print(response.json())

if __name__ == "__main__":
    print("Testing Auth Service Endpoints...")
    test_health()
    test_signup()
    access_token, refresh_token = test_login()
    test_refresh_token(refresh_token) 
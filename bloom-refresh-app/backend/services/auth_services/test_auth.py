"""Test script for auth service endpoints."""

import pytest
from flask import Flask
from unittest.mock import patch
from app import app  # Import the Flask app from the auth service

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

@patch("app.some_external_dependency")  # Mock external dependencies
def test_signup(mock_dependency, client):
    mock_dependency.return_value = True  # Mock behavior
    response = client.post("/auth/signup", json={
        "email": "test@example.com",
        "password": "testpass123",
        "role": "volunteer"
    })
    assert response.status_code == 201
    assert response.json["message"] == "User signed up successfully."

@patch("app.some_external_dependency")
def test_login(mock_dependency, client):
    mock_dependency.return_value = True
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "testpass123"
    })
    assert response.status_code == 200
    assert "access_token" in response.json
    assert "refresh_token" in response.json

@patch("app.some_external_dependency")
def test_refresh_token(mock_dependency, client):
    mock_dependency.return_value = True
    response = client.post("/auth/refresh", headers={
        "Authorization": "Bearer some_refresh_token"
    })
    assert response.status_code == 200
    assert "access_token" in response.json

def test_health(client):
    response = client.get("/auth/health")
    assert response.status_code == 200
    assert response.json["status"] == "Auth service is healthy"
"""Test script for user service endpoints."""

import pytest
from flask import Flask
from unittest.mock import patch
from app import app  # Import the Flask app from the user service

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

@patch("app.some_external_dependency")  # Mock external dependencies
def test_create_user(mock_dependency, client):
    mock_dependency.return_value = True
    response = client.post("/user/create", json={
        "email": "user2@example.com",
        "name": "Test User",
        "role": "volunteer"
    })
    assert response.status_code == 201
    assert "userId" in response.json

@patch("app.some_external_dependency")
def test_get_user(mock_dependency, client):
    mock_dependency.return_value = True
    response = client.get("/users/some_user_id")
    assert response.status_code == 200
    assert "email" in response.json
    assert response.json["email"] == "user2@example.com"

@patch("app.some_external_dependency")
def test_health(mock_dependency, client):
    mock_dependency.return_value = True
    response = client.get("/users/health")
    assert response.status_code == 200
    assert response.json["status"] == "User service is healthy"
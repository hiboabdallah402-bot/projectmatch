#!/usr/bin/env python3
"""Test script for message API endpoints."""

import requests
import json

BASE_URL = "http://localhost:5000"

def test_message_api():
    """Test message posting and retrieval."""
    
    # Step 1: Login to get JWT token
    print("Step 1: Logging in...")
    login_response = requests.post(
        f"{BASE_URL}/api/auth/login",
        json={"email": "hibo@example.com", "password": "password123"}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    token = login_response.json().get("access_token")
    print(f"✓ Login successful, token: {token[:20]}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    # Step 2: Get a project
    project_id = 1
    
    # Step 3: Try to list messages
    print(f"\nStep 2: Listing messages for project {project_id}...")
    list_response = requests.get(
        f"{BASE_URL}/api/collaboration/projects/{project_id}/messages",
        headers=headers
    )
    
    if list_response.status_code != 200:
        print(f"❌ List messages failed: {list_response.status_code}")
        print(list_response.text)
        return
    
    messages = list_response.json().get("messages", [])
    print(f"✓ Messages retrieved: {len(messages)} messages")
    print(json.dumps(messages, indent=2))
    
    # Step 4: Post a test message
    print(f"\nStep 3: Posting a test message...")
    post_response = requests.post(
        f"{BASE_URL}/api/collaboration/projects/{project_id}/messages",
        headers=headers,
        json={"message": "Test message from API"}
    )
    
    if post_response.status_code != 201:
        print(f"❌ Post message failed: {post_response.status_code}")
        print(post_response.text)
        return
    
    print(f"✓ Message posted successfully")
    print(json.dumps(post_response.json(), indent=2))
    
    # Step 5: List messages again to verify
    print(f"\nStep 4: Listing messages again...")
    list_response = requests.get(
        f"{BASE_URL}/api/collaboration/projects/{project_id}/messages",
        headers=headers
    )
    
    if list_response.status_code != 200:
        print(f"❌ List messages failed: {list_response.status_code}")
        print(list_response.text)
        return
    
    messages = list_response.json().get("messages", [])
    print(f"✓ Messages retrieved: {len(messages)} messages")
    print(json.dumps(messages, indent=2))

if __name__ == "__main__":
    test_message_api()

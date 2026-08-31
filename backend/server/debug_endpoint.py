#!/usr/bin/env python3
"""
Debug the project-progress endpoint to see what it's returning
"""
import sys
import json
from app import create_app, db
from models.user import User
from models.project import Project
from models.collaboration import ProjectTask, TeamMember
from flask_jwt_extended import create_access_token

app = create_app()

def debug_project_progress():
    """Debug the project progress endpoint"""
    with app.app_context():
        print("=" * 80)
        print("DEBUGGING PROJECT PROGRESS ENDPOINT")
        print("=" * 80)
        
        # Get Hibo (supervisor)
        hibo = User.query.filter_by(email="hibo@example.com").first()
        
        print(f"\n1. CHECKING HIBO USER")
        print(f"   ID: {hibo.id}")
        print(f"   Name: {hibo.full_name}")
        print(f"   is_supervisor: {hibo.is_supervisor}")
        
        # Check what projects exist
        print(f"\n2. PROJECTS IN DATABASE")
        all_projects = Project.query.all()
        for p in all_projects:
            total_tasks = ProjectTask.query.filter_by(project_id=p.id).count()
            completed_tasks = ProjectTask.query.filter_by(
                project_id=p.id,
                status="completed"
            ).count()
            print(f"   - {p.title} (ID: {p.id}, Status: {p.status})")
            print(f"     Tasks: {completed_tasks}/{total_tasks}")
        
        # Create a test token
        print(f"\n3. CREATING JWT TOKEN")
        token = create_access_token(identity=str(hibo.id))
        print(f"   Token created for user {hibo.id}")
        
        # Test the endpoint using Flask's test client
        print(f"\n4. TESTING ENDPOINT WITH TEST CLIENT")
        client = app.test_client()
        headers = {"Authorization": f"Bearer {token}"}
        
        response = client.get(
            "/api/dashboard/project-progress",
            headers=headers
        )
        
        print(f"   Status Code: {response.status_code}")
        print(f"   Response Headers:")
        for key, value in response.headers:
            if key.lower() not in ['server', 'date', 'content-length', 'content-type']:
                print(f"      {key}: {value}")
        
        try:
            data = json.loads(response.data)
            print(f"   Response Body:")
            print(json.dumps(data, indent=2))
            
            if "projects" in data:
                print(f"\n5. ANALYSIS")
                print(f"   Number of projects returned: {len(data['projects'])}")
                
                if len(data['projects']) == 0:
                    print(f"   ⚠️  WARNING: Endpoint returned empty projects list!")
                    print(f"   This means either:")
                    print(f"      - User is not a supervisor")
                    print(f"      - _get_accessible_projects is not working")
                    print(f"      - Authorization is failing")
                else:
                    print(f"   ✅ Endpoint returned {len(data['projects'])} projects")
                    for proj in data['projects']:
                        print(f"      - {proj['title']}: {proj['completed_tasks']}/{proj['total_tasks']} ({proj['progress_percent']}%)")
        except json.JSONDecodeError:
            print(f"   ERROR: Could not decode JSON response")
            print(f"   Response text: {response.data}")
        
        # Now test with a normal user
        print(f"\n6. TESTING WITH NORMAL USER (Ahmed)")
        ahmed = User.query.filter_by(email="ahmedhassan23@email.com").first()
        
        if ahmed:
            print(f"   ID: {ahmed.id}")
            print(f"   is_supervisor: {ahmed.is_supervisor}")
            
            token_ahmed = create_access_token(identity=str(ahmed.id))
            response_ahmed = client.get(
                "/api/dashboard/project-progress",
                headers={"Authorization": f"Bearer {token_ahmed}"}
            )
            
            print(f"   Status Code: {response_ahmed.status_code}")
            
            try:
                data_ahmed = json.loads(response_ahmed.data)
                print(f"   Number of projects returned: {len(data_ahmed.get('projects', []))}")
                
                if len(data_ahmed.get('projects', [])) > 0:
                    for proj in data_ahmed['projects']:
                        print(f"      - {proj['title']}: {proj['completed_tasks']}/{proj['total_tasks']} ({proj['progress_percent']}%)")
            except:
                print(f"   ERROR: Could not decode response")

if __name__ == "__main__":
    debug_project_progress()

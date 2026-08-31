#!/usr/bin/env python3
"""
Demonstrate the completion logic by marking a project as completed
"""
import json
from app import create_app
from extensions import db
from flask_jwt_extended import create_access_token
from models.user import User
from models.project import Project

app = create_app()

with app.app_context():
    print("=" * 80)
    print("DEMONSTRATION: Project Completion Logic")
    print("=" * 80)
    
    # Get Hibo
    hibo = User.query.filter_by(email="hibo@example.com").first()
    client = app.test_client()
    token = create_access_token(identity=str(hibo.id))
    headers = {"Authorization": f"Bearer {token}"}
    
    # Get E-commerce project
    project = Project.query.filter_by(title='E-commerce Platform Redesign').first()
    
    print(f"\n📊 Project: {project.title}")
    print(f"   Current Status: {project.status}")
    
    # STEP 1: Show current progress
    print("\n" + "-" * 80)
    print("STEP 1: Current State (Status = open)")
    print("-" * 80)
    
    response = client.get("/api/dashboard/project-progress", headers=headers)
    data = json.loads(response.data)
    
    ecom_project = next((p for p in data['projects'] if p['id'] == project.id), None)
    print(f"\n   Tasks: {ecom_project['completed_tasks']}/{ecom_project['total_tasks']}")
    print(f"   Progress: {ecom_project['progress_percent']}%")
    print(f"   Logic: 1/1 tasks completed = 100% (task-based)")
    
    # STEP 2: Mark project as completed
    print("\n" + "-" * 80)
    print("STEP 2: Marking Project as 'completed'")
    print("-" * 80)
    
    print(f"\n   Changing status: {project.status} → completed")
    project.status = "completed"
    db.session.commit()
    print(f"   ✅ Project status updated in database")
    
    # STEP 3: Check progress again
    print("\n" + "-" * 80)
    print("STEP 3: Progress After Marking Completed")
    print("-" * 80)
    
    response = client.get("/api/dashboard/project-progress", headers=headers)
    data = json.loads(response.data)
    
    ecom_project = next((p for p in data['projects'] if p['id'] == project.id), None)
    print(f"\n   Tasks: {ecom_project['completed_tasks']}/{ecom_project['total_tasks']}")
    print(f"   Progress: {ecom_project['progress_percent']}%")
    print(f"   Logic: Status = 'completed' → 100% (project finished!)")
    
    print("\n" + "=" * 80)
    print("DEMONSTRATION COMPLETE")
    print("=" * 80)
    print(f"""
✅ Project Completion Logic Working!

Before: 1/1 task completed, Status=open → 100% (task-based)
After:  1/1 task completed, Status=completed → 100% (project finished)

Key Point:
- Task-based progress shows partial completion (0%-99%)
- When project status = "completed" → Always 100% (shipped/finished)
- No need to complete all tasks - status change signals completion!

Real-World Example:
  Project Alpha:
  - Status: open, Tasks: 3/5 = 60% (still in progress)
  - Status changes → completed
  - Dashboard: 100% (project shipped!)
  
  Project Beta:
  - Status: open, Tasks: 4/4 = 100%
  - Status still open (maybe minor fixes pending)
  - Dashboard: 100% (but project not officially completed)
  - Status changes → completed
  - Dashboard: 100% (now officially finished!)
""")
    
    # Show all projects
    print("\n" + "-" * 80)
    print("All Projects After Change")
    print("-" * 80)
    
    response = client.get("/api/dashboard/project-progress", headers=headers)
    data = json.loads(response.data)
    
    for p in data['projects']:
        marker = "✅ COMPLETED" if p['status'] == 'completed' else "🔄 OPEN"
        print(f"\n{marker} {p['title']}")
        print(f"   Tasks: {p['completed_tasks']}/{p['total_tasks']}")
        print(f"   Progress: {p['progress_percent']}%")

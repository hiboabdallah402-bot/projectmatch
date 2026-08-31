#!/usr/bin/env python3
"""
Test the new project completion logic:
- Project status = "completed" → 100% (regardless of tasks)
- Project status = "open" → Task-based progress (e.g., 50%)
"""
import json
from app import create_app
from flask_jwt_extended import create_access_token
from models.user import User
from models.project import Project

app = create_app()

with app.app_context():
    print("=" * 80)
    print("TESTING PROJECT COMPLETION VS TASK PROGRESS")
    print("=" * 80)
    
    # Get Hibo (supervisor)
    hibo = User.query.filter_by(email="hibo@example.com").first()
    client = app.test_client()
    token = create_access_token(identity=str(hibo.id))
    headers = {"Authorization": f"Bearer {token}"}
    
    # Fetch project progress
    response = client.get("/api/dashboard/project-progress", headers=headers)
    data = json.loads(response.data)
    
    print("\n" + "-" * 80)
    print("CURRENT PROJECT PROGRESS")
    print("-" * 80)
    
    for project in data['projects']:
        total = project['total_tasks']
        completed = project['completed_tasks']
        progress = project['progress_percent']
        status = project['status']
        
        print(f"\n📊 {project['title']}")
        print(f"   Project Status: {status}")
        print(f"   Tasks: {completed}/{total}")
        print(f"   Progress: {progress}%")
        
        # Explain the calculation
        if status == "completed":
            print(f"   Logic: Project COMPLETED → 100% (fully shipped/finished)")
        elif total == 0:
            print(f"   Logic: No tasks → 0%")
        else:
            print(f"   Logic: Task-based → {completed}/{total} × 100 = {progress}%")
    
    print("\n" + "=" * 80)
    print("BEHAVIOR EXPLANATION")
    print("=" * 80)
    print("""
✅ NEW LOGIC:

1. If project.status = "completed":
   → Show 100% (project is fully done, shipped to production/files)
   → This is the FINAL state - no more work needed

2. If project.status = "open" or "in_progress":
   → Show actual task completion percentage
   → Can be 0%, 25%, 50%, 75%, 99% (less than 100%)
   → Updates as team completes tasks

Example Scenarios:

Scenario 1: Early Stage Project
  Project Status: open
  Tasks: 1/4 completed
  Progress: 25% (1÷4 × 100)
  Meaning: Project is active, 25% of work done

Scenario 2: Near Completion
  Project Status: open
  Tasks: 3/4 completed
  Progress: 75% (3÷4 × 100)
  Meaning: Project is almost done, waiting for final task

Scenario 3: FULLY COMPLETED PROJECT
  Project Status: completed (status changed in collaboration)
  Tasks: Any number
  Progress: 100% (regardless of task count)
  Meaning: Project finished and shipped!

Current Example:
  Data Analytics Dashboard
  Project Status: open
  Tasks: 1/2 completed
  Progress: 50% (task-based)
  → When project is marked "completed", progress will jump to 100%
""")
    
    print("\n" + "=" * 80)
    print("CHANGING PROJECT STATUS")
    print("=" * 80)
    print("""
To mark a project as fully completed:
1. Go to Project Collaboration section
2. Find Project Settings/Info
3. Change project status: open → completed
4. Dashboard will show 100% ✓

No need to complete all tasks - when project is marked "completed",
the dashboard knows it's a finished project!
""")

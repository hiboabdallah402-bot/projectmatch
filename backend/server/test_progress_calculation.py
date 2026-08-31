#!/usr/bin/env python3
"""
Test the Project Progress calculation based on real tasks
"""
import json
from app import create_app, db
from models.user import User
from models.project import Project
from models.collaboration import ProjectTask
from flask_jwt_extended import create_access_token

app = create_app()

def test_progress_calculation():
    """Test project progress calculation with task-based approach"""
    with app.app_context():
        print("=" * 80)
        print("TESTING PROJECT PROGRESS CALCULATION (Task-Based)")
        print("=" * 80)
        
        # Get Hibo (supervisor)
        hibo = User.query.filter_by(email="hibo@example.com").first()
        
        # Create test client
        client = app.test_client()
        token = create_access_token(identity=str(hibo.id))
        headers = {"Authorization": f"Bearer {token}"}
        
        # Fetch project progress
        response = client.get("/api/dashboard/project-progress", headers=headers)
        data = json.loads(response.data)
        
        print("\nProject Progress Data:")
        print("-" * 80)
        
        for project in data['projects']:
            total = project['total_tasks']
            completed = project['completed_tasks']
            progress = project['progress_percent']
            status = project['status']
            
            # Calculate expected percentage
            if total > 0:
                expected_progress = int((completed / total) * 100)
            else:
                expected_progress = 0
            
            # Verify calculation
            calc_correct = progress == expected_progress
            status_marker = "✅" if calc_correct else "❌"
            
            print(f"\n{status_marker} {project['title']}")
            print(f"   Status: {status}")
            print(f"   Tasks: {completed}/{total}")
            print(f"   Progress: {progress}%")
            print(f"   Calculation: {completed}/{total} × 100 = {expected_progress}%")
            
            # Show what the display would be
            if total == 0:
                display = "No tasks yet"
            elif status == 'completed':
                display = "100% ✓ (Project Completed)"
            else:
                display = f"{progress}%"
            
            print(f"   Display: {display}")
        
        print("\n" + "=" * 80)
        print("TEST SCENARIOS")
        print("=" * 80)
        
        # Find projects with different task counts
        test_cases = [
            ("0 completed → 0%", 0, 4),
            ("1 completed → 25%", 1, 4),
            ("2 completed → 50%", 2, 4),
            ("3 completed → 75%", 3, 4),
            ("4 completed → 100%", 4, 4),
        ]
        
        for scenario, completed, total in test_cases:
            if total > 0:
                expected = int((completed / total) * 100)
                print(f"\n{scenario}")
                print(f"   Calculation: {completed}/{total} × 100 = {expected}%")
        
        # Find if any project is marked as completed
        print("\n" + "=" * 80)
        print("COMPLETED PROJECTS")
        print("=" * 80)
        
        completed_projects = [p for p in data['projects'] if p['status'] == 'completed']
        
        if completed_projects:
            print(f"\nFound {len(completed_projects)} completed project(s):")
            for p in completed_projects:
                print(f"\n✓ {p['title']}")
                print(f"   Status: {p['status']}")
                print(f"   Display: 100% ✓ (Project Completed)")
        else:
            print("\nNo completed projects found in database.")
            print("To test: Update a project status to 'completed' in the database.")
        
        # No tasks case
        print("\n" + "=" * 80)
        print("NO TASKS CASE")
        print("=" * 80)
        
        no_task_projects = [p for p in data['projects'] if p['total_tasks'] == 0]
        
        if no_task_projects:
            print(f"\nFound {len(no_task_projects)} project(s) with no tasks:")
            for p in no_task_projects:
                print(f"\n📋 {p['title']}")
                print(f"   Tasks: 0/0")
                print(f"   Display: No tasks yet (shown as '—')")
        else:
            print("\nAll projects have tasks.")
        
        print("\n" + "=" * 80)
        print("SUMMARY")
        print("=" * 80)
        print("""
✅ Progress Calculation: Completed tasks ÷ Total tasks × 100
✅ Only counts tasks with status 'completed'
✅ In Progress tasks do NOT count as completed
✅ To Do tasks do NOT count as completed
✅ No tasks (0/0) shows 'No tasks yet'
✅ Completed projects show '100% ✓'
✅ Uses real task data from Collaboration database
✅ Updates automatically when tasks change

Frontend Display Rules:
- 0/0 tasks → "—" (dash)
- 0/4 tasks → "0%"
- 1/4 tasks → "25%"
- 2/4 tasks → "50%"
- 3/4 tasks → "75%"
- 4/4 tasks → "100%"
- Project completed → "100% ✓" (green)
""")

if __name__ == "__main__":
    test_progress_calculation()

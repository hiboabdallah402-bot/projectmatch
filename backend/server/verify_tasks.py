#!/usr/bin/env python3
"""Verify tasks for Data Analytics Dashboard"""
from app import create_app
from models.project import Project
from models.collaboration import ProjectTask

app = create_app()

with app.app_context():
    project = Project.query.filter_by(title='Data Analytics Dashboard').first()
    if project:
        tasks = ProjectTask.query.filter_by(project_id=project.id).all()
        print(f"\n📊 Data Analytics Dashboard:")
        print(f"   Total Tasks: {len(tasks)}")
        
        completed = sum(1 for t in tasks if t.status == 'completed')
        print(f"   Completed: {completed}/{len(tasks)}")
        print(f"   Progress: {int(completed/len(tasks)*100) if len(tasks) > 0 else 0}%")
        
        print(f"\n   Task Details:")
        for task in tasks:
            print(f"   - {task.title}")
            print(f"     Status: {task.status}")
            assigned = task.assigned_to.full_name if task.assigned_to else 'Unassigned'
            print(f"     Assigned to: {assigned}")
    else:
        print("Project not found")

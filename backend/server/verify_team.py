#!/usr/bin/env python3
"""Verify team members for Data Analytics Dashboard"""
from app import create_app
from models.project import Project
from models.collaboration import TeamMember

app = create_app()

with app.app_context():
    project = Project.query.filter_by(title='Data Analytics Dashboard').first()
    if project:
        team = TeamMember.query.filter_by(project_id=project.id).all()
        print(f"\n📊 Data Analytics Dashboard:")
        print(f"   Team Members: {len(team)}")
        for member in team:
            print(f"   ✓ {member.user.full_name} ({member.user.email})")
    else:
        print("Project not found")

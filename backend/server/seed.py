#!/usr/bin/env python
"""
Seed database with realistic test data
"""
from app import create_app
from extensions import db
from models.user import User
from models.project import Project
from models.application import Application
from werkzeug.security import generate_password_hash

def seed_database():
    """Populate database with test users and projects"""
    
    app = create_app()
    with app.app_context():
        # Clear existing data
        db.drop_all()
        db.create_all()
        
        print("🌱 Seeding database with test data...")
        
        # Create test users with realistic emails
        users_data = [
            {
                'full_name': 'Hibo Hassan',
                'email': 'hibo@example.com',
                'password': 'password123',
                'is_supervisor': True,
            },
            {
                'full_name': 'Ahmed Hassan',
                'email': 'ahmedhassan23@email.com',
                'password': 'password123',
                'is_supervisor': True,
            },
            {
                'full_name': 'Fatima Omar',
                'email': 'fatima.omar@email.com',
                'password': 'password123',
                'is_supervisor': False,
            },
            {
                'full_name': 'Mohammed Saeed',
                'email': 'mohammed.saeed88@email.com',
                'password': 'password123',
                'is_supervisor': True,
            },
            {
                'full_name': 'Zainab Ali',
                'email': 'zainab.ali42@email.com',
                'password': 'password123',
                'is_supervisor': False,
            },
            {
                'full_name': 'Karim Ibrahim',
                'email': 'karim.ibrahim@email.com',
                'password': 'password123',
                'is_supervisor': False,
            },
            {
                'full_name': 'Leila Mansour',
                'email': 'leila.mansour@email.com',
                'password': 'password123',
                'is_supervisor': True,
            },
            {
                'full_name': 'Tariq Al-Rashid',
                'email': 'tariq.rashid@email.com',
                'password': 'password123',
                'is_supervisor': True,
            },
            {
                'full_name': 'Amira Hassan',
                'email': 'amira.hassan@email.com',
                'password': 'password123',
                'is_supervisor': False,
            },
            {
                'full_name': 'Nabil Khalil',
                'email': 'nabil.khalil@email.com',
                'password': 'password123',
                'is_supervisor': False,
            },
        ]
        
        users = []
        for user_data in users_data:
            user = User(
                full_name=user_data['full_name'],
                email=user_data['email'],
                password_hash=generate_password_hash(user_data['password']),
                is_supervisor=user_data['is_supervisor'],
            )
            db.session.add(user)
            users.append(user)
            print(f"  ✓ Created user: {user_data['full_name']} ({user_data['email']})")
        
        db.session.commit()
        
        # Create test projects
        projects_data = [
            {
                'owner': users[0],  # Hibo Hassan
                'title': 'Mobile App Development',
                'description': 'Building a cross-platform mobile application with React Native',
                'required_skills': 'React Native, JavaScript, UI/UX Design',
                'team_size': 4,
                'status': 'open',
            },
            {
                'owner': users[3],  # Mohammed Saeed
                'title': 'Data Analytics Dashboard',
                'description': 'Create a comprehensive analytics dashboard for tracking project metrics',
                'required_skills': 'Python, Data Visualization, SQL',
                'team_size': 3,
                'status': 'open',
            },
            {
                'owner': users[0],  # Hibo Hassan
                'title': 'AI Chatbot Integration',
                'description': 'Integrate GPT-based chatbot into customer support system',
                'required_skills': 'Python, API Integration, NLP',
                'team_size': 2,
                'status': 'open',
            },
            {
                'owner': users[6],  # Leila Mansour
                'title': 'E-commerce Platform Redesign',
                'description': 'Complete redesign and modernization of existing e-commerce platform',
                'required_skills': 'React, Node.js, MongoDB, UI/UX Design',
                'team_size': 5,
                'status': 'open',
            },
            {
                'owner': users[7],  # Tariq Al-Rashid
                'title': 'Cloud Infrastructure Automation',
                'description': 'Automate cloud infrastructure deployment and management',
                'required_skills': 'AWS, Docker, Kubernetes, DevOps',
                'team_size': 3,
                'status': 'open',
            },
        ]
        
        projects = []
        for i, proj_data in enumerate(projects_data):
            project = Project(
                owner_id=proj_data['owner'].id,
                title=proj_data['title'],
                description=proj_data['description'],
                required_skills=proj_data['required_skills'],
                team_size=proj_data['team_size'],
                status=proj_data['status'],
            )
            db.session.add(project)
            projects.append(project)
            print(f"  ✓ Created project: {proj_data['title']}")
        
        db.session.commit()
        
        # Create sample applications
        apps = [
            Application(
                user_id=users[2].id,  # Fatima Omar
                project_id=projects[0].id,  # Mobile App Development
                status='Accepted',
            ),
            Application(
                user_id=users[3].id,  # Mohammed Saeed
                project_id=projects[0].id,  # Mobile App Development
                status='Accepted',
            ),
            Application(
                user_id=users[4].id,  # Zainab Ali
                project_id=projects[0].id,  # Mobile App Development
                status='Accepted',
            ),
            Application(
                user_id=users[5].id,  # Karim Ibrahim
                project_id=projects[0].id,  # Mobile App Development
                status='Pending',
            ),
            Application(
                user_id=users[5].id,  # Karim Ibrahim
                project_id=projects[1].id,  # Data Analytics Dashboard
                status='Pending',
            ),
            # Add applications for AI Chatbot Integration (hibo@example.com project)
            Application(
                user_id=users[2].id,  # Fatima Omar
                project_id=projects[2].id,  # AI Chatbot Integration
                status='Accepted',
            ),
            Application(
                user_id=users[4].id,  # Zainab Ali
                project_id=projects[2].id,  # AI Chatbot Integration
                status='Accepted',
            ),
            # Add applications for E-commerce Platform Redesign (Leila Mansour project)
            Application(
                user_id=users[8].id,  # Amira Hassan
                project_id=projects[3].id,  # E-commerce Platform Redesign
                status='Accepted',
            ),
            Application(
                user_id=users[9].id,  # Nabil Khalil
                project_id=projects[3].id,  # E-commerce Platform Redesign
                status='Pending',
            ),
            # Add applications for Cloud Infrastructure Automation (Tariq Al-Rashid project)
            Application(
                user_id=users[8].id,  # Amira Hassan
                project_id=projects[4].id,  # Cloud Infrastructure Automation
                status='Accepted',
            ),
            Application(
                user_id=users[9].id,  # Nabil Khalil
                project_id=projects[4].id,  # Cloud Infrastructure Automation
                status='Accepted',
            ),
        ]
        
        for app in apps:
            db.session.add(app)
        
        db.session.commit()
        print(f"  ✓ Created sample applications")
        
        print("\n✅ Database seeded successfully!")
        print("\n📝 Test Account Credentials:")
        print("=" * 50)
        for user_data in users_data:
            print(f"Email: {user_data['email']}")
            print(f"Password: {user_data['password']}")
            if user_data['is_supervisor']:
                print(f"Role: Project Owner")
            else:
                print(f"Role: Student/Contributor")
            print("-" * 50)

if __name__ == '__main__':
    seed_database()

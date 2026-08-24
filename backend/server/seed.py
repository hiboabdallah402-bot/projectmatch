#!/usr/bin/env python
"""
Seed database with realistic test data
"""
from app import create_app
from extensions import db
from models.user import User
from models.project import Project
from models.application import Application
from models.collaboration import TeamMember, Notification, ProjectTask, ProjectAnnouncement, ProjectMessage, ProjectMeeting, ProjectReport
from werkzeug.security import generate_password_hash
from services import create_notification
from datetime import datetime, timedelta

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
                'is_supervisor': False,
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
                'is_supervisor': False,
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
                'is_supervisor': False,
            },
            {
                'full_name': 'Tariq Al-Rashid',
                'email': 'tariq.rashid@email.com',
                'password': 'password123',
                'is_supervisor': False,
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
        
        # Create sample applications spread across last 30 days
        now = datetime.utcnow()
        apps = [
            Application(
                user_id=users[2].id,  # Fatima Omar
                project_id=projects[0].id,  # Mobile App Development
                status='Accepted',
                applied_at=now - timedelta(days=2),  # Week 1
            ),
            Application(
                user_id=users[3].id,  # Mohammed Saeed
                project_id=projects[0].id,  # Mobile App Development
                status='Accepted',
                applied_at=now - timedelta(days=5),  # Week 1
            ),
            Application(
                user_id=users[4].id,  # Zainab Ali
                project_id=projects[0].id,  # Mobile App Development
                status='Accepted',
                applied_at=now - timedelta(days=10),  # Week 2
            ),
            Application(
                user_id=users[5].id,  # Karim Ibrahim
                project_id=projects[0].id,  # Mobile App Development
                status='Pending',
                applied_at=now - timedelta(days=15),  # Week 3
            ),
            Application(
                user_id=users[5].id,  # Karim Ibrahim
                project_id=projects[1].id,  # Data Analytics Dashboard
                status='Accepted',
                applied_at=now - timedelta(days=18),  # Week 3
            ),
            Application(
                user_id=users[4].id,  # Zainab Ali
                project_id=projects[1].id,  # Data Analytics Dashboard
                status='Accepted',
                applied_at=now - timedelta(days=12),  # Week 2
            ),
            # Add applications for AI Chatbot Integration (hibo@example.com project)
            Application(
                user_id=users[2].id,  # Fatima Omar
                project_id=projects[2].id,  # AI Chatbot Integration
                status='Accepted',
                applied_at=now - timedelta(days=1),  # Week 1
            ),
            Application(
                user_id=users[4].id,  # Zainab Ali
                project_id=projects[2].id,  # AI Chatbot Integration
                status='Accepted',
                applied_at=now - timedelta(days=8),  # Week 2
            ),
            # Add applications for E-commerce Platform Redesign (Leila Mansour project)
            Application(
                user_id=users[8].id,  # Amira Hassan
                project_id=projects[3].id,  # E-commerce Platform Redesign
                status='Accepted',
                applied_at=now - timedelta(days=12),  # Week 2
            ),
            Application(
                user_id=users[9].id,  # Nabil Khalil
                project_id=projects[3].id,  # E-commerce Platform Redesign
                status='Pending',
                applied_at=now - timedelta(days=22),  # Week 4
            ),
            # Add applications for Cloud Infrastructure Automation (Tariq Al-Rashid project)
            Application(
                user_id=users[8].id,  # Amira Hassan
                project_id=projects[4].id,  # Cloud Infrastructure Automation
                status='Accepted',
                applied_at=now - timedelta(days=3),  # Week 1
            ),
            Application(
                user_id=users[9].id,  # Nabil Khalil
                project_id=projects[4].id,  # Cloud Infrastructure Automation
                status='Accepted',
                applied_at=now - timedelta(days=7),  # Week 1/2
            ),
        ]
        
        for app in apps:
            db.session.add(app)
        
        db.session.commit()
        print(f"  ✓ Created sample applications")
        
        # Create notifications for all applications (simulating automatic behavior)
        for app in apps:
            project = db.session.get(Project, app.project_id)
            user = db.session.get(User, app.user_id)
            if project and user:
                notification_type = "application_submitted" if app.status == "Pending" else "application_accepted"
                message = (
                    f"New application from {user.full_name}" 
                    if app.status == "Pending" 
                    else f"{user.full_name} was accepted to your project"
                )
                create_notification(
                    user_id=project.owner_id,
                    notification_type=notification_type,
                    title=message,
                    message=f"Project: {project.title}",
                    priority="high" if app.status == "Pending" else "normal",
                    project_id=project.id,
                    application_id=app.id,
                )
        
        db.session.commit()
        print(f"  ✓ Created notifications for applications")
        
        # Add accepted applicants as team members
        accepted_apps = [app for app in apps if app.status == 'Accepted']
        for app in accepted_apps:
            team_member = TeamMember(
                project_id=app.project_id,
                user_id=app.user_id,
                added_by_id=None,  # Auto-added from application acceptance
                role='Contributor',
                is_leader=False,
            )
            db.session.add(team_member)
        
        db.session.commit()
        print(f"  ✓ Added {len(accepted_apps)} accepted applicants as team members")
        
        # Create tasks for projects
        tasks_data = [
            # Mobile App Development (projects[0]) - owner: Hibo Hassan
            {
                'project_id': projects[0].id,
                'title': 'Set up React Native environment',
                'description': 'Initialize project with Expo and configure build tools',
                'status': 'in_progress',
                'assigned_to_user_id': users[1].id,  # Ahmed Hassan
                'created_by_id': users[0].id,  # Hibo Hassan
                'due_at': now + timedelta(days=7),
            },
            {
                'project_id': projects[0].id,
                'title': 'Design mobile UI components',
                'description': 'Create reusable component library for the app',
                'status': 'to_do',
                'assigned_to_user_id': users[2].id,  # Fatima Omar
                'created_by_id': users[0].id,  # Hibo Hassan
                'due_at': now + timedelta(days=10),
            },
            # Data Analytics Dashboard (projects[1]) - owner: Mohammed Saeed
            {
                'project_id': projects[1].id,
                'title': 'Design database schema',
                'description': 'Create normalized database schema for analytics data',
                'status': 'completed',
                'assigned_to_user_id': users[4].id,  # Zainab Ali
                'created_by_id': users[3].id,  # Mohammed Saeed
                'due_at': now + timedelta(days=5),
            },
            {
                'project_id': projects[1].id,
                'title': 'Build data visualization components',
                'description': 'Create charts, graphs, and dashboard widgets',
                'status': 'in_progress',
                'assigned_to_user_id': users[5].id,  # Karim Ibrahim
                'created_by_id': users[3].id,  # Mohammed Saeed
                'due_at': now + timedelta(days=12),
            },
            # AI Chatbot Integration (projects[2]) - owner: Hibo Hassan
            {
                'project_id': projects[2].id,
                'title': 'Set up NLP pipeline',
                'description': 'Initialize natural language processing with transformer models',
                'status': 'completed',
                'assigned_to_user_id': users[1].id,  # Ahmed Hassan
                'created_by_id': users[0].id,  # Hibo Hassan
                'due_at': now - timedelta(days=2),
            },
            {
                'project_id': projects[2].id,
                'title': 'Integrate GPT API',
                'description': 'Connect to OpenAI API and handle responses',
                'status': 'in_progress',
                'assigned_to_user_id': users[2].id,  # Fatima Omar
                'created_by_id': users[0].id,  # Hibo Hassan
                'due_at': now + timedelta(days=8),
            },
            # E-commerce Platform Redesign (projects[3]) - owner: Leila Mansour
            {
                'project_id': projects[3].id,
                'title': 'Create wireframes and prototypes',
                'description': 'Design user flows and interface mockups',
                'status': 'completed',
                'assigned_to_user_id': users[4].id,  # Zainab Ali
                'created_by_id': users[6].id,  # Leila Mansour
                'due_at': now - timedelta(days=5),
            },
            # Cloud Infrastructure Automation (projects[4]) - owner: Tariq Al-Rashid
            {
                'project_id': projects[4].id,
                'title': 'Create Terraform configuration templates',
                'description': 'Develop reusable Terraform modules for cloud infrastructure',
                'status': 'completed',
                'assigned_to_user_id': users[7].id,  # Tariq Al-Rashid
                'created_by_id': users[7].id,  # Tariq Al-Rashid
                'due_at': now - timedelta(days=3),
            },
            {
                'project_id': projects[4].id,
                'title': 'Dockerize application services',
                'description': 'Create Docker containers and docker-compose for all services',
                'status': 'in_progress',
                'assigned_to_user_id': users[8].id,  # Noor Khalil
                'created_by_id': users[7].id,  # Tariq Al-Rashid
                'due_at': now + timedelta(days=5),
            },
            {
                'project_id': projects[4].id,
                'title': 'Configure Kubernetes deployment manifests',
                'description': 'Create K8s YAML files for production deployment',
                'status': 'to_do',
                'assigned_to_user_id': users[9].id,  # Sara Al-Mansoori
                'created_by_id': users[7].id,  # Tariq Al-Rashid
                'due_at': now + timedelta(days=10),
            },
            {
                'project_id': projects[4].id,
                'title': 'Set up AWS infrastructure and VPC',
                'description': 'Configure AWS VPC, security groups, and networking',
                'status': 'in_progress',
                'assigned_to_user_id': users[7].id,  # Tariq Al-Rashid
                'created_by_id': users[7].id,  # Tariq Al-Rashid
                'due_at': now + timedelta(days=7),
            },
        ]
        
        for task_data in tasks_data:
            task = ProjectTask(**task_data)
            db.session.add(task)
        
        db.session.commit()
        print(f"  ✓ Created {len(tasks_data)} tasks for projects")
        
        # Create announcements for projects
        announcements_data = [
            {
                'project_id': projects[0].id,  # Mobile App Development
                'content': 'Sprint planning for week 1 starts Monday at 10:00 AM. Please review the project backlog before the meeting.',
                'created_by_id': users[0].id,  # Hibo Hassan
            },
            {
                'project_id': projects[0].id,
                'content': 'UI/UX design review scheduled for Thursday at 3:00 PM. All team members should review the latest mockups.',
                'created_by_id': users[0].id,
            },
            {
                'project_id': projects[1].id,  # Data Analytics Dashboard
                'content': 'Database schema approved. Ahmed will start ETL pipeline setup this week. Expected completion by Friday.',
                'created_by_id': users[3].id,  # Mohammed Saeed
            },
            {
                'project_id': projects[1].id,
                'content': 'Dashboard visualization components are ready for integration. Please sync with the backend team.',
                'created_by_id': users[3].id,
            },
            {
                'project_id': projects[2].id,  # AI Chatbot Integration
                'content': 'NLP pipeline setup completed successfully! Next step: integrate with the GPT API.',
                'created_by_id': users[0].id,  # Hibo Hassan
            },
            {
                'project_id': projects[2].id,
                'content': 'Code review for authentication module scheduled for tomorrow at 2:00 PM. Please come prepared with your questions.',
                'created_by_id': users[0].id,
            },
            {
                'project_id': projects[3].id,  # E-commerce Platform Redesign
                'content': 'Design prototypes have been finalized and handed off to development team. Please start implementing components.',
                'created_by_id': users[6].id,  # Leila Mansour
            },
            {
                'project_id': projects[3].id,
                'content': 'Q&A session with stakeholders scheduled for next Tuesday. All team leads should attend.',
                'created_by_id': users[6].id,
            },
            {
                'project_id': projects[4].id,  # Cloud Infrastructure Automation
                'content': 'AWS credentials and access have been provisioned for all team members. Setup your local environment.',
                'created_by_id': users[7].id,  # Tariq Al-Rashid
            },
            {
                'project_id': projects[4].id,
                'content': 'Infrastructure as Code (IaC) strategy discussion meeting moved to Wednesday 4:00 PM.',
                'created_by_id': users[7].id,
            },
        ]
        
        for announcement_data in announcements_data:
            announcement = ProjectAnnouncement(**announcement_data)
            db.session.add(announcement)
        
        db.session.commit()
        print(f"  ✓ Created {len(announcements_data)} announcements for projects")
        
        # Create discussion messages for projects
        messages_data = [
            # Mobile App Development messages
            {
                'project_id': projects[0].id,
                'sender_id': users[0].id,  # Hibo Hassan
                'message': 'Welcome to the Mobile App Development project! Looking forward to building something great together.',
            },
            {
                'project_id': projects[0].id,
                'sender_id': users[1].id,  # Ahmed Hassan
                'message': 'Thanks Hibo! I am excited to work on this. Should we start with the React Native setup today?',
            },
            {
                'project_id': projects[0].id,
                'sender_id': users[0].id,
                'message': 'Yes, let\'s kick off the setup. I\'ll send the repository link and dev environment guide in a few minutes.',
            },
            {
                'project_id': projects[0].id,
                'sender_id': users[2].id,  # Fatima Omar
                'message': 'Great! I\'ve reviewed the UI designs. Ready to start implementing the components framework.',
            },
            # Data Analytics Dashboard messages
            {
                'project_id': projects[1].id,
                'sender_id': users[3].id,  # Mohammed Saeed
                'message': 'Hi team! Welcome to the Data Analytics Dashboard project. Our goal is to build a robust analytics platform.',
            },
            {
                'project_id': projects[1].id,
                'sender_id': users[4].id,  # Zainab Ali
                'message': 'Sounds great! I\'ve started working on the database schema. Should we use PostgreSQL or MongoDB?',
            },
            {
                'project_id': projects[1].id,
                'sender_id': users[3].id,
                'message': 'Let\'s go with PostgreSQL for better relational data handling. I\'ll review your schema by end of week.',
            },
            {
                'project_id': projects[1].id,
                'sender_id': users[5].id,  # Karim Ibrahim
                'message': 'I can start work on the visualization components. Any specific libraries you prefer? (D3, Chart.js, Recharts?)',
            },
            # AI Chatbot Integration messages
            {
                'project_id': projects[2].id,
                'sender_id': users[0].id,  # Hibo Hassan
                'message': 'The NLP pipeline is ready! Now we need to integrate with OpenAI\'s GPT API. Who wants to take this on?',
            },
            {
                'project_id': projects[2].id,
                'sender_id': users[2].id,  # Fatima Omar
                'message': 'I\'ll handle the API integration. Will need the API keys and endpoint documentation.',
            },
            {
                'project_id': projects[2].id,
                'sender_id': users[0].id,
                'message': 'Perfect! I\'ll send you the credentials securely. Remember to never commit them to the repo.',
            },
            {
                'project_id': projects[2].id,
                'sender_id': users[1].id,  # Ahmed Hassan
                'message': 'Should we implement rate limiting and error handling for the API calls?',
            },
            # E-commerce Platform Redesign messages
            {
                'project_id': projects[3].id,
                'sender_id': users[6].id,  # Leila Mansour
                'message': 'Welcome! The design phase is complete. Development team can now start building the new components.',
            },
            {
                'project_id': projects[3].id,
                'sender_id': users[4].id,  # Zainab Ali
                'message': 'Great work on the designs Leila! Very modern and user-friendly. Starting implementation today.',
            },
            {
                'project_id': projects[3].id,
                'sender_id': users[6].id,
                'message': 'Thanks! Let\'s have a daily standup to sync on progress. Meetings at 10 AM PST starting tomorrow.',
            },
            # Cloud Infrastructure Automation messages
            {
                'project_id': projects[4].id,
                'sender_id': users[7].id,  # Tariq Al-Rashid
                'message': 'Cloud Infrastructure project is live! All AWS credentials are set up. Let\'s review the architecture.',
            },
            {
                'project_id': projects[4].id,
                'sender_id': users[5].id,  # Karim Ibrahim
                'message': 'Excited to work on this! I\'ve used Terraform before. Should we use it for IaC?',
            },
            {
                'project_id': projects[4].id,
                'sender_id': users[7].id,
                'message': 'Yes! Terraform is perfect. I\'ll share the configuration templates. We\'ll dockerize everything too.',
            },
        ]
        
        for message_data in messages_data:
            message = ProjectMessage(**message_data)
            db.session.add(message)
        
        db.session.commit()
        print(f"  ✓ Created {len(messages_data)} discussion messages for projects")
        
        # Create meetings for projects
        meetings_data = [
            # Mobile App Development meetings
            {
                'project_id': projects[0].id,
                'title': 'Sprint Planning - Week 1',
                'description': 'Review backlog items and plan tasks for the week. Discuss priorities and assign work.',
                'scheduled_for': now + timedelta(days=1, hours=10),  # Tomorrow 10 AM
                'location': 'Conference Room A',
                'created_by_id': users[0].id,  # Hibo Hassan
            },
            {
                'project_id': projects[0].id,
                'title': 'UI/UX Design Review',
                'description': 'Review and approve latest UI mockups and designs. Provide feedback on user experience.',
                'scheduled_for': now + timedelta(days=3, hours=15),  # Thursday 3 PM
                'location': 'Online - Zoom',
                'created_by_id': users[0].id,
            },
            # Data Analytics Dashboard meetings
            {
                'project_id': projects[1].id,
                'title': 'Database Schema Review',
                'description': 'Discuss database structure, normalization, and performance optimization strategies.',
                'scheduled_for': now + timedelta(days=2, hours=14),  # Wednesday 2 PM
                'location': 'Conference Room B',
                'created_by_id': users[3].id,  # Mohammed Saeed
            },
            {
                'project_id': projects[1].id,
                'title': 'Data Pipeline Architecture Discussion',
                'description': 'Review ETL pipeline design and discuss data flow from source to analytics engine.',
                'scheduled_for': now + timedelta(days=5, hours=11),  # Friday 11 AM
                'location': 'Online - Teams',
                'created_by_id': users[3].id,
            },
            # AI Chatbot Integration meetings
            {
                'project_id': projects[2].id,
                'title': 'API Integration Kickoff',
                'description': 'Kick off the OpenAI API integration. Discuss authentication, rate limiting, and error handling.',
                'scheduled_for': now + timedelta(days=1, hours=14),  # Tomorrow 2 PM
                'location': 'Hibo\'s Office',
                'created_by_id': users[0].id,  # Hibo Hassan
            },
            {
                'project_id': projects[2].id,
                'title': 'Code Review - Authentication Module',
                'description': 'Review authentication implementation including OAuth setup and token management.',
                'scheduled_for': now + timedelta(days=1, hours=16),  # Tomorrow 4 PM
                'location': 'Online - Discord',
                'created_by_id': users[0].id,
            },
            # E-commerce Platform Redesign meetings
            {
                'project_id': projects[3].id,
                'title': 'Daily Standup',
                'description': 'Quick sync on daily progress. Each team member shares what they\'re working on and blockers.',
                'scheduled_for': now + timedelta(days=1, hours=10),  # Tomorrow 10 AM
                'location': 'Online - Slack Huddle',
                'created_by_id': users[6].id,  # Leila Mansour
            },
            {
                'project_id': projects[3].id,
                'title': 'Stakeholder Q&A Session',
                'description': 'Answer stakeholder questions about the platform redesign and gather additional requirements.',
                'scheduled_for': now + timedelta(days=6, hours=10),  # Next Tuesday 10 AM
                'location': 'Main Board Room',
                'created_by_id': users[6].id,
            },
            # Cloud Infrastructure Automation meetings
            {
                'project_id': projects[4].id,
                'title': 'Architecture Review - AWS Setup',
                'description': 'Review AWS infrastructure setup, discuss scaling strategy and security best practices.',
                'scheduled_for': now + timedelta(days=1, hours=13),  # Tomorrow 1 PM
                'location': 'Online - Google Meet',
                'created_by_id': users[7].id,  # Tariq Al-Rashid
            },
            {
                'project_id': projects[4].id,
                'title': 'Infrastructure as Code (IaC) Strategy',
                'description': 'Discuss Terraform configuration and Infrastructure as Code best practices for automation.',
                'scheduled_for': now + timedelta(days=3, hours=16),  # Wednesday 4 PM
                'location': 'Tech Lab',
                'created_by_id': users[7].id,
            },
        ]
        
        for meeting_data in meetings_data:
            meeting = ProjectMeeting(**meeting_data)
            db.session.add(meeting)
        
        db.session.commit()
        print(f"  ✓ Created {len(meetings_data)} meetings for projects")
        
        # Create reports for projects
        reports_data = [
            {
                'project_id': projects[0].id,
                'generated_by_id': users[0].id,  # Hibo Hassan
                'report_type': 'weekly_summary',
                'report_payload': {
                    'period': 'Week 1',
                    'status': 'On Track',
                    'tasks_completed': 2,
                    'tasks_pending': 3,
                    'team_members_active': 3,
                    'summary': 'Mobile app setup complete. UI component framework in progress.',
                },
            },
            {
                'project_id': projects[1].id,
                'generated_by_id': users[3].id,  # Mohammed Saeed
                'report_type': 'progress_report',
                'report_payload': {
                    'milestone': 'Database Schema',
                    'completion': 85,
                    'blockers': 'None',
                    'next_steps': 'ETL pipeline development',
                    'deadline': '2026-08-28',
                },
            },
            {
                'project_id': projects[2].id,
                'generated_by_id': users[0].id,  # Hibo Hassan
                'report_type': 'status_report',
                'report_payload': {
                    'project_name': 'AI Chatbot Integration',
                    'current_phase': 'API Integration',
                    'progress': 'In Progress',
                    'risk_level': 'Low',
                    'team_productivity': 'High',
                },
            },
            {
                'project_id': projects[3].id,
                'generated_by_id': users[6].id,  # Leila Mansour
                'report_type': 'design_report',
                'report_payload': {
                    'designs_completed': 25,
                    'designs_in_review': 5,
                    'feedback_addressed': '100%',
                    'timeline_status': 'Ahead of Schedule',
                    'next_delivery': '2026-08-25',
                },
            },
            {
                'project_id': projects[4].id,
                'generated_by_id': users[7].id,  # Tariq Al-Rashid
                'report_type': 'infrastructure_report',
                'report_payload': {
                    'aws_setup': 'Completed',
                    'services_configured': ['EC2', 'RDS', 'S3', 'CloudFront'],
                    'security_score': 95,
                    'cost_optimization': 'Good',
                    'readiness': 'Ready for Development',
                },
            },
        ]
        
        for report_data in reports_data:
            report = ProjectReport(**report_data)
            db.session.add(report)
        
        db.session.commit()
        print(f"  ✓ Created {len(reports_data)} reports for projects")
        
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

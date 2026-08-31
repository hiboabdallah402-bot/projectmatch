#!/usr/bin/env python3
"""
Test authorization logic for collaboration endpoints
"""
import sys
from app import create_app, db
from models.user import User
from models.project import Project
from models.application import Application
from routes.collaboration import (
    _is_supervisor,
    _is_project_owner,
    _is_team_member,
    _has_accepted_application,
    _ensure_project_access
)

app = create_app()

def test_authorization():
    """Test all authorization scenarios"""
    with app.app_context():
        print("=" * 60)
        print("TESTING COLLABORATION AUTHORIZATION")
        print("=" * 60)
        
        # Get test users
        hibo = User.query.filter_by(email="hibo@example.com").first()
        ahmed = User.query.filter_by(email="ahmedhassan23@email.com").first()
        fatima = User.query.filter_by(email="fatima.omar@email.com").first()
        unknown_user = User.query.filter_by(email="nabil.khalil@email.com").first()
        
        # Get test projects
        mobile_app = Project.query.filter_by(title="Mobile App Development").first()
        analytics = Project.query.filter_by(title="Data Analytics Dashboard").first()
        
        print(f"\nTest Users:")
        print(f"  Hibo (ID: {hibo.id}, Supervisor: {hibo.is_supervisor})")
        print(f"  Ahmed (ID: {ahmed.id}, Supervisor: {ahmed.is_supervisor})")
        print(f"  Fatima (ID: {fatima.id}, Supervisor: {fatima.is_supervisor})")
        print(f"  Unknown (ID: {unknown_user.id}, Supervisor: {unknown_user.is_supervisor})")
        
        print(f"\nTest Projects:")
        print(f"  Mobile App (ID: {mobile_app.id}, Owner: {mobile_app.owner_id})")
        print(f"  Analytics (ID: {analytics.id}, Owner: {analytics.owner_id})")
        
        # Test 1: Supervisor accessing any project
        print("\n" + "=" * 60)
        print("TEST 1: Supervisor accessing another user's project")
        print("=" * 60)
        is_sup = _is_supervisor(hibo.id)
        print(f"Hibo is supervisor: {is_sup}")
        access_result = _ensure_project_access(analytics, hibo.id)
        test1_pass = access_result is None and is_sup
        print(f"✅ PASS" if test1_pass else f"❌ FAIL")
        
        # Test 2: Project owner accessing own project
        print("\n" + "=" * 60)
        print("TEST 2: Project owner accessing own project")
        print("=" * 60)
        owner_id = mobile_app.owner_id
        owner = db.session.get(User, owner_id)
        is_owner = _is_project_owner(mobile_app, owner_id)
        print(f"User {owner.full_name} owns Mobile App: {is_owner}")
        access_result = _ensure_project_access(mobile_app, owner_id)
        test2_pass = access_result is None and is_owner
        print(f"✅ PASS" if test2_pass else f"❌ FAIL")
        
        # Test 3: Accepted team member accessing project
        print("\n" + "=" * 60)
        print("TEST 3: Team member accessing project")
        print("=" * 60)
        # Find a project with a team member
        from models.collaboration import TeamMember
        team_member = TeamMember.query.first()
        if team_member:
            member_user = db.session.get(User, team_member.user_id)
            member_project = db.session.get(Project, team_member.project_id)
            is_member = _is_team_member(team_member.project_id, team_member.user_id)
            print(f"{member_user.full_name} is team member of {member_project.title}: {is_member}")
            access_result = _ensure_project_access(member_project, team_member.user_id)
            test3_pass = access_result is None and is_member
            print(f"✅ PASS" if test3_pass else f"❌ FAIL")
        else:
            print("No team members found in database")
            test3_pass = False
        
        # Test 4: User with accepted application accessing project
        print("\n" + "=" * 60)
        print("TEST 4: User with accepted application accessing project")
        print("=" * 60)
        # Find a user with accepted application
        accepted_app = Application.query.filter_by(
            status="Accepted"
        ).first()
        
        if accepted_app:
            has_app = _has_accepted_application(accepted_app.project_id, accepted_app.user_id)
            app_user = db.session.get(User, accepted_app.user_id)
            proj = db.session.get(Project, accepted_app.project_id)
            print(f"{app_user.full_name} has accepted application to {proj.title}: {has_app}")
            access_result = _ensure_project_access(proj, accepted_app.user_id)
            test4_pass = access_result is None and has_app
            print(f"✅ PASS" if test4_pass else f"❌ FAIL")
        else:
            print("No accepted applications found in database")
            test4_pass = False
        
        # Test 5: Pending applicant denied access
        print("\n" + "=" * 60)
        print("TEST 5: Pending applicant denied access")
        print("=" * 60)
        pending_app = Application.query.filter_by(
            status="Pending"
        ).first()
        
        if pending_app:
            has_app = _has_accepted_application(pending_app.project_id, pending_app.user_id)
            app_user = db.session.get(User, pending_app.user_id)
            proj = db.session.get(Project, pending_app.project_id)
            print(f"{app_user.full_name} has pending application to {proj.title}")
            print(f"Has ACCEPTED application: {has_app}")
            access_result = _ensure_project_access(proj, pending_app.user_id)
            test5_pass = access_result is not None  # Should be denied
            print(f"✅ PASS (Access denied as expected)" if test5_pass else f"❌ FAIL")
        else:
            print("No pending applications found in database")
            test5_pass = False
        
        # Test 6: Unrelated normal user denied access
        print("\n" + "=" * 60)
        print("TEST 6: Unrelated normal user denied access")
        print("=" * 60)
        is_owner = _is_project_owner(analytics, unknown_user.id)
        is_member = _is_team_member(analytics.id, unknown_user.id)
        has_app = _has_accepted_application(analytics.id, unknown_user.id)
        print(f"Unknown user relationship to Analytics project:")
        print(f"  Is owner: {is_owner}")
        print(f"  Is team member: {is_member}")
        print(f"  Has accepted application: {has_app}")
        access_result = _ensure_project_access(analytics, unknown_user.id)
        test6_pass = access_result is not None  # Should be denied
        print(f"✅ PASS (Access denied as expected)" if test6_pass else f"❌ FAIL")
        
        # Summary
        print("\n" + "=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        tests = [
            ("Supervisor → ANY project", test1_pass),
            ("Project owner → Own project", test2_pass),
            ("Accepted member → Project", test3_pass),
            ("Accepted applicant → Project", test4_pass),
            ("Pending applicant → Denied", test5_pass),
            ("Unrelated user → Denied", test6_pass),
        ]
        
        passed = sum(1 for _, result in tests if result)
        total = len(tests)
        
        for test_name, result in tests:
            status = "✅" if result else "❌"
            print(f"{status} {test_name}")
        
        print(f"\nTotal: {passed}/{total} tests passed")
        
        if passed == total:
            print("\n🎉 All authorization tests passed!")
            return 0
        else:
            print(f"\n⚠️  {total - passed} test(s) failed")
            return 1

if __name__ == "__main__":
    sys.exit(test_authorization())

#!/usr/bin/env python3
"""
APPLICATIONS OVER TIME GRAPH - HOW IT WORKS

This script demonstrates the complete flow of the graph functionality
from data collection to display.
"""
import json
from datetime import datetime, timedelta
from app import create_app
from flask_jwt_extended import create_access_token
from models.user import User
from models.application import Application

app = create_app()

with app.app_context():
    print("=" * 80)
    print("APPLICATIONS OVER TIME - COMPLETE WORKFLOW")
    print("=" * 80)
    
    # Get test user
    hibo = User.query.filter_by(email="hibo@example.com").first()
    client = app.test_client()
    token = create_access_token(identity=str(hibo.id))
    headers = {"Authorization": f"Bearer {token}"}
    
    # Fetch dashboard stats
    response = client.get("/api/dashboard/stats", headers=headers)
    data = json.loads(response.data)
    
    print("\n📊 GRAPH DATA STRUCTURE")
    print("-" * 80)
    
    applications_over_time = data.get('applications_over_time', [])
    
    print(f"\nApplications Over Time Data:")
    for item in applications_over_time:
        period = item['period']
        count = item['count']
        bar = "█" * count if count > 0 else "—"
        print(f"  {period:8} │ {count:2d} applications │ {bar}")
    
    print("\n" + "=" * 80)
    print("HOW THE GRAPH WORKS")
    print("=" * 80)
    
    print("""
STEP 1: DATA COLLECTION (Backend)
─────────────────────────────────────────────────────────────────────────────
Location: backend/server/routes/dashboard.py → _get_applications_over_time()

Process:
1. Get all applications from database
2. Check each application's "applied_at" date
3. Group by week within last 30 days:
   - Week 1: Last 7 days (most recent)
   - Week 2: Days 8-14
   - Week 3: Days 15-21
   - Week 4: Days 22-30 (oldest)

Example:
  Today = August 21, 2026
  Start = August 22 - 29 days = July 23, 2026
  
  Week 1 (Aug 15-21): 2 applications
  Week 2 (Aug 8-14):  3 applications
  Week 3 (Aug 1-7):   1 application
  Week 4 (Jul 23-31): 0 applications

STEP 2: DATA TRANSFORMATION (Backend → Frontend)
─────────────────────────────────────────────────────────────────────────────
API Endpoint: GET /api/dashboard/stats

Response format:
{
  "applications_over_time": [
    {"period": "Week 4", "count": 0},
    {"period": "Week 3", "count": 1},
    {"period": "Week 2", "count": 3},
    {"period": "Week 1", "count": 2}
  ],
  ... other stats
}

STEP 3: FRONTEND PROCESSING
─────────────────────────────────────────────────────────────────────────────
File: frontend/src/pages/DashboardPage.jsx

1. Fetch from: axiosClient.get('/api/dashboard/stats')
2. Extract: dashboardStats.applications_over_time
3. Pass to: <AnalyticsSection applicationsOverTime={applicationsOverTime} />

STEP 4: CHART RENDERING
─────────────────────────────────────────────────────────────────────────────
File: frontend/src/components/dashboard/AnalyticsSection.jsx

Component: Recharts LineChart
- X-axis: Weeks (Week 4, Week 3, Week 2, Week 1)
- Y-axis: Number of applications
- Line: Total Applications (blue line)
- Points: Show exact count on hover

Visual Format:
┌─────────────────────────────────────────────────┐
│ Applications Over Time                          │
│                                                 │
│  3 │          ●───●                             │
│  2 │    ●────/     \\───●                         │
│  1 │   /             \\                          │
│  0 │●─/               \\──●                       │
│    └────────────────────────────────────────┘  │
│    Week 4  Week 3  Week 2  Week 1              │
└─────────────────────────────────────────────────┘
""")
    
    print("\n" + "=" * 80)
    print("KEY FEATURES")
    print("=" * 80)
    print("""
✅ REAL DATA
   - Uses actual application records from database
   - No hardcoded values
   - Updates with new applications

✅ TIME WINDOW
   - Shows last 30 days (4 weeks)
   - Week 1 = most recent (last 7 days)
   - Week 4 = oldest (22-30 days ago)

✅ AGGREGATION
   - Counts applications per week
   - Handles multiple applications same day
   - Shows trend over time

✅ DYNAMIC DISPLAY
   - Updates when new applications created
   - Handles zero applications (shows message)
   - Responsive chart layout

✅ USER VISIBILITY
   - Shows only accessible applications
   - Supervisors see all applications
   - Regular users see own project applications
""")
    
    print("\n" + "=" * 80)
    print("DATA FLOW DIAGRAM")
    print("=" * 80)
    print("""
Database (Application records)
         ↓
    [applied_at dates]
         ↓
Backend (_get_applications_over_time)
    - Filter last 30 days
    - Group by week
    - Count per week
         ↓
    [Week 1-4 with counts]
         ↓
API Response (/api/dashboard/stats)
         ↓
Frontend (DashboardPage)
    - Fetch stats
    - Extract applications_over_time
         ↓
Component (AnalyticsSection)
    - Transform data
    - Build chart data
         ↓
Recharts LineChart
    - Render X-axis (weeks)
    - Render Y-axis (count)
    - Draw line connecting points
         ↓
   🎯 Final Display
""")
    
    print("\n" + "=" * 80)
    print("CURRENT DATA")
    print("=" * 80)
    
    # Get all applications to show actual data
    all_apps = Application.query.all()
    print(f"\nTotal applications in database: {len(all_apps)}")
    
    if all_apps:
        print("\nApplication dates:")
        for app in sorted(all_apps, key=lambda a: a.applied_at, reverse=True)[:5]:
            user = app.user
            project = app.project
            print(f"  {app.applied_at.strftime('%Y-%m-%d %H:%M')} | {user.full_name:20} → {project.title}")
    
    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)
    print(f"""
Graph Type: Line Chart (Recharts)
Data Source: Application.applied_at timestamps
Time Period: Last 30 days (4 weeks)
Granularity: Weekly aggregation
Update Frequency: Real-time (fetched on page load)

Current Applications by Week:
  Week 1 (Recent):  {applications_over_time[3]['count']} applications
  Week 2:           {applications_over_time[2]['count']} applications
  Week 3:           {applications_over_time[1]['count']} applications
  Week 4 (Oldest):  {applications_over_time[0]['count']} applications
  ─────────────────────
  Total (30 days):  {sum(item['count'] for item in applications_over_time)} applications

The graph shows application submission trends over the last month,
helping supervisors understand project interest and engagement patterns.
""")

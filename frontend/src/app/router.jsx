import { createBrowserRouter } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import ApplicationsPage from '../pages/ApplicationsPage'
import AboutPage from '../pages/AboutPage'
import ProtectedLayout from '../layouts/ProtectedLayout'
import PublicLayout from '../layouts/PublicLayout'
import CreateProjectPage from '../pages/CreateProjectPage'
import DashboardPage from '../pages/DashboardPage'
import EditProjectPage from '../pages/EditProjectPage'
import EditProfilePage from '../pages/EditProfilePage'
import HomePage from '../pages/HomePage'
import LoginPage from '../pages/LoginPage'
import NotFoundPage from '../pages/NotFoundPage'
import ProjectDetailsPage from '../pages/ProjectDetailsPage'
import ProfilePage from '../pages/ProfilePage'
import ProjectsPage from '../pages/ProjectsPage'
import RegisterPage from '../pages/RegisterPage'
import ServerErrorPage from '../pages/ServerErrorPage'
import SetupStatusPage from '../pages/SetupStatusPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    errorElement: <ServerErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'setup-status',
        element: <SetupStatusPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/app',
    element: <ProtectedLayout />,
    errorElement: <ServerErrorPage />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <DashboardPage />,
          },
          {
            path: 'projects',
            element: <ProjectsPage />,
          },
          {
            path: 'projects/create',
            element: <CreateProjectPage />,
          },
          {
            path: 'projects/:projectId',
            element: <ProjectDetailsPage />,
          },
          {
            path: 'projects/:projectId/edit',
            element: <EditProjectPage />,
          },
          {
            path: 'applications',
            element: <ApplicationsPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'profile/edit',
            element: <EditProfilePage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
  {
    path: '/server-error',
    element: <ServerErrorPage />,
  },
])

export default router

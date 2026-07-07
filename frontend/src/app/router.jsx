import { createBrowserRouter } from 'react-router-dom'
import ProtectedLayout from '../layouts/ProtectedLayout'
import PublicLayout from '../layouts/PublicLayout'
import HomePage from '../pages/HomePage'
import ProtectedPlaceholderPage from '../pages/placeholders/ProtectedPlaceholderPage'
import PublicPlaceholderPage from '../pages/placeholders/PublicPlaceholderPage'
import SetupStatusPage from '../pages/SetupStatusPage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'about',
        element: <PublicPlaceholderPage />,
      },
      {
        path: 'setup-status',
        element: <SetupStatusPage />,
      },
    ],
  },
  {
    path: '/app',
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <ProtectedPlaceholderPage />,
      },
    ],
  },
])

export default router

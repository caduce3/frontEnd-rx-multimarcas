import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './pages/_layouts/app'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { SignIn } from './pages/auth/sign-in'
import { AuthLayout } from './pages/_layouts/auth'
import { SignUp } from './pages/auth/sign-up'
import { Players } from './pages/app/players/players'
import { NotFound } from './pages/404'
import { PlayersDetails } from './pages/app/players/players-details/players-details'
import { Users } from './pages/app/users/users'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <NotFound />,
        children: [
            {path: '/', element: <Dashboard />},
            {path: '/players', element: <Players />},
            {path: 'players/:id', element: <PlayersDetails />},
            {path: '/users', element: <Users />},
        ]
    },
    {
        path: '/',
        element: <AuthLayout />,
        children: [
            {path: '/sign-in', element: <SignIn />},
            {path: '/sign-up', element: <SignUp />}
        ]
    },
])
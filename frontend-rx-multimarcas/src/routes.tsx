import { createBrowserRouter } from 'react-router-dom'
import { AppLayout } from './pages/_layouts/app'
import { Dashboard } from './pages/app/dashboard/dashboard'
import { SignIn } from './pages/auth/sign-in'
import { AuthLayout } from './pages/_layouts/auth'
import { SignUp } from './pages/auth/sign-up'
import { NotFound } from './pages/404'
import { Funcionarios } from './pages/app/funcionarios/funcionarios'
import Clientes from './pages/app/clientes/clientes'
import DetalhesCliente from './pages/app/clientes/clientes-details/cliente-details'
import Produtos from './pages/app/produtos/produtos'

export const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        errorElement: <NotFound />,
        children: [
            {path: '/', element: <Dashboard />},
            {path: '/colaboradores', element: <Funcionarios />},
            {path: '/clientes', element: <Clientes />},
            {path: '/clientes/:id', element: <DetalhesCliente />},
            {path: '/produtos', element: <Produtos />},
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
import './global.css'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { Toaster } from 'sonner'
import { ThemeProvider } from './components/theme/theme-provider'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './lib/react-query'

export function App() {

  return (
    <HelmetProvider>
      <ThemeProvider storageKey='rxmultimarcas-theme' defaultTheme='light'>
        <Helmet titleTemplate='%s | RXmultimarcas'/>
        <Toaster richColors/>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
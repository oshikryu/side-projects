import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App'
import { TRPCReactProvider } from './trpc/react'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TRPCReactProvider>
      <App />
      <Toaster richColors />
      <ReactQueryDevtools />
    </TRPCReactProvider>
  </StrictMode>,
)

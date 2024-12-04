import { scan } from 'react-scan'; // import this BEFORE react
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App.tsx';
import './index.css';

if (typeof window !== 'undefined') {
    scan({
        enabled: true,
        log: true, // logs render info to console (default: false)
    });
}

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <App />
            {/*<ReactQueryDevtools initialIsOpen={true} />*/}
        </QueryClientProvider>
    </StrictMode>,
)

'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';

const QueryComponent: React.FC<{ children: ReactNode }> = ({children}) => {
    const queryClient: any = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
};

export default QueryComponent

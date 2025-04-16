'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const QueryComponent: React.FC<any> = ({children}: {children: React.ReactNode}) => {
    const queryClient: any = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    )
};

export default QueryComponent

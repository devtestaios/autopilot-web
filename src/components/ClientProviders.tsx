'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import PageTransition from "@/components/PageTransition";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <PageTransition>
            {children}
          </PageTransition>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
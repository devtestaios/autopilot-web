'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { ToastProvider } from "@/components/ui/Toast";
import PageTransition from "@/components/PageTransition";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SearchProvider>
          <ToastProvider>
            <PageTransition>
              {children}
            </PageTransition>
          </ToastProvider>
        </SearchProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
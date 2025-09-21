'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { AIProvider } from "@/contexts/AIContext";
import { AIControlProvider } from "@/contexts/AIControlContext";
import { WebSocketProvider } from "@/contexts/WebSocketContext";
import { CacheProvider } from "@/contexts/CacheContext";
import { ToastProvider } from "@/components/ui/Toast";
import { ErrorProvider } from "@/components/providers/ErrorProvider";
import PageTransition from "@/components/PageTransition";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ErrorProvider>
      <ThemeProvider>
        <CacheProvider>
          <WebSocketProvider>
            <AuthProvider>
              <SearchProvider>
                <AIProvider>
                  <AIControlProvider>
                    <ToastProvider>
                      <PageTransition>
                        {children}
                      </PageTransition>
                    </ToastProvider>
                  </AIControlProvider>
                </AIProvider>
              </SearchProvider>
            </AuthProvider>
          </WebSocketProvider>
        </CacheProvider>
      </ThemeProvider>
    </ErrorProvider>
  );
}
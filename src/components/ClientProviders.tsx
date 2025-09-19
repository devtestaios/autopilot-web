'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { SearchProvider } from "@/contexts/SearchContext";
import SimplifiedNavbar from "@/components/SimplifiedNavbar";
import UnifiedSidebar from "@/components/UnifiedSidebar";
import PageTransition from "@/components/PageTransition";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <SearchProvider>
        <SimplifiedNavbar />
        <UnifiedSidebar />
        <div className="md:ml-80 pt-16">
          <PageTransition>
            {children}
          </PageTransition>
        </div>
      </SearchProvider>
    </ThemeProvider>
  );
}
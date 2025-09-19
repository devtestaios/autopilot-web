'use client';

import { ThemeProvider } from "@/contexts/ThemeContext";
import { SearchProvider } from "@/contexts/SearchContext";
import Navbar from "@/components/Navbar";

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      <SearchProvider>
        <Navbar />
        {children}
      </SearchProvider>
    </ThemeProvider>
  );
}
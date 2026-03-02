"use client";

import { AuthProvider } from "@/components/providers/auth-provider";
import * as React from "react";
import { Header } from "./header";
import { MobileSidebar, Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background">
        {/* Fixed Sidebar (Desktop) */}
        <Sidebar />

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content - offset by sidebar width on desktop only */}
        <div className="transition-all duration-200 md:pl-[72px]">
          <Header onMenuToggle={() => setIsMobileMenuOpen(true)} />
          <main className="p-4 md:p-6">{children}</main>
        </div>
      </div>
    </AuthProvider>
  );
}

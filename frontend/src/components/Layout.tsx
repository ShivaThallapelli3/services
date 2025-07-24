// src/components/Layout.tsx
import React from "react";
import EmergencyHeader from "./EmergencyHeader";
import NavigationTabs from "./NavigationTabs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <EmergencyHeader />
      {/* <NavigationTabs /> */}
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </>
  );
}

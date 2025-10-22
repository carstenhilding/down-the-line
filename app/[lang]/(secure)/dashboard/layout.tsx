// app/[lang]/(secure)/dashboard/layout.tsx

import React from 'react';
// Antager, at du bruger SecureLayout fra et andet sted
// import SecureLayout from '../../../layouts/SecureLayout'; 

// Hvis du har en dedikeret layout-fil her (eller bruger SecureLayout fra layouts)
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Returner blot børnene, hvis du ikke har et specifikt Dashboard-layout endnu.
  // Hvis du bruger et SecureLayout, skal det wrappe children.
  
  // EKSEMPEL: Minimalt Layout
  return (
    <div className="flex min-h-screen">
        {/* Antag at du har en Sidebar her, men for nu beholder vi det simpelt: */}
        {children}
    </div>
  );

  /* HVIS DU BRUGER SecureLayout (som defineret i din oprindelige plan):
  return (
      <SecureLayout>
          {children}
      </SecureLayout>
  );
  */
}
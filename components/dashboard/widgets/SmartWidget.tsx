// components/dashboard/widgets/SmartWidget.tsx
"use client";

import React from 'react';

interface SmartWidgetProps {
    children: React.ReactNode;
    priority?: 'high' | 'medium' | 'low';
    className?: string;
    noPadding?: boolean; // <-- TILFØJET DENNE LINJE
}

// ### KORREKTION HER: Tilføjet 'noPadding' til props og betinget padding ###
export const SmartWidget = ({ children, priority = 'low', className = '', noPadding = false }: SmartWidgetProps) => {
    let borderStyle = 'border-gray-200';
    let color = 'text-black';
    
    if (priority === 'high') {
      borderStyle = 'border-orange-500 ring-2 ring-orange-500/20';
      color = 'text-orange-500';
    } else if (priority === 'medium') {
      borderStyle = 'border-black';
    }

    // ### RETTELSE: Tjekker 'noPadding' før p-4/md:p-6 tilføjes ###
    return (
      <div className={`@container bg-white ${noPadding ? '' : 'p-4 md:p-6'} rounded-xl shadow-md border transition-all duration-300 ${borderStyle} ${className} h-full flex flex-col`}>
          <div className={`${color} flex-1`}> 
              {children}
          </div>
      </div>
    );
};


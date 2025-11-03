// components/dashboard/widgets/SmartWidget.tsx
"use client";

import React from 'react';

interface SmartWidgetProps {
    children: React.ReactNode;
    priority?: 'high' | 'medium' | 'low';
    className?: string;
    noPadding?: boolean;
}


export const SmartWidget = ({ children, priority = 'low', className = '' }: SmartWidgetProps) => {
    let borderStyle = 'border-gray-200';
    let color = 'text-black';
    
    if (priority === 'high') {
      borderStyle = 'border-orange-500 ring-2 ring-orange-500/20';
      color = 'text-orange-500';
    } else if (priority === 'medium') {
      borderStyle = 'border-black';
    }

    // RETTET: Tilføjet '@container' for at gøre den til en "container"
    return (
      <div className={`@container bg-white p-4 md:p-6 rounded-xl shadow-md border transition-all duration-300 ${borderStyle} ${className} h-full flex flex-col`}>
          <div className={`${color} flex-1`}> 
              {children}
          </div>
      </div>
    );
};
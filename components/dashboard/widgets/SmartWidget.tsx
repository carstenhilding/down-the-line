// components/dashboard/widgets/SmartWidget.tsx
"use client";

import React from 'react';

interface SmartWidgetProps {
    children: React.ReactNode;
    priority?: 'high' | 'medium' | 'low';
    className?: string;
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

    return (
      <div className={`bg-white p-4 md:p-6 rounded-xl shadow-md border transition-all duration-300 ${borderStyle} ${className}`}>
          <div className={color}>
              {children}
          </div>
      </div>
    );
};
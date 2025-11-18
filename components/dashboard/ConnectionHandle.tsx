// components/dashboard/ConnectionHandle.tsx
"use client";

import React, { useRef } from 'react'; 
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { Point } from '@/lib/server/dashboard';

interface ConnectionHandleProps {
  position: Point;
  onDrag: (e: DraggableEvent, data: DraggableData) => void | false;
  onStop: (e: DraggableEvent, data: DraggableData) => void | false;
  scale: number;
}

const ConnectionHandle: React.FC<ConnectionHandleProps> = ({ position, onDrag, onStop, scale }) => {
  const nodeRef = useRef(null);
  
  return (
    <Draggable
      nodeRef={nodeRef} 
      position={position}
      onDrag={onDrag}
      onStop={onStop}
      scale={scale}
      onStart={(e) => {
        e.stopPropagation(); 
      }}
    >
      <g 
        ref={nodeRef}
        transform={`translate(${position.x}, ${position.y})`}
        style={{ pointerEvents: 'all', cursor: 'grab' }} 
      >
        {/* Usynlig større cirkel for nemmere at ramme */}
        <circle
          cx="0"
          cy="0"
          r={12 / scale}
          fill="transparent"
        />
        {/* Synlig cirkel */}
        <circle
          cx="0"
          cy="0"
          r={5 / scale}
          // RETTELSE: Farve er nu ORANGE
          fill="#f97316" 
          stroke="#ffffff"
          strokeWidth={1 / scale}
        />
      </g>
    </Draggable>
  );
};

export default ConnectionHandle;
// components/dashboard/ConnectionArrow.tsx
"use client";

import React from 'react';
import { ConnectionPointId, Point } from '@/lib/server/dashboard';

interface ConnectionArrowProps {
  start: Point;
  end: Point;
  fromPoint: ConnectionPointId;
  toPoint: ConnectionPointId | null;
  controlPoints?: { c1: Point; c2: Point } | null;
  isTemporary?: boolean;
  isSelected?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  isConnecting?: boolean; 
}

export const CURVE_OFFSET = 50; 

export function getSvgPath_defaultLogic(
  start: Point, 
  end: Point, 
  fromPoint: ConnectionPointId, 
  toPoint: ConnectionPointId
): { c1: Point, c2: Point, path: string } {
  
  let c1 = { ...start };
  let c2 = { ...end };

  switch (fromPoint) {
    case 'right': c1.x += CURVE_OFFSET; break;
    case 'left': c1.x -= CURVE_OFFSET; break;
    case 'top': c1.y -= CURVE_OFFSET; break;
    case 'bottom': c1.y += CURVE_OFFSET; break;
  }

  switch (toPoint) {
    case 'right': c2.x += CURVE_OFFSET; break;
    case 'left': c2.x -= CURVE_OFFSET; break;
    case 'top': c2.y -= CURVE_OFFSET; break;
    case 'bottom': c2.y += CURVE_OFFSET; break;
  }
  
  const dx = Math.abs(start.x - end.x);
  const dy = Math.abs(start.y - end.y);

  if (dx > dy) {
     const halfX = (start.x + end.x) / 2;
     c1 = { x: halfX, y: start.y };
     c2 = { x: halfX, y: end.y };
  } 
  else {
     const halfY = (start.y + end.y) / 2;
     c1 = { x: start.x, y: halfY };
     c2 = { x: end.x, y: halfY };
  }

  const path = `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
  return { c1, c2, path };
}

function getSvgPath(
  start: Point, 
  end: Point, 
  fromPoint: ConnectionPointId, 
  toPoint: ConnectionPointId | null, 
  isTemporary: boolean,
  controlPoints?: { c1: Point; c2: Point } | null
): { c1: Point, c2: Point, path: string } {
  
  if (isTemporary || !toPoint) {
      return { 
        c1: start, 
        c2: end, 
        path: `M ${start.x} ${start.y} L ${end.x} ${end.y}` 
      };
  }

  if (controlPoints) {
      return {
        c1: controlPoints.c1,
        c2: controlPoints.c2,
        path: `M ${start.x} ${start.y} C ${controlPoints.c1.x} ${controlPoints.c1.y}, ${controlPoints.c2.x} ${controlPoints.c2.y}, ${end.x} ${end.y}`
      };
  }
  
  return getSvgPath_defaultLogic(start, end, fromPoint, toPoint);
}


export default function ConnectionArrow({ 
  start, 
  end, 
  fromPoint, 
  toPoint, 
  controlPoints, 
  isTemporary = false, 
  isSelected = false, 
  onClick,
  isConnecting = false 
}: ConnectionArrowProps) {
  
  const { c1, c2, path: pathData } = getSvgPath(start, end, fromPoint, toPoint, isTemporary, controlPoints);
  
  // RETTELSE: Sætter pointerEvents baseret på om pilen er valgt
  const groupPointerEvents = isTemporary ? 'none' : (isSelected ? 'auto' : 'stroke');

  return (
    <g 
      onClick={onClick} 
      style={{ 
        cursor: isTemporary ? 'default' : (isConnecting ? 'crosshair' : 'pointer'),
        // RETTELSE: Opdaterer pointer-events
        pointerEvents: groupPointerEvents
      }}
      className={isConnecting ? 'connection-group-connecting' : ''}
    >
      {/* Usynlig, tyk streg til at fange klik nemmere */}
      <path
        d={pathData}
        stroke="transparent"
        strokeWidth="20"
        fill="none"
      />
      {/* Synlig streg */}
      <path
        d={pathData}
        // RETTELSE: Valgt er nu SORT, standard er ORANGE
        stroke={isTemporary ? "#fb923c" : (isSelected ? '#000000' : '#f97316')} 
        strokeWidth={isSelected ? 3 : 2} 
        fill="none"
        // RETTELSE: Vælger pilspids baseret på valgt-status
        markerEnd={isTemporary ? 'none' : (isSelected ? 'url(#arrowhead-selected)' : 'url(#arrowhead-default)')} 
        strokeDasharray={isTemporary ? "4 4" : "none"} 
        style={{ pointerEvents: 'none' }}
      />
      
      {isSelected && !isTemporary && (
        <>
          {/* Linje til C1 */}
          <line
            x1={start.x} y1={start.y}
            x2={c1.x} y2={c1.y}
            // RETTELSE: Hjælpelinje er nu ORANGE
            stroke="#f97316" 
            strokeWidth="1"
            strokeDasharray="3 3"
            style={{ pointerEvents: 'none' }}
          />
          {/* Linje til C2 */}
          <line
            x1={end.x} y1={end.y}
            x2={c2.x} y2={c2.y}
            // RETTELSE: Hjælpelinje er nu ORANGE
            stroke="#f97316" 
            strokeWidth="1"
            strokeDasharray="3 3"
            style={{ pointerEvents: 'none' }}
          />
        </>
      )}
    </g>
  );
}
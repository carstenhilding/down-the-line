// components/dashboard/ConnectionArrow.tsx
"use client";

import React from 'react';
import { ConnectionPointId } from '@/lib/server/dashboard';

type Point = { x: number; y: number };

interface ConnectionArrowProps {
  start: Point;
  end: Point;
  fromPoint: ConnectionPointId;
  toPoint: ConnectionPointId | null; // Null, hvis det er en midlertidig pil
  isTemporary?: boolean;
}

// Offset-værdi for hvor "buet" pilen skal være
const CURVE_OFFSET = 50; 

// Beregner stien (path data) for SVG-stregen (Cubic Bezier Curve)
function getSvgPath(
  start: Point, 
  end: Point, 
  fromPoint: ConnectionPointId, 
  toPoint: ConnectionPointId | null, 
  isTemporary: boolean
): string {
  
  // Hvis det er en midlertidig pil, der følger musen, tegn en lige linje
  if (isTemporary || !toPoint) {
      return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }
  
  // --- BEREGN KONTROLPUNKTER FOR EN BUET LINJE (Cubic Bezier) ---
  let c1 = { ...start };
  let c2 = { ...end };

  // 1. Beregn første kontrolpunkt (c1) baseret på startretningen
  switch (fromPoint) {
    case 'right': c1.x += CURVE_OFFSET; break;
    case 'left': c1.x -= CURVE_OFFSET; break;
    case 'top': c1.y -= CURVE_OFFSET; break;
    case 'bottom': c1.y += CURVE_OFFSET; break;
  }

  // 2. Beregn andet kontrolpunkt (c2) baseret på slutretningen
  switch (toPoint) {
    case 'right': c2.x += CURVE_OFFSET; break;
    case 'left': c2.x -= CURVE_OFFSET; break;
    case 'top': c2.y -= CURVE_OFFSET; break;
    case 'bottom': c2.y += CURVE_OFFSET; break;
  }
  
  // 3. Tjek for specielle tilfælde (f.eks. lige overfor hinanden) for pænere buer
  const dx = Math.abs(start.x - end.x);
  const dy = Math.abs(start.y - end.y);

  // Hvis de er vandret (mere vandret end lodret)
  if (dx > dy) {
     const halfX = (start.x + end.x) / 2;
     c1 = { x: halfX, y: start.y };
     c2 = { x: halfX, y: end.y };
  } 
  // Hvis de er lodret (mere lodret end vandret)
  else {
     const halfY = (start.y + end.y) / 2;
     c1 = { x: start.x, y: halfY };
     c2 = { x: end.x, y: halfY };
  }

  // M = MoveTo (start), C = Cubic Bezier (c1, c2, end)
  return `M ${start.x} ${start.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${end.x} ${end.y}`;
}

export default function ConnectionArrow({ start, end, fromPoint, toPoint, isTemporary = false }: ConnectionArrowProps) {
  
  const pathData = getSvgPath(start, end, fromPoint, toPoint, isTemporary);
  
  return (
    <path
      d={pathData}
      stroke={isTemporary ? "#fb923c" : "#f97316"} // Lys orange for midlertidig, mørk orange for permanent
      strokeWidth="2" // RETTELSE: Gjort smallere (fra 3 til 2)
      fill="none"
      markerEnd="url(#arrowhead)" // Reference til pil-hovedet (defineret i DashboardClient)
      strokeDasharray={isTemporary ? "4 4" : "none"} // Stiblet linje, hvis midlertidig
    />
  );
}
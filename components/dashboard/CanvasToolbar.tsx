// components/dashboard/CanvasToolbar.tsx
"use client";

// OPDATERET: Importer 'useState', 'useRef', 'useEffect'
import React, { useState, useRef, useEffect } from 'react';
import { StickyNote, Zap, Calendar, Image as ImageIcon, Save, Package } from 'lucide-react';
// OPDATERET: Importer de nye typer
import { CanvasCardPersist, NoteColor, NoteFont } from '@/lib/server/dashboard';

interface CanvasToolbarProps {
  // OPDATERET: onAddWidget tager nu 'options'
  onAddWidget: (type: CanvasCardPersist['type'], options?: { color?: NoteColor, font?: NoteFont }) => void;
  onOpenWidgetModal: () => void; 
  onChangeBackground: () => void;
  onSaveLayout: () => Promise<void>;
  t: any; // Oversættelser (fra dashboard)
}

/**
 * Dette er den flydende værktøjslinje i venstre side af Canvas (Miro-stil).
 */
export default function CanvasToolbar({ 
  onAddWidget, 
  onOpenWidgetModal, 
  onChangeBackground, 
  onSaveLayout, 
  t 
}: CanvasToolbarProps) {
  
  // NYT: State til at styre farve-popup'en
  const [isNotePopoverOpen, setIsNotePopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Luk popup, hvis man klikker udenfor
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsNotePopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);

  const buttonClass = "p-2 text-gray-700 rounded-lg hover:bg-orange-100 hover:text-orange-500 transition-colors cursor-pointer";

  // Handler til at tilføje en note med en specifik farve
  const handleAddNote = (color: NoteColor) => {
    onAddWidget('note', { color: color, font: 'marker' }); // Standard til marker-font
    setIsNotePopoverOpen(false);
  };

  return (
    // OPDATERET: Tilføjet 'relative' til containeren for popover
    <div ref={popoverRef} className="absolute top-2 left-2 z-20">
      {/* Selve værktøjslinjen */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col p-1 space-y-1">
          
          <button 
            title={t.addNote ?? 'Add Note'}
            className={`${buttonClass} ${isNotePopoverOpen ? 'bg-orange-100 text-orange-500' : ''}`}
            onClick={() => setIsNotePopoverOpen(!isNotePopoverOpen)} // Åbner/lukker popover
          >
            <StickyNote className="w-5 h-5" />
          </button>
          
          <button 
            title={t.addWidgetTitle ?? 'Add Widget'}
            className={buttonClass}
            onClick={onOpenWidgetModal}
          >
            <Package className="w-5 h-5" />
          </button>
          
          <hr className="my-1 border-gray-200" />

          <button 
            title={t.changeBackground ?? 'Change Background'}
            className={buttonClass}
            onClick={onChangeBackground} 
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button 
            title={t.saveLayout ?? 'Save Layout'}
            className={buttonClass}
            onClick={onSaveLayout} 
          >
            <Save className="w-5 h-5" />
          </button>
          
        </div>
      </div>

      {/* NYT: Popover til farvevalg */}
      {isNotePopoverOpen && (
        <div className="absolute top-0 left-full ml-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2">
          <div className="flex space-x-2">
            <button 
              title="Gul"
              className="w-8 h-8 rounded-full bg-yellow-200 border-2 border-white hover:border-orange-500"
              onClick={() => handleAddNote('yellow')}
            />
            <button 
              title="Blå"
              className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white hover:border-orange-500"
              onClick={() => handleAddNote('blue')}
            />
            <button 
              title="Pink"
              className="w-8 h-8 rounded-full bg-pink-200 border-2 border-white hover:border-orange-500"
              onClick={() => handleAddNote('pink')}
            />
          </div>
        </div>
      )}
    </div>
  );
}
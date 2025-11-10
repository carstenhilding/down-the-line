// components/dashboard/CanvasToolbar.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
// OPDATERET: Importerer 'Share2' og 'Trash2'
import { StickyNote, Zap, Calendar, Image as ImageIcon, Save, Package, Share2, Trash2 } from 'lucide-react';
import { CanvasCardPersist, NoteColor, NoteFont } from '@/lib/server/dashboard';

interface CanvasToolbarProps {
  onAddWidget: (type: CanvasCardPersist['type'], options?: { color?: NoteColor, font?: NoteFont }) => void;
  onOpenWidgetModal: () => void; 
  onChangeBackground: () => void;
  onSaveLayout: () => Promise<void>;
  onToggleConnections: () => void; 
  onClearConnections: () => void; // <-- NY PROP
  isConnecting: boolean; 
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
  onToggleConnections, 
  onClearConnections, // <-- NY
  isConnecting, 
  t 
}: CanvasToolbarProps) {
  
  const [isNotePopoverOpen, setIsNotePopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

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
  const activeButtonClass = "p-2 bg-orange-100 text-orange-500 rounded-lg cursor-pointer";


  const handleAddNote = (color: NoteColor) => {
    onAddWidget('note', { color: color, font: 'marker' });
    setIsNotePopoverOpen(false);
  };

  return (
    <div ref={popoverRef} className="absolute top-2 left-2 z-20">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col p-1 space-y-1">
          
          <button 
            title={t.addNote ?? 'Add Note'}
            className={isNotePopoverOpen ? activeButtonClass : buttonClass}
            onClick={() => setIsNotePopoverOpen(!isNotePopoverOpen)} 
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
          
          {/* --- NY FORBINDELSES-KNAP (OPGAVE 7) --- */}
          <button 
            title={t.toggleConnections ?? 'Toggle Connections'}
            className={isConnecting ? activeButtonClass : buttonClass}
            onClick={onToggleConnections} 
          >
            <Share2 className="w-5 h-5" />
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

          {/* NY SLET-KNAP (KUN HVIS isConnecting ER AKTIV) */}
          {isConnecting && (
             <button 
                title={t.clearConnections ?? 'Clear All Connections'}
                className={buttonClass} // Kan styles anderledes (f.eks. rød)
                onClick={onClearConnections} 
              >
                <Trash2 className="w-5 h-5" />
              </button>
          )}
          
        </div>
      </div>

      {/* Popover til farvevalg */}
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
// components/dashboard/CanvasToolbar.tsx
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { 
  StickyNote, 
  Package, 
  Share2, 
  Trash2, 
  ImageIcon, 
  Save,
  Grid3x3, 
  CalendarDays, 
  RectangleHorizontal, 
  Layers
} from 'lucide-react';
import { CanvasCardPersist, NoteColor, NoteFont, CanvasBackground } from '@/lib/server/dashboard';

interface CanvasToolbarProps {
  onAddWidget: (type: CanvasCardPersist['type'], options?: { color?: NoteColor, font?: NoteFont }) => void;
  onOpenWidgetModal: () => void; 
  onChangeBackground: (bg: CanvasBackground) => void;
  onSaveLayout: () => Promise<void>;
  onToggleConnections: () => void; 
  onClearConnections: () => void;
  isConnecting: boolean; 
  t: any; 
}

export default function CanvasToolbar({ 
  onAddWidget, 
  onOpenWidgetModal, 
  onChangeBackground, 
  onSaveLayout,
  onToggleConnections, 
  onClearConnections,
  isConnecting, 
  t 
}: CanvasToolbarProps) {
  
  const [isNotePopoverOpen, setIsNotePopoverOpen] = useState(false);
  const [isBgPopoverOpen, setIsBgPopoverOpen] = useState(false);
  
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsNotePopoverOpen(false);
        setIsBgPopoverOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [popoverRef]);

  const buttonClass = "p-2 text-black rounded-lg hover:text-orange-500 transition-colors cursor-pointer";
  const activeButtonClass = "p-2 bg-black text-orange-500 rounded-lg cursor-pointer";

  const handleAddNote = (color: NoteColor) => {
    onAddWidget('note', { color: color, font: 'marker' });
    setIsNotePopoverOpen(false);
  };
  
  const handleBgChange = (bg: CanvasBackground) => {
    onChangeBackground(bg);
    setIsBgPopoverOpen(false);
  };

  return (
    <div ref={popoverRef} className="absolute top-2 left-2 z-20">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200">
        <div className="flex flex-col p-1 space-y-1">
          
          <button 
            title={t.addNote ?? 'Add Note'}
            className={isNotePopoverOpen ? activeButtonClass : buttonClass}
            onClick={() => {
              setIsNotePopoverOpen(!isNotePopoverOpen);
              setIsBgPopoverOpen(false);
            }} 
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
            className={isBgPopoverOpen ? activeButtonClass : buttonClass}
            onClick={() => {
              setIsBgPopoverOpen(!isBgPopoverOpen);
              setIsNotePopoverOpen(false);
            }}
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

          {isConnecting && (
             <button 
                title={t.clearConnections ?? 'Clear All Connections'}
                className={buttonClass}
                onClick={onClearConnections} 
              >
                <Trash2 className="w-5 h-5" />
              </button>
          )}
          
        </div>
      </div>

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

      {/* Baggrunds-popover */}
      {isBgPopoverOpen && (
        <div className="absolute top-0 left-full ml-2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 w-40">
          
          {/* --- DIN VALGTE JUSTERING ER HER --- */}
          <div className="flex flex-col space-y-0.5">
            <button 
              title={t.bgDefault ?? 'Default'}
              className="flex items-center text-left w-full p-2 text-sm text-black rounded-md hover:text-orange-500 transition-colors"
              onClick={() => handleBgChange('default')}
            >
              <Layers className="w-4 h-4 mr-2" />
              {t.bgDefault ?? 'Default'}
            </button>
            <button 
              title={t.bgDots ?? 'Dots'}
              className="flex items-center text-left w-full p-2 text-sm text-black rounded-md hover:text-orange-500 transition-colors"
              onClick={() => handleBgChange('dots')}
            >
              <Grid3x3 className="w-4 h-4 mr-2" />
              {t.bgDots ?? 'Dots'}
            </button>
            <button 
              title={t.bgWeek ?? 'Week Plan'}
              className="flex items-center text-left w-full p-2 text-sm text-black rounded-md hover:text-orange-500 transition-colors"
              onClick={() => handleBgChange('week')}
            >
              <CalendarDays className="w-4 h-4 mr-2" />
              {t.bgWeek ?? 'Week Plan'}
            </button>
            <button 
              title={t.bgPitch ?? 'Pitch'}
              className="flex items-center text-left w-full p-2 text-sm text-black rounded-md hover:text-orange-500 transition-colors"
              onClick={() => handleBgChange('pitch')}
            >
              <RectangleHorizontal className="w-4 h-4 mr-2" />
              {t.bgPitch ?? 'Pitch'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
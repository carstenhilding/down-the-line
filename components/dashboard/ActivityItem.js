import React from 'react';
import { BookOpen, UserPlus, FileText } from 'lucide-react';

// OPDATERET: Ikon-farver er nu orange, sort/grå for at matche den visuelle identitet
const getActivityIcon = (type) => {
    switch (type) {
        case 'exercise_created':
            // Blå er erstattet med orange for "oprettelses"-handlinger
            return <BookOpen className="h-5 w-5 text-orange-500" />;
        case 'player_added':
            // Grøn er erstattet med sort/mørkegrå for "information"-handlinger
            return <UserPlus className="h-5 w-5 text-gray-800" />;
        default:
            return <FileText className="h-5 w-5 text-gray-500" />;
    }
};

const ActivityItem = ({ type, text, time }) => {
    return (
        <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg">
            <div className="flex-shrink-0 bg-gray-100 rounded-full p-2">
                {getActivityIcon(type)}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{text}</p>
            </div>
            <div className="inline-flex items-center text-xs font-semibold text-gray-500">
                {time}
            </div>
        </div>
    );
};

export default ActivityItem;


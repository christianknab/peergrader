import React from 'react';
import { format } from 'date-fns';

interface AsgnData {
    asgn_id: string;
    name: string;
    course_id: string;
    course_name: string;
    max_score: number;
    final_score: number;
    phase: string;
    start_date_submission: Date;
    end_date_submission: Date;
    start_date_grading: Date;
    end_date_grading: Date;
}

interface RemindersComponentProps {
    reminders: { type: string; assignment: AsgnData }[];
}

const RemindersComponent: React.FC<RemindersComponentProps> = ({ reminders }) => {
    return (
        <div className="reminders-section mt-4 rounded-lg overflow-hidden shadow">
            <div className="white-blue-gradient p-3">
                <h3 className="text-xl text-left text-white font-semibold">Reminders</h3>
            </div>
            <div className="p-2 bg-white">
                <ul>
                    {reminders.map((reminder, index) => (
                        <li key={`${reminder.assignment.asgn_id}-${reminder.type}`} className={`mb-2 pb-2 ${index !== reminders.length - 1 ? 'border-b border-gray-300' : ''}`}>
                            <span className="font-bold">{reminder.assignment.name}</span> - {reminder.type === 'submission' ? 'Submission' : 'Grading'} due {format(new Date(reminder.type === 'submission' ? reminder.assignment.end_date_submission : reminder.assignment.end_date_grading), 'MMM d')}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default RemindersComponent;

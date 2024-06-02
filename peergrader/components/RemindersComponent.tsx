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
        <div className="reminders-section mt-4 p-4 bg-white rounded-lg shadow">
            <h3 className="font-semibold mb-2">Reminders</h3>
            <ul>
                {reminders.map(reminder => (
                    <li key={`${reminder.assignment.asgn_id}-${reminder.type}`} className="mb-2">
                        <span className="font-bold">{reminder.assignment.name}</span> - {reminder.type === 'submission' ? 'Submission' : 'Grading'} due {format(new Date(reminder.type === 'submission' ? reminder.assignment.end_date_submission : reminder.assignment.end_date_grading), 'MMM d')}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default RemindersComponent;

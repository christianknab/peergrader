import React from 'react';
import Calendar from 'react-calendar';
import { format } from 'date-fns';

interface CalendarComponentProps {
    highlightDates: { date: Date; type: 'submission' | 'grading' }[];
    handleDateChange: (date: Date) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ highlightDates, handleDateChange }) => {
    const tileClassName = ({ date, view }: { date: Date; view: string }) => {
        if (view === 'month') {
            const highlight = highlightDates.find(highlight => highlight.date.toDateString() === date.toDateString());
            if (highlight) {
                return highlight.type === 'submission' ? 'custom-calendar__tile--highlight-submission' : 'custom-calendar__tile--highlight-grading';
            }
        }
        return '';
    };

    return (
        <Calendar
            className="custom-calendar"
            tileClassName={tileClassName}
            onClickDay={handleDateChange}
        />
    );
};

export default CalendarComponent;

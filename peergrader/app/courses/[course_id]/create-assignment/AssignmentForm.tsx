'use client';

import { SetStateAction, useState } from 'react';
import { useEffect } from 'react';


interface Rubric {
    names: string[];
    descriptions: string[];
    row_points: number[];
    col_points: number[];
}

interface AssignmentFormProps {
    onSubmit: (assignmentName: string, rubric: Rubric[], anonymousGrading: boolean) => void;
    initialRubric: Rubric[];
    anonymousGrading: boolean;
    startDate: Date | null;
    endDate: Date | null;
    startTime: string;
    endTime: string;
}

function addDays(date: string | number | Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export const AssignmentForm = ({ onSubmit, initialRubric, anonymousGrading }: AssignmentFormProps) => {
    const [assignmentName, setAssignmentName] = useState('');
    const [anonymous, setAnonymous] = useState(anonymousGrading);
    const [rubric, setRubric] = useState<Rubric[]>(initialRubric);
    const [showSettings, setShowSettings] = useState(false);
    const [startSubmitDate, setSubmitStartDate] = useState(new Date());
    const [endSubmitDate, setSubmitEndDate] = useState(addDays(new Date(), 7));
    const [startGradeDate, setGradeStartDate] = useState(addDays(new Date(), 8));
    const [endGradeDate, setGradeEndDate] = useState(addDays(new Date(), 10));
    const [startSubmitTime, setSubmitStartTime] = useState("00:00");
    const [endSubmitTime, setSubmitEndTime] = useState("23:59");
    const [startGradeTime, setGradeStartTime] = useState("00:00");
    const [endGradeTime, setGradeEndTime] = useState("23:59");
    const [dateError, setDateError] = useState('');

    function validateDates() {
        const sumbitEndDateAdjusted = combineDateTime(endSubmitDate, endSubmitTime);
        const gradeStartDateAdjusted = combineDateTime(startGradeDate, startGradeTime);
        console.log(sumbitEndDateAdjusted, gradeStartDateAdjusted);


        if (sumbitEndDateAdjusted && gradeStartDateAdjusted) {
            // const nextDay = addDays(submitEndDate, 1);
            // console.log(submitEndDate, gradeStartDate, nextDay);
            console.log(sumbitEndDateAdjusted, gradeStartDateAdjusted);
            console.log(gradeStartDateAdjusted < sumbitEndDateAdjusted)
            if (gradeStartDateAdjusted < sumbitEndDateAdjusted) {
                setDateError('Grading must start at least one day after submission ends.');
            } else {
                setDateError('');
            }
        }
    }

    function combineDateTime(dateString: any, timeString: any) {
        if (!dateString || !timeString) {
            return null;
        }
        // Combine date and time string into a full ISO string format
        const dateTimeString = `${dateString.toISOString().split('T')[0]}T${timeString}:00`; // Adding seconds '00' for full format
        console.log(dateTimeString);
        return new Date(dateTimeString);
    }

    const handleSubmitStartDateChange = (event: { target: { value: string | number | Date; }; }) => {
        setSubmitStartDate(new Date(event.target.value));
    };

    const handleSubmitEndDateChange = (event: { target: { value: string | number | Date; }; }) => {
        setSubmitEndDate(new Date(event.target.value));
    };

    const handleGradeStartDateChange = (event: { target: { value: string; }; }) => {
        setGradeStartDate(new Date(event.target.value));
    };

    const handleGradeEndDateChange = (event: { target: { value: string | number | Date; }; }) => {
        setGradeEndDate(new Date(event.target.value));
    };

    const handleSubmitStartTimeChange = (event: { target: { value: string; }; }) => {
        setSubmitStartTime(event.target.value);
    };

    const handleSubmitEndTimeChange = (event: { target: { value: string }; }) => {
        setSubmitEndTime(event.target.value);
    };

    const handleGradeStartTimeChange = (event: { target: { value: string }; }) => {
        setGradeStartTime(event.target.value);
    };

    const handleGradeEndTimeChange = (event: { target: { value: string }; }) => {
        setGradeEndTime(event.target.value);
    };

    useEffect(() => {
        validateDates();
    }, [
        startSubmitDate,
        endSubmitDate,
        startGradeDate,
        endGradeDate,
        startSubmitTime,
        endSubmitTime,
        startGradeTime,
        endGradeTime,
    ]);


    useEffect(() => {
        setRubric(initialRubric);
        setAnonymous(anonymousGrading);
    }, [initialRubric]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(assignmentName, rubric, anonymous);
    };

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const handleColChange = (index: number, categoryIndex: number, value: string) => {
        const newRubric = [...rubric];
        newRubric[index].descriptions[categoryIndex] = value;
        setRubric(newRubric);
    };

    const handleColPointChange = (index: number, categoryIndex: number, value: number) => {
        const newRubric = [...rubric];
        newRubric[index].col_points[categoryIndex] = value;
        setRubric(newRubric);
    };

    const handleRowPointChange = (index: number, value: number) => {
        const newRubric = [...rubric];
        newRubric[index].row_points[0] = value;
        setRubric(newRubric);
    };

    const handleNameChange = (index: number, value: string) => {
        const newRubric = [...rubric];
        newRubric[index].names[0] = value;
        setRubric(newRubric);
    };

    const addColumn = (rowIndex: number) => {
        const newRubric = [...rubric];
        newRubric[rowIndex].descriptions.push('');
        newRubric[rowIndex].col_points.push(NaN);
        setRubric(newRubric);
    };

    const delColumn = (rowIndex: number, colIndex: number) => {
        const newRubric = [...rubric];
        newRubric[rowIndex].descriptions.splice(colIndex, 1);
        newRubric[rowIndex].col_points.splice(colIndex, 1);
        setRubric(newRubric);
    }

    const addRow = () => {
        const newRow = { names: [''], descriptions: [''], row_points: [NaN], col_points: [NaN] };
        setRubric([...rubric, newRow]);
    };

    const delRow = (rowIndex: number) => {
        const newRubric = [...rubric];
        newRubric.splice(rowIndex, 1);
        setRubric(newRubric);
    };

    const getHighestColPoints = (colPoints: number[]) => {
        return Math.max(...colPoints.map(point => Number.isNaN(point) ? 0 : point));
    };

    const isFormValid = () => {
        return rubric.every((item) => {
            return item.names.every(name => name !== '') &&
                item.descriptions.every(description => description !== '') &&
                item.col_points.every(point => !Number.isNaN(point));
        }) && assignmentName !== '';
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            <div className="mb-3">
                <label htmlFor="assignmentName" className="form-label">
                    Assignment Name:
                </label>
                <input
                    type="text"
                    id="assignmentName"
                    className={`form-control rounded-md p-2 ${assignmentName == '' ? 'bg-red-200' : ''}`}
                    value={assignmentName}
                    onChange={(e) => setAssignmentName(e.target.value)}
                    title={assignmentName == '' ? 'Please enter a name' : ''}
                />
            </div>

            <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={anonymousGrading} className="sr-only peer" onChange={() => setAnonymous(!anonymousGrading)} />
                <span>Anonymous Grading: </span>
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>

            <div>Accepting Submissions:

                <div className="flex items-center">
                    <input
                        type="date"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={startSubmitDate ? startSubmitDate.toISOString().split('T')[0] : ''}
                        onChange={handleSubmitStartDateChange}
                    />
                    <input
                        type="time"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                        value={startSubmitTime}
                        onChange={handleSubmitStartTimeChange}
                    />
                    <span className="p-2">to</span>
                    <input
                        type="date"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={endSubmitDate ? endSubmitDate.toISOString().split('T')[0] : ''}
                        onChange={handleSubmitEndDateChange}
                    />
                    <input
                        type="time"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                        value={endSubmitTime}
                        onChange={handleSubmitEndTimeChange}
                    />
                </div>

                <div className="text-red-500">{dateError}</div>
            </div>

            <div>Grading:
                <div className="flex items-center">
                    <input
                        type="date"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={startGradeDate ? startGradeDate.toISOString().split('T')[0] : ''}
                        onChange={handleGradeStartDateChange}
                    />
                    <input
                        type="time"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                        value={startGradeTime}
                        onChange={handleGradeStartTimeChange}
                    />
                    <span className="p-2">to</span>
                    <input
                        type="date"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={endGradeDate ? endGradeDate.toISOString().split('T')[0] : ''}
                        onChange={handleGradeEndDateChange}
                    />
                    <input
                        type="time"
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                        value={endGradeTime}
                        onChange={handleGradeEndTimeChange}
                    />
                </div>
            </div>


            <div className="mb-3">
                <div className="flex justify-between">Rubric:</div>
                <table className="border-l table-auto max-w-screen-lg">
                    <thead>
                        <tr>
                            <th className="border-b border-t w-1/4">Criteria</th>
                            <th className="border-b border-t border-l w-3/5">Rating</th>
                            <th className="border w-1/8">Points</th>
                            <th><button type="button" className="text-gray-500" onClick={toggleSettings}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg></button></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rubric.map((rubricItem, index) => {
                            const highestColPoint = getHighestColPoints(rubricItem.col_points);
                            const rowPointMismatch = rubricItem.row_points[0] !== highestColPoint;
                            return (
                                <tr key={index}>
                                    <td className="border-b border-r p-2">
                                        <textarea
                                            className={`resize-none h-10 rounded-md p-1 w-full h-24 ${rubricItem.names[0] == '' ? 'bg-red-200' : ''}`}
                                            value={rubricItem.names[0]}
                                            onChange={(e) => handleNameChange(index, e.target.value)}
                                            title={rubricItem.names[index] == '' ? 'Please enter a description' : ''}
                                        />
                                    </td>
                                    <td className="border-b p-0">
                                        <ul className="list-none p-0 w-full">
                                            {rubricItem.descriptions.map((description, descIndex) => (
                                                <li key={descIndex} className="inline-block p-2 w-full">
                                                    <div className="flex justify-between items-center space-x-2">
                                                        <input type="number" value={rubricItem.col_points[descIndex]} className={`border text-sm rounded-lg p-2.5 w-1/6 ${Number.isNaN(rubricItem.col_points[descIndex]) ? 'bg-red-200' : ''}`} placeholder="10" required onChange={(e) => handleColPointChange(index, descIndex, e.target.valueAsNumber)} title={Number.isNaN(rubricItem.col_points[descIndex]) ? 'Please enter a number' : ''} />
                                                        <textarea
                                                            className={`resize-none h-20 rounded-md p-1 flex-grow ${rubricItem.descriptions[descIndex] == '' ? 'bg-red-200' : ''}`}
                                                            value={description}
                                                            onChange={(e) => handleColChange(index, descIndex, e.target.value)}
                                                            title={rubricItem.descriptions[descIndex] == '' ? 'Please enter a description' : ''}
                                                        />
                                                        {showSettings &&
                                                            (<button type="button" className="text-red-500" role="alert" onClick={() => delColumn(index, descIndex)}>
                                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                                                                </svg>
                                                            </button>)}

                                                    </div>
                                                </li>
                                            ))}
                                            {showSettings &&
                                                (<div className="flex justify-center p-2"><button type="button" className="text-gray-500" onClick={() => addColumn(index)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                                </svg></button></div>)}
                                        </ul>
                                    </td>

                                    <td className="border-l border-r border-b p-4">
                                        <input type="number" className={`border text-sm rounded-lg block w-full p-2.5 ${rowPointMismatch ? 'bg-red-200' : ''}`} placeholder="10" value={rubricItem.row_points[0]} required onChange={(e) => handleRowPointChange(index, e.target.valueAsNumber)} title={rowPointMismatch ? 'Row points do not match the highest column points!' : ''} />
                                    </td>
                                    <td>{showSettings &&
                                        (<div className="flex justify-center p-2"><button type="button" className="text-red-500" role="alert" onClick={() => delRow(index)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                                            </svg>
                                        </button></div>)}</td>
                                </tr>
                            )
                        })}

                    </tbody>

                </table>
                {showSettings &&
                    (
                        <div className="flex justify-center p-2"><button type="button" className="text-gray-500" onClick={() => addRow()}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                        </svg></button></div>)}
            </div>
            <button type="submit" className="btn btn-primary" disabled={!isFormValid()}>
                Create Assignment
            </button>
        </form>
    );
};


// import { Datepicker } from 'flowbite-react';

// const DatePicker = ({ initialDate }) => {
//     console.log(initialDate);
// const [selectedDate, setSelectedDate] = useState(initialDate || null);

// const handleDateChange = (event) => {
//     setSelectedDate(event.target.value);
// };

//     return (
//         <div className="flex items-center">
//             <input
//                 type="date"
//                 className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={selectedDate || ''}
//                 onChange={handleDateChange}
//             />
//             {selectedDate && (
//                 <span className="ml-4 text-gray-600">Selected date: {selectedDate}</span>
//             )}
//         </div>
//     );
// };

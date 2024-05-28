'use client';
import { useState } from 'react';
import { useEffect } from 'react';
import { Rubric } from './page';
import { RubricMaker } from './RubricMaker';
import { SimpleRubric } from './SimpleRubric';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { markdownComponents } from '@/utils/constants';

interface AssignmentFormProps {
    onSubmit: (assignmentName: string,
        rubric: Rubric[],
        anonymousGrading: boolean,
        startSubmitDate: Date,
        endSubmitDate: Date,
        startGradeDate: Date,
        endGradeDate: Date,
        max_score: number,
        num_peergrades: number,
        num_annotations: number,
        numberInput: boolean,
        description: string,
    ) => void;
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

export const simple_description: string = `10: Excellent work.
8-9: Good work, some minor flaws.
6-7: Satisfactory work, missing some work.
5-6: Does some work, in the right direction.
3-4: Barely any work.
1-2: Little work put in.
0: Submission missing.`;

export const AssignmentForm = ({ onSubmit, initialRubric, anonymousGrading }: AssignmentFormProps) => {
    const [assignmentName, setAssignmentName] = useState('');
    const [assignmentDesc, setAssignmentDesc] = useState('');
    const [anonymous, setAnonymous] = useState(anonymousGrading);
    const [rubric, setRubric] = useState<Rubric[]>(initialRubric);
    const regex = new RegExp("^[0-9]*");
    const [simple_rubric, setSimpleRubric] = useState<Rubric[]>([{
        names: ["Overall Grade"],
        descriptions: [simple_description],
        row_points: [10],
        col_points: [10]
    }]);

    const [startSubmitDate, setSubmitStartDate] = useState(new Date());
    const [endSubmitDate, setSubmitEndDate] = useState(addDays(new Date(), 7));
    const [startGradeDate, setGradeStartDate] = useState(addDays(new Date(), 8));
    const [endGradeDate, setGradeEndDate] = useState(addDays(new Date(), 10));
    const [startSubmitTime, setSubmitStartTime] = useState("00:00");
    const [endSubmitTime, setSubmitEndTime] = useState("23:59");
    const [startGradeTime, setGradeStartTime] = useState("00:00");
    const [endGradeTime, setGradeEndTime] = useState("23:59");
    const [dateError, setDateError] = useState('');
    const [max_score, setMaxScore] = useState(0);
    const [num_peergrades, setNumPeergrades] = useState(5);
    const [numAnnotations, setNumAnnotations] = useState(1);
    const [customizeRubric, setCustomizeRubric] = useState(true);
    const [isPreview, setIsPreview] = useState(false);
    function validateDates(): boolean {
        const submitStartDateAdjusted = combineDateTime(startSubmitDate, startSubmitTime);
        const sumbitEndDateAdjusted = combineDateTime(endSubmitDate, endSubmitTime);
        const gradeStartDateAdjusted = combineDateTime(startGradeDate, startGradeTime);
        const gradeEndDateAdjusted = combineDateTime(endGradeDate, endGradeTime);

        if (gradeStartDateAdjusted < sumbitEndDateAdjusted) {
            setDateError('Grading must start after submission ends.');
            return false;
        }
        else if (submitStartDateAdjusted > sumbitEndDateAdjusted) {
            setDateError('Submission end date must come after start date.');
            return false;
        }
        else if (gradeStartDateAdjusted > gradeEndDateAdjusted) {
            setDateError('Grading end date must come after start date.');
            return false;
        }
        else {
            setDateError('');
            return true;
        }
    }

    function checkDates(): boolean {
        const submitStartDateAdjusted = combineDateTime(startSubmitDate, startSubmitTime);
        const sumbitEndDateAdjusted = combineDateTime(endSubmitDate, endSubmitTime);
        const gradeStartDateAdjusted = combineDateTime(startGradeDate, startGradeTime);
        const gradeEndDateAdjusted = combineDateTime(endGradeDate, endGradeTime);

        if (gradeStartDateAdjusted < sumbitEndDateAdjusted) {
            return false;
        }
        else if (submitStartDateAdjusted > sumbitEndDateAdjusted) {
            return false;
        }
        else if (gradeStartDateAdjusted > gradeEndDateAdjusted) {
            return false;
        }
        else {
            return true;
        }
    }

    function combineDateTime(dateString: any, timeString: any) {
        // Combine date and time string into a full ISO string format
        const dateTimeString = `${dateString.toISOString().split('T')[0]}T${timeString}:00`; // Adding seconds '00' for full format
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

    const toggleCustomizeRubric = () => {
        setCustomizeRubric(!customizeRubric);
    }



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
        onSubmit(assignmentName, customizeRubric ? rubric : simple_rubric, anonymous, combineDateTime(startSubmitDate, startSubmitTime), combineDateTime(endSubmitDate, endSubmitTime), combineDateTime(startGradeDate, startGradeTime), combineDateTime(endGradeDate, endGradeTime), max_score, num_peergrades, numAnnotations, !customizeRubric, assignmentDesc);
    };
    const handleKeyDown = (event: any) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            const start = event.target.selectionStart;
            const end = event.target.selectionEnd;

            // set textarea value to: text before caret + tab + text after caret
            event.target.value = event.target.value.substring(0, start)
                + "\t"
                + event.target.value.substring(end);

            // put caret at right position again (add one for the tab)
            event.target.selectionStart = event.target.selectionEnd = start + 1;
        }
    }
    const isFormValid = () => {
        return rubric.every((item) => {
            return item.names.every(name => name !== '') &&
                item.descriptions.every(description => description !== '') &&
                item.col_points.every(point => !Number.isNaN(point));
        }) && assignmentName !== '' && checkDates();
    };

    return (
        <form onSubmit={handleSubmit} className="container">
            {/* <div className="mb-3">
                Assignment Name:
                <input
                    type="text"
                    id="assignmentName"
                    className={`form-control block rounded-md p-2 ${assignmentName == '' ? 'bg-red-200' : ''}`}
                    value={assignmentName}
                    onChange={(e) => setAssignmentName(e.target.value)}
                    title={assignmentName == '' ? 'Please enter a name' : ''}
                />
            </div> */}
            <div>
                Assignment Name:
                <input
                    type="text"
                    className={`border text-sm rounded-lg block w-sm p-2.5 ${num_peergrades ? 0 : 0 <= 0 ? 'bg-red-200' : ''}`}
                    value={assignmentName}
                    required
                    onChange={(e) => setAssignmentName(e.target.value)} />
            </div>
            <div>
                Assignment Description:
                <div className='outline outline-gray-300 outline-1 rounded-md w-full max-w-3xl'>
                    <div className='flex flex-row'>
                        <div className='py-2 pl-2'><button className={`rounded-md py-1 px-3 ${!isPreview && "bg-blue-300"}`} onClick={(e)=>{e.preventDefault(); setIsPreview(false);}}>
                            Edit
                        </button></div>
                        <div className='py-2 pl-1'><button className={`px-3 py-1 rounded-md ${isPreview && "bg-blue-300"}`} onClick={(e)=>{e.preventDefault(); setIsPreview(true)}}>
                            Preview
                        </button></div>
                    </div>
                    {!isPreview ? <textarea
                        className='block w-full max-w-3xl h-52 p-2.5 outline-none focus:ring-0 focus:shadow-none border-t border-gray-300 rounded-b-md'
                        value={assignmentDesc}
                        maxLength={2000}
                        required
                        onKeyDown={handleKeyDown}
                        onChange={(e) => setAssignmentDesc(e.target.value)} /> :
                        <ReactMarkdown className="block w-full max-w-3xl h-52 p-2.5 overflow-y-auto resize-y bg-white rounded-b-md border-t border-gray-300" remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {assignmentDesc}
                        </ReactMarkdown>}</div>


            </div>






            {/* For now not enabling anonymous TODO LATER*/}
            {/* <label className="inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={anonymousGrading} className="sr-only peer" onChange={() => setAnonymous(!anonymousGrading)} />
                <span>Anonymous Grading: </span>
                <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label> */}

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
            <div className="text-red-500">{dateError}</div>

            <div>
                Number of Peergrades:
                <input
                    type="text"
                    inputMode='numeric'
                    className={`border text-sm rounded-lg block w-sm p-2.5 ${num_peergrades ? 0 : 0 <= 0 ? 'bg-red-200' : ''}`}
                    value={Number.isNaN(num_peergrades) ? "" : num_peergrades}
                    required
                    onChange={(e) => setNumPeergrades(parseInt(regex.exec(e.target.value)?.at(0) ?? ""))} />
            </div>
            <div>
                Number of required comments:
                <input
                    type="text"
                    inputMode='numeric'
                    className={`border text-sm rounded-lg block w-sm p-2.5 ${numAnnotations ? 0 : 0 <= 0 ? 'bg-red-200' : ''}`}
                    value={Number.isNaN(numAnnotations) ? "" : numAnnotations}
                    required
                    onChange={(e) => setNumAnnotations(parseInt(regex.exec(e.target.value)?.at(0) ?? ""))} />
            </div>

            <div className="flex">Rubric:</div>
            <div className='py-2'><div className='flex'><div><button onClick={toggleCustomizeRubric} className={`btn py-2 px-4 ${customizeRubric ? `font-bold bg-blue-200` : `bg-btn-background hover:bg-btn-background-hover`} rounded-md no-underline`} disabled={customizeRubric}>Custom</button></div>
                <div className='px-2'><button onClick={toggleCustomizeRubric} className={`btn py-2 px-4 ${!customizeRubric ? `font-bold bg-blue-200` : `bg-btn-background hover:bg-btn-background-hover`} rounded-md no-underline`} disabled={!customizeRubric}>Simple</button></div></div>
                {(customizeRubric) && <RubricMaker rubric={rubric} setRubric={setRubric} maxScore={max_score} setMaxScore={setMaxScore} />}
            </div>
            <div className='py-2'>
                {(!customizeRubric) && <SimpleRubric rubric={simple_rubric} setRubric={setSimpleRubric} maxScore={max_score} setMaxScore={setMaxScore} />}
            </div>

            <button type="submit"
                className={`btn btn-primary py-2 px-4 font-bold rounded-md ${isFormValid() ? `font-bold hover:bg-btn-background-hover` : ``} no-underline bg-btn-background`}
                disabled={!isFormValid()}>
                Create Assignment
            </button>
        </form>
    );
};
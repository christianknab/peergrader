'use client';

import { useState } from 'react';
import { useEffect } from 'react';

interface Rubric {
    names: string[];
    descriptions: string[];
    row_points: number[];
    col_points: number[];
}

interface AssignmentFormProps {
    onSubmit: (assignmentName: string, rubric: Rubric[]) => void;
    initialRubric: Rubric[];
}

export const AssignmentForm = ({ onSubmit, initialRubric }: AssignmentFormProps) => {
    const [assignmentName, setAssignmentName] = useState('');
    const [rubric, setRubric] = useState<Rubric[]>(initialRubric);

    useEffect(() => {
        setRubric(initialRubric);
    }, [initialRubric]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(assignmentName, rubric);
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
        setRubric(newRubric);
    };

    const delColumn = (rowIndex: number, colIndex: number) => {
        const newRubric = [...rubric];
        newRubric[rowIndex].descriptions.splice(colIndex, 1);
        setRubric(newRubric);
    }

    const addRow = () => {
        const newRow = { names: [''], descriptions: [''], row_points: [0], col_points: [0] };
        setRubric([...rubric, newRow]);
    };

    const delRow = (rowIndex: number) => {
        const newRubric = [...rubric];
        newRubric.splice(rowIndex, 1);
        setRubric(newRubric);
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
                    className="form-control"
                    value={assignmentName}
                    onChange={(e) => setAssignmentName(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <h2>Rubric:</h2>
                <table className="border-l table-auto max-w-screen-lg">
                    <thead>
                        <tr>
                            <th className="border-b border-t w-1/4">Criteria</th>
                            <th className="border-b border-t border-l w-3/5">Rating</th>
                            <th className="border w-1/8">Points</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rubric.map((rubricItem, index) => (
                            <tr key={index}>
                                <td className="border-b border-r p-2">
                                    <textarea
                                        className="resize-none h-10 rounded-md p-1 w-full h-24"
                                        value={rubricItem.names[0]}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                    />
                                </td>
                                <td className="border-b p-0">
                                    <ul className="list-none p-0 w-full">
                                        {rubricItem.descriptions.map((description, descIndex) => (
                                            <li key={descIndex} className="inline-block p-2 w-full">
                                                <div className="flex justify-between items-center space-x-2">
                                                    <input type="number" value={rubricItem.col_points[descIndex]} className="border text-sm rounded-lg p-2.5 w-1/6" placeholder="10" required onChange={(e) => handleColPointChange(index, descIndex, e.target.valueAsNumber)} />
                                                    <textarea
                                                        className="resize-none h-20 rounded-md p-1 flex-grow"
                                                        value={description}
                                                        onChange={(e) => handleColChange(index, descIndex, e.target.value)}
                                                    />
                                                    <button className="text-red-500" role="alert" onClick={() => delColumn(index, descIndex)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                        <div className="flex justify-center p-2"><button className="text-gray-500" onClick={() => addColumn(index)}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                            <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                                        </svg></button></div>
                                    </ul>
                                </td>

                                <td className="border-l border-r border-b p-4">
                                    <input type="number" className="border text-sm rounded-lg block w-full p-2.5" placeholder="10" value={rubricItem.row_points[0]} required onChange={(e) => handleRowPointChange(index, e.target.valueAsNumber)} />
                                </td>
                                <td><div className="flex justify-center p-2"><button className="text-red-500" role="alert" onClick={() => delRow(index)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clipRule="evenodd" />
                                    </svg>
                                </button></div></td>
                            </tr>
                        ))}

                    </tbody>

                </table>
                <div className="flex justify-center p-2"><button className="text-gray-500" onClick={() => addRow()}><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z" clipRule="evenodd" />
                </svg></button></div>
            </div>
            <button type="submit" className="btn btn-primary">
                Create Assignment
            </button>
        </form>
    );
};

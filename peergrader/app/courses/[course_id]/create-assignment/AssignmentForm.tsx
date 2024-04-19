'use client';

import { useState } from 'react';
import { useEffect } from 'react';

interface Rubric {
    names: string[];
    descriptions: string[];
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


    const handleRubricChange = (index: number, categoryIndex: number, value: string) => {
        const newRubric = [...rubric];
        newRubric[index].descriptions[categoryIndex] = value;
        setRubric(newRubric);
    };

    const handleNameChange = (index: number, value: string) => {
        const newRubric = [...rubric];
        newRubric[index].names[0] = value;
        setRubric(newRubric);
    };


    const addColumn = (rowIndex: number) => {
        const newRubric = [...rubric];
        newRubric[rowIndex].names.push('');
        newRubric[rowIndex].descriptions.push('');
        setRubric(newRubric);
    };

    const addRow = () => {
        const newRow = { names: [''], descriptions: [''] };
        setRubric([...rubric, newRow]);
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
                <table className="border border-collapse table-auto max-w-screen-md">
                    <thead>
                        <tr>
                            <th className="border-b w-1/4">Criteria</th>
                            <th className="border-b border-l w-2/4">Rating</th>
                            <th className="border-b border-l w-1/8">Points</th>
                            <th className="border-b border-l w-1/8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rubric.map((rubricItem, index) => (
                            <tr key={index}>
                                <td className="border-b p-2">
                                    <textarea
                                        className="resize-none rounded-md p-1 w-full h-24"
                                        value={rubricItem.names[0]}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                    />
                                </td>
                                <td className="border-b p-0">
                                    <ul className="list-none p-0 w-full">
                                        {rubricItem.descriptions.map((description, descIndex) => (
                                            <li key={descIndex} className="inline-block border-l p-2 w-full">
                                                <div className="flex justify-between items-center space-x-2">
                                                    <input type="number" className="border text-sm rounded-lg p-2.5 w-1/6" placeholder="10" required />
                                                    <textarea
                                                        className="resize-none rounded-md p-1 flex-grow"
                                                        value={description}
                                                        onChange={(e) => handleRubricChange(index, descIndex, e.target.value)}
                                                    />
                                                    <button className="text-red-500" role="alert" onClick={() => addColumn(index)}>
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                                            <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm3 10.5a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5h6Z" clip-rule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="border-l border-t p-4">
                                    <form className="max-w-sm mx-auto">
                                        <input type="number" className="border text-sm rounded-lg block w-full p-2.5" placeholder="10" required />
                                    </form>
                                </td>
                                <td className="border-l border-t p-4">
                                    <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded" onClick={() => addColumn(index)}>
                                        +
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <button type="submit" className="btn btn-primary">
                Create Assignment
            </button>
        </form>
    );
};

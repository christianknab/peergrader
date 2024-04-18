'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import styles from './AssignmentForm.module.css';

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(assignmentName, rubric);
    };


    const handleRubricChange = (index: number, categoryIndex: number, value: string) => {
        const newRubric = [...rubric];
        newRubric[index].descriptions[categoryIndex] = value;
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
                <table className="border border-collapse table-auto w-full">
                    <tbody>
                        {rubric.map((rubricItem, index) => (
                            <tr key={index} className="border-b">
                                <td className="border-r p-2">{rubricItem.names[0]}</td>
                                <td className="border-r p-2">
                                    <ul className="list-none p-0">
                                        {rubricItem.descriptions.map((description, descIndex) => (
                                            <li key={descIndex} className="mb-2 inline-block border-r p-2">
                                                <textarea
                                                    className="form-control"
                                                    value={description}
                                                    onChange={(e) => handleRubricChange(index, descIndex, e.target.value)}
                                                />
                                            </li>
                                        ))}
                                    </ul>
                                </td>
                                <td className="p-2">
                                    <button type="button" className="btn-secondary" onClick={() => addColumn(index)}>
                                        Add Column
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <button type="button" className="btn btn-secondary" onClick={addRow}>
                    Add Row
                </button>
            </div>
            <button type="submit" className="btn btn-primary">
                Create Assignment
            </button>
        </form>
    );
};
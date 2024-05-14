import { useEffect, useState } from 'react';
import { Rubric } from './page';
import { simple_description } from './AssignmentForm';
import SettingsIcon from '@/components/icons/Settings';
import MinusIcon from '@/components/icons/Minus';
import PlusIcon from '@/components/icons/Plus';

interface SimpleRubric {
    rubric: Rubric[];
    setRubric: (points: Rubric[]) => void;
    maxScore: number;
    setMaxScore: (points: number) => void;
}

export const SimpleRubric = (({ rubric, setRubric, maxScore, setMaxScore }: SimpleRubric) => {
    const [showSettings, setShowSettings] = useState(false);

    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const handleColChange = (index: number, categoryIndex: number, value: string) => {
        const newRubric = [...rubric];
        newRubric[index].descriptions[categoryIndex] = value;
        setRubric(newRubric);
    };

    const handleRowPointChange = (index: number, value: number) => {
        const newRubric = [...rubric];
        newRubric[index].row_points[0] = value;
        newRubric[index].col_points[0] = value;
        setRubric(newRubric);
    };

    const handleNameChange = (index: number, value: string) => {
        const newRubric = [...rubric];
        newRubric[index].names[0] = value;
        setRubric(newRubric);
    };

    const getHighestColPoints = (colPoints: number[]) => {
        return Math.max(...colPoints.map(point => Number.isNaN(point) ? 0 : point));
    };

    const addRow = () => {
        const newRow = {
            names: [""],
            descriptions: [simple_description],
            row_points: [10],
            col_points: [10]
        };
        setRubric([...rubric, newRow]);
    };

    const delRow = (rowIndex: number) => {
        const newRubric = [...rubric];
        newRubric.splice(rowIndex, 1);
        setRubric(newRubric);
    };

    // Make this less operations!!
    function getTotal(): number {
        let total = 0;
        for (let i = 0; i < rubric.length; i++) {
            total += rubric[i].row_points[0]
        }
        // rubric[0].row_points.forEach((el) => total += el)
        setMaxScore(total);
        return total;
    };

    return (<div className="mb-3">
        <button type="button" className="text-gray-500" onClick={toggleSettings}>{SettingsIcon()}</button>
        <table className="border-l table-auto max-w-screen-lg">
            <thead>
                <tr>
                    <th className="border-b border-t w-1/4">Criteria</th>
                    <th className="border-b border-t border-l w-3/5">Rating</th>
                    <th className="border w-1/8">Points</th>
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
                                                <textarea
                                                    className={`resize-none hover:resize-y h-60 rounded-md p-1 flex-grow ${rubricItem.descriptions[descIndex] == '' ? 'bg-red-200' : ''}`}
                                                    value={description}
                                                    onChange={(e) => handleColChange(index, descIndex, e.target.value)}
                                                    title={rubricItem.descriptions[descIndex] == '' ? 'Please enter a description' : ''}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td className="border-l border-r border-b p-4">
                                <input type="number" className={`border text-sm rounded-lg block w-full p-2.5 ${rowPointMismatch ? 'bg-red-200' : ''}`} placeholder="10" value={rubricItem.row_points[0]} required onChange={(e) => handleRowPointChange(index, e.target.valueAsNumber)} title={rowPointMismatch ? 'Row points do not match the highest column points!' : ''} />
                            </td>
                            <td>{showSettings &&
                                (<div className="flex justify-center p-2"><button type="button" className="text-red-500" role="alert" onClick={() => delRow(index)}>
                                    {MinusIcon()}
                                </button></div>)}</td>
                        </tr>
                    )
                })}
                <td className="border-l border-b"></td>
                <td className="border-b"></td>
                <td className="border-r border-b">Total: {getTotal()}</td>
            </tbody>
        </table>
        {showSettings &&
            (
                <div className="flex justify-center p-2"><button type="button" className="text-gray-500" onClick={() => addRow()}>{PlusIcon()}</button></div>)}
    </div>)
});

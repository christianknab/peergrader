import { useEffect, useState } from 'react';
import { Rubric } from './page';
import PlusIcon from '@/components/icons/Plus';
import MinusIcon from '@/components/icons/Minus';
import SettingsIcon from '@/components/icons/Settings';

interface RubricMaker {
    rubric: Rubric[];
    setRubric: (points: Rubric[]) => void;
    maxScore: number;
    setMaxScore: (points: number) => void;
}

export const RubricMaker = (({ rubric, setRubric, maxScore, setMaxScore }: RubricMaker) => {
    const [showSettings, setShowSettings] = useState(false);
    const regex = new RegExp("^[0-9]*");
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
        setTotal();
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
        setTotal();
    };

    const delRow = (rowIndex: number) => {
        const newRubric = [...rubric];
        newRubric.splice(rowIndex, 1);
        setRubric(newRubric);
        setTotal();
    };

    const getHighestColPoints = (colPoints: number[]) => {
        return Math.max(...colPoints.map(point => Number.isNaN(point) ? 0 : point));
    };

    // Make this less operations!!
    function setTotal() {
        let total = 0;
        for (let i = 0; i < rubric.length; i++) {
            if (!Number.isNaN(rubric[i].row_points[0])) {
                total += rubric[i].row_points[0];
            }
        }
        // rubric[0].row_points.forEach((el) => total += el)
        setMaxScore(total);
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
                                                <input type="text"
                                                    inputMode='numeric'
                                                    value={Number.isNaN(rubricItem.col_points[descIndex]) ? "" : rubricItem.col_points[descIndex]}
                                                    className={`border text-sm rounded-lg p-2.5 w-1/6 ${Number.isNaN(rubricItem.col_points[descIndex]) ? 'bg-red-200' : ''}`}
                                                    placeholder="10" 
                                                    required 
                                                    onChange={(e) => {
                                                        handleColPointChange(index, descIndex, parseInt(regex.exec(e.target.value)?.at(0) ?? ""));
                                                    }}
                                                    title={Number.isNaN(rubricItem.col_points[descIndex]) ? 'Please enter a number' : ''} />
                                                <textarea
                                                    className={`resize-none h-20 rounded-md p-1 flex-grow ${rubricItem.descriptions[descIndex] == '' ? 'bg-red-200' : ''}`}
                                                    value={description}
                                                    onChange={(e) => handleColChange(index, descIndex, e.target.value)}
                                                    title={rubricItem.descriptions[descIndex] == '' ? 'Please enter a description' : ''}
                                                />
                                                {showSettings &&
                                                    (<button type="button" className="text-red-500" role="alert" onClick={() => delColumn(index, descIndex)}>
                                                        {MinusIcon()}
                                                    </button>)}

                                            </div>
                                        </li>
                                    ))}
                                    {showSettings &&
                                        (<div className="flex justify-center p-2"><button type="button" className="text-gray-500" onClick={() => addColumn(index)}>{PlusIcon()}</button></div>)}
                                </ul>
                            </td>
                            <td className="border-l border-r border-b p-4">
                                <input
                                    type='text'
                                    inputMode='numeric'

                                    className={`border text-sm rounded-lg block w-full p-2.5 ${rowPointMismatch ? 'bg-red-200' : ''}`}
                                    // placeholder="10" 
                                    value={Number.isNaN(rubricItem.row_points[0]) ? "" : rubricItem.row_points[0]}
                                    required
                                    onChange={(e) => {
                                        handleRowPointChange(index, parseInt(regex.exec(e.target.value)?.at(0) ?? ""));
                                    }}
                                    title={rowPointMismatch ? 'Row points do not match the highest column points!' : ''} />
                            </td>
                            <td>{showSettings &&
                                (<div className="flex justify-center p-2"><button type="button" className="text-red-500" role="alert" onClick={() => delRow(index)}>
                                    <MinusIcon />
                                </button></div>)}
                            </td>
                        </tr>
                    )
                })}
                <tr>
                    <td className="border-l border-b"></td>
                    <td className="border-b"></td>
                    <td className="border-r border-b">Total: {maxScore}</td>
                </tr>
            </tbody>
        </table>
        {showSettings &&
            (
                <div className="flex justify-center p-2"><button type="button" className="text-gray-500" onClick={() => addRow()}>{PlusIcon()}</button></div>)}
    </div>)
});

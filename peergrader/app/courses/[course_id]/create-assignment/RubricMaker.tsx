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

    useEffect(() => {
        setTotal();
    }, [rubric])


    const toggleSettings = () => {
        setShowSettings(!showSettings);
    };

    const handleColChange = (row: number, col: number, value: string) => {
        const newRubric = [...rubric];
        newRubric[row].descriptions[col] = value;
        setRubric(newRubric);
    };

    const handleColPointChange = (row: number, col: number, value: number) => {
        const newRubric = [...rubric];
        newRubric[row].col_points[col] = value;
        setRubric(newRubric);
    };

    const handleRowPointChange = (row: number, value: number) => {
        const newRubric = [...rubric];
        newRubric[row].row_points[0] = value;
        setRubric(newRubric);

    };

    const handleNameChange = (row: number, value: string) => {
        const newRubric = [...rubric];
        newRubric[row].names[0] = value;
        setRubric(newRubric);
    };

    const addColumn = (row: number) => {
        const newRubric = [...rubric];
        newRubric[row].descriptions.push('');
        newRubric[row].col_points.push(NaN);
        setRubric(newRubric);
    };

    const delColumn = (row: number, col: number) => {
        const newRubric = [...rubric];
        newRubric[row].descriptions.splice(col, 1);
        newRubric[row].col_points.splice(col, 1);
        setRubric(newRubric);
    }

    const addRow = () => {
        const newRow = { names: [''], descriptions: [''], row_points: [NaN], col_points: [NaN] };
        setRubric([...rubric, newRow]);

    };

    const delRow = (row: number) => {
        const newRubric = [...rubric];
        newRubric.splice(row, 1);
        setRubric(newRubric);
    };

    const getHighestColPoints = (colPoints: number[]) => {
        return Math.max(...colPoints.map(point => Number.isNaN(point) ? 0 : point));
    };

    // TODO: Make less operations
    function setTotal() {
        let total = 0;
        for (let i = 0; i < rubric.length; i++) {
            if (!Number.isNaN(rubric[i].row_points[0])) {
                total += rubric[i].row_points[0];
            }
        }
        setMaxScore(total);
    };

    return (
        <div className="mb-3">
            <button type="button" className="write-grey" onClick={toggleSettings}>{SettingsIcon()}</button>
            <table className="border-l table-auto max-w-screen-lg">
                <thead>
                    <tr>
                        <th className="border-b border-t w-1/4">Criteria</th>
                        <th className="border-b border-t border-l w-3/5">Rating</th>
                        <th className="border w-1/8">Points</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Loop throw every row */}
                    {rubric.map((rubricItem, index) => {
                        const highestColPoint = getHighestColPoints(rubricItem.col_points);
                        const rowPointMismatch = rubricItem.row_points[0] !== highestColPoint;
                        return (
                            <tr key={index}>
                                {/* Row name */}
                                <td className="border-b border-r p-2">
                                    <textarea
                                        className={`resize-none rounded-md p-1 w-full h-24 ${rubricItem.names[0] == '' ? 'bg-red-200' : ''}`}
                                        value={rubricItem.names[0]}
                                        onChange={(e) => handleNameChange(index, e.target.value)}
                                        title={rubricItem.names[index] == '' ? 'Please enter a description' : ''}
                                        required
                                    />
                                </td>
                                {/* Column Descriptions for each row */}
                                <td className="border-b p-0">
                                    <ul className="list-none p-0 w-full">
                                        {rubricItem.descriptions.map((description, descIndex) => (
                                            <li key={descIndex} className="inline-block p-2 w-full">
                                                <div className="flex justify-between items-center space-x-2">
                                                    {/* Column points */}
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
                                                        required
                                                    />
                                                    {showSettings &&
                                                        (<button type="button" className="text-red-500" role="alert" onClick={() => delColumn(index, descIndex)}>
                                                            {MinusIcon()}
                                                        </button>)}

                                                </div>
                                            </li>
                                        ))}
                                        {showSettings &&
                                            (<div className="flex justify-center p-2"><button type="button" className="write-grey" onClick={() => addColumn(index)}>{PlusIcon()}</button></div>)}
                                    </ul>
                                </td>
                                {/* Row points */}
                                <td className="border-l border-r border-b p-4">
                                    <input
                                        type='text'
                                        inputMode='numeric'
                                        className={`border text-sm rounded-lg block w-full p-2.5 ${rowPointMismatch ? 'bg-red-200' : ''}`}
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
                    <div className="flex justify-center p-2"><button type="button" className="write-grey" onClick={() => addRow()}>{PlusIcon()}</button></div>)}
        </div>)
});

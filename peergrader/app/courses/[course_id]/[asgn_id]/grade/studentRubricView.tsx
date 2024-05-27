import { useState } from "react";
import { Rubric } from "../../create-assignment/page";
import { LoadingSpinner } from "@/components/loadingSpinner";

interface StudentRubricProps {
    setSelectedPoints: (points: number[]) => void;
    selectedPoints: number[];
    setPointsGiven: (points: number[]) => void;
    pointsGiven: number[];
    setTotal: (points: number) => void;
    total: number;
    viewOnly: boolean;
    rubricQueryData: {
        rubricData: {
            rubric: Rubric[];
            maxScore: number;
            numberInput: boolean;
        } | undefined,
        isRubricLoading: boolean,
        isRubricError: boolean
    };
}

export const StudentRubric = ({ setSelectedPoints, selectedPoints, setPointsGiven, pointsGiven, rubricQueryData, setTotal, total, viewOnly }: StudentRubricProps) => {

    const computeTotal = (selectedPoints: number[]) => {
        let tmp: number = 0;
        selectedPoints.forEach((num, index) => { if (num != -1) tmp += rubricQueryData.rubricData!.rubric[index].col_points[num] })
        setTotal(tmp);
    }

    const computeTotalGiven = (pointsGiven: number[]) => {
        let tmp: number = 0;
        pointsGiven.forEach((num) => { tmp += num })
        setTotal(tmp);
    }

    const pointClicked = (rubricIndex: number, categoryIndex: number) => {
        const newSelectedPoints = [...selectedPoints];
        if (newSelectedPoints[rubricIndex] == categoryIndex) {
            newSelectedPoints[rubricIndex] = -1;
            computeTotal(newSelectedPoints);
            setSelectedPoints(newSelectedPoints);
            return;
        }
        newSelectedPoints[rubricIndex] = categoryIndex;
        computeTotal(newSelectedPoints);
        setSelectedPoints(newSelectedPoints);
    };

    const handleRowPointChange = (index: number, value: number) => {
        const newPointsGiven = [...pointsGiven];
        newPointsGiven[index] = value;
        setPointsGiven(newPointsGiven);
        computeTotalGiven(newPointsGiven);
    }

    if (rubricQueryData.isRubricError) {
        return (<div>Error</div>);
    } else if (rubricQueryData.isRubricLoading || !rubricQueryData.rubricData) {
        return (<LoadingSpinner />);
    }

    return (
        <div className="p-3 w-full">
            {rubricQueryData.rubricData.rubric.map((rubricItem, index) => (
                <div key={index} className="mb-4">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                {!rubricQueryData.rubricData?.numberInput && <th className="border p-2 w-1/6">{selectedPoints[index] != -1 ? rubricItem.col_points[selectedPoints[index]] : 0}/{rubricItem.row_points[0]}</th>}
                                {rubricQueryData.rubricData?.numberInput && <th className="border p-2 w-1/6">{Number.isNaN(pointsGiven[index]) ? 0 : pointsGiven[index]}/{rubricItem.row_points[0]}</th>}
                                <th className="border p-2">{rubricItem.names[0]}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rubricItem.descriptions.map((description, descIndex) => (
                                <tr key={descIndex}>
                                    <td className="border-l border-b p-2 w-1/6">
                                        {!rubricQueryData.rubricData?.numberInput && <button
                                            disabled={viewOnly}
                                            onClick={() => pointClicked(index, descIndex)}
                                            className={`font-semibold py-2 px-3 border rounded ${selectedPoints[index] == descIndex
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'text-blue-700 hover:bg-gray-400 hover:text-white border-blue-500 hover:border-transparent'
                                                }`}>
                                            {rubricItem.col_points[descIndex]}
                                        </button>}
                                        {rubricQueryData.rubricData?.numberInput && <input type="number" className={`[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none border text-sm rounded-lg block w-full p-2.5 ${((pointsGiven[index] > rubricQueryData.rubricData.rubric[index].row_points[0]) || (Number.isNaN(pointsGiven[index]))) ? 'bg-red-200' : ''}`} placeholder="" value={pointsGiven[index]} required onChange={(e) => handleRowPointChange(index, e.target.valueAsNumber)} title={((pointsGiven[index] > rubricQueryData.rubricData.rubric[index].row_points[0]) || (Number.isNaN(pointsGiven[index]))) ? 'Must enter a valid number' : ''} />}
                                    </td>
                                    <td className="border-b border-r p-2">{description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            <div className="font-semibold">Total: {total} / {rubricQueryData.rubricData?.maxScore}</div>
        </div>

    );
};
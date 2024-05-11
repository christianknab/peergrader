import { useState } from "react";
import { Rubric } from "../../create-assignment/page";

interface StudentRubricProps {
    setSelectedPoints: (points: number[]) => void;
    selectedPoints: number[];
    rubric: Rubric[];
    maxPoints: number;
    setTotal: (points: number) => void;
    total: number;
}

export const StudentRubric = ({ setSelectedPoints, selectedPoints, rubric, maxPoints, setTotal, total }: StudentRubricProps) => {

    const computeTotal = (selectedPoints: number[]) => {
        let tmp: number = 0;
        selectedPoints.forEach((num, index) => { if (num != -1) tmp += rubric[index].col_points[num] })
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

    return (
        <div className="p-3 w-full">
            {rubric.map((rubricItem, index) => (
                <div key={index} className="mb-4">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 w-1/6">{selectedPoints[index] != -1 ? rubricItem.col_points[selectedPoints[index]] : 0}/{rubricItem.row_points[0]}</th>
                                <th className="border p-2">{rubricItem.names[0]}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rubricItem.descriptions.map((description, descIndex) => (
                                <tr key={descIndex}>
                                    <td className="border-l border-b p-2 w-1/6">
                                        <button
                                            onClick={() => pointClicked(index, descIndex)}
                                            className={`font-semibold py-2 px-3 border rounded ${selectedPoints[index] == descIndex
                                                ? 'bg-blue-500 text-white border-blue-500'
                                                : 'text-blue-700 hover:bg-gray-400 hover:text-white border-blue-500 hover:border-transparent'
                                                }`}
                                        >
                                            {rubricItem.col_points[descIndex]}
                                        </button>
                                    </td>
                                    <td className="border-b border-r p-2">{description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
            <div className="font-semibold">Total: {total} / {maxPoints}</div>
        </div>

    );
};
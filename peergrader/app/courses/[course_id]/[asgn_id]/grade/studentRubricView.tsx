import { Rubric } from "../../create-assignment/page";

interface StudentRubricProps {
    setSelectedPoints: (points: boolean[][]) => void;
    selectedPoints: boolean[][];
    rubric: Rubric[];
}

export const StudentRubric = ({ setSelectedPoints, selectedPoints, rubric }: StudentRubricProps) => {

    const pointClicked = (rubricIndex: number, categoryIndex: number) => {
        const newSelectedPoints = [...selectedPoints];

        if (newSelectedPoints[rubricIndex][categoryIndex] == true) {
            newSelectedPoints[rubricIndex][categoryIndex] = false;
            setSelectedPoints(newSelectedPoints);
            return;
        }
        // Reset all points in the current row to false
        newSelectedPoints[rubricIndex] = newSelectedPoints[rubricIndex].map(() => false);

        // Set the clicked point to true
        newSelectedPoints[rubricIndex][categoryIndex] = true;
        setSelectedPoints(newSelectedPoints);
    };

    return (
        <div className="p-3 w-full">
            {rubric.map((rubricItem, index) => (
                <div key={index} className="mb-4">
                    <table className="w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 w-1/6">Points/{rubricItem.row_points[0]}</th>
                                <th className="border p-2">{rubricItem.names[0]}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rubricItem.descriptions.map((description, descIndex) => (
                                <tr key={descIndex}>
                                    <td className="border-l border-b p-2 w-1/6">
                                        <button
                                            onClick={() => pointClicked(index, descIndex)}
                                            className={`font-semibold py-2 px-3 border rounded ${selectedPoints[index][descIndex]
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
        </div>
    );
};
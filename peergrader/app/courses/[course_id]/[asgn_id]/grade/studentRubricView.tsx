'use client'

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Rubric } from "../../create-assignment/page";
import { useParams } from "next/navigation";
import useRubricFromAsgnQuery from "@/utils/hooks/QueryRubric";
import { divide } from "lodash";

interface StudentRubricProps {
    pointClicked: (rubricIndex: number, categoryIndex: number) => void;
    selectedPoints: { [key: string]: boolean };
}


export const StudentRubric = ({ pointClicked, selectedPoints }: StudentRubricProps) => {
    const [rubric, setRubric] = useState<Rubric[]>([]);
    const params = useParams();
    const { data, isLoading, isError, error } = useRubricFromAsgnQuery(params.asgn_id.toString());

    useEffect(() => {
        if (data) {
            setRubric(data);
        }
    }, [data]); // Update rubric only when data changes

    const getSelectedCategoryIndex = (rubricIndex: number) => {
        const keys = Object.keys(selectedPoints);
        const filteredKey = keys.find(key => key.startsWith(`${rubricIndex}-`) && selectedPoints[key]);
        return filteredKey ? parseInt(filteredKey.split('-')[1], 10) : null;
    };

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error: {error?.message}</div>;
    if (!data || data.length === 0) return <div>No data available.</div>;


    return (<div className="p-3 w-full">
        {rubric.map((rubricItem, index) => {
            const selectedIndex = getSelectedCategoryIndex(index);
            return (<div key={index} className="mb-4">
                <table className="w-full table-auto border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2 w-1/6">Points {selectedIndex !== null ? rubricItem.col_points[selectedIndex] : 0}/{rubricItem.row_points[0]}</th>
                            <th className="border p-2">{rubricItem.names[0]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rubricItem.descriptions.map((description, descIndex) => (
                            <tr key={descIndex}>
                                <td className="border-l border-b p-2 w-1/6">
                                    <button onClick={() => pointClicked(index, descIndex)} className={`font-semibold py-2 px-3 border rounded ${selectedPoints[`${index}-${descIndex}`] ? 'bg-blue-500 text-white border-blue-500' : 'text-blue-700 hover:bg-gray-400 hover:text-white border-blue-500 hover:border-transparent'}`}>{rubricItem.col_points[descIndex]}</button>
                                </td>
                                <td className="border-b border-r p-2">{description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>);
        })}
    </div>)
}
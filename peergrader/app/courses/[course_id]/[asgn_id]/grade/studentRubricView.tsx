'use client'

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { Rubric } from "../../create-assignment/page";
import { useParams } from "next/navigation";

export const StudentRubric = () => {
    const supabase = createClient();
    const [rubric, setRubric] = useState<Rubric[]>([]);
    const [selectedPoints, setSelectedPoints] = useState<{ [key: string]: boolean }>({});
    const params = useParams();

    useEffect(() => {
        const fetchRubric = async () => {
            try {
                const { data, error } = await supabase.rpc('get_rubric', { asgn_id_param: params.asgn_id }); // hardcoded to 1 to get default rubric
                console.log(data);
                if (error) {
                    throw new Error('Error fetching rubric');
                }
                setRubric(data);
            } catch (error) {
                console.error('Error fetching rubric:', error);
            }
        };
        fetchRubric();
    }, []);

    const pointClicked = (rubricIndex: number, categoryIndex: number) => {
        const key = `${rubricIndex}-${categoryIndex}`;
        setSelectedPoints(prev => ({
            ...prev,
            [key]: !prev[key]  // Toggle the selection state
        }));
    };

    const getSelectedCategoryIndex = (rubricIndex: number) => {
        const keys = Object.keys(selectedPoints);
        const filteredKey = keys.find(key => key.startsWith(`${rubricIndex}-`) && selectedPoints[key]);
        console.log(filteredKey ? parseInt(filteredKey.split('-')[1], 10) : null);
        return filteredKey ? parseInt(filteredKey.split('-')[1], 10) : null;
    };

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
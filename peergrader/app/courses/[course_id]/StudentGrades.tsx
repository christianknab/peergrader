"use client";
import { supabase } from '@/utils/supabase/client';
import React, { useEffect, useState } from 'react';

interface StudentGradesProps {
    showGrades: boolean;
    onClose: () => void;
    uid: string;
    course_id: string;
}

type AsgnData = {
    asgn_id: string;
    name: string;
    final_score: number;
    phase: string;
    start_date_submission: Date;
    end_date_submission: Date;
    start_date_grading: Date;
    end_date_grading: Date;
} | null;

export default function StudentGrades({ showGrades, onClose, uid, course_id }: StudentGradesProps) {
    if (!showGrades) return null;
    const [asgns, setAsgns] = useState<AsgnData[]>([]);

    useEffect(() => {
        fetchAsgns().then(setAsgns);
    }, [uid, course_id]);

    async function fetchAsgns() {
        const { data, error } = await supabase.rpc('get_asgns_for_course_student', { course_id_param: course_id, user_id_param: uid });
        if (error) {
            console.error('Error fetching assignments:', error);
            return;
        }
        return data;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 relative w-3/4 max-w-4xl">
                <button className="absolute top-0 right-0 m-4 text-gray-500 hover:text-gray-700" onClick={onClose}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div className="p-5">
                    <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
                    <div className="shadow-md rounded-lg overflow-hidden">
                        <table className="w-full border-collapse bg-white">
                            <thead>
                                <tr className="bg-gray-200">
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phase</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Score</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {asgns.map((asgn) => (
                                    <tr key={asgn?.asgn_id} className="hover:bg-gray-100">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{asgn?.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{asgn?.phase}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{asgn?.final_score}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};


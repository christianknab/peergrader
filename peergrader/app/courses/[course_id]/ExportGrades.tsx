"use client";

import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import Papa from "papaparse";
import { useState } from "react";

interface AccountData {
    uid: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string | null;
}
type AsgnData = {
    asgn_id: string;
    name: string;
    phase: string;
    start_date_submission: Date;
    end_date_submission: Date;
    start_date_grading: Date;
    end_date_grading: Date;
}

export default function ExportGrades() {
    const params = useParams();
    const course_id = params.course_id as string;
    const supabase = createClient();
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);

    const downloadCSV = (data: string[][]) => {
        setIsPopUpOpen(false);
        const blob = new Blob([Papa.unparse(data)], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "Grades.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const handleExportGrades = async () => {
        setIsPopUpOpen(true);
        let dataMap = new Map<string, string[]>();
        console.log("Beginning Export");
        const { data: studentData, error: studentError } = await supabase.rpc('get_students_in_course', { course_id_param: course_id });
        if (studentError) {
            //FIXME
        }
        (studentData as AccountData[]).forEach((value) => { dataMap.set(value.uid, [value.first_name, value.last_name, value.email]) });
        const { data: assignmentData, error: assignmentError } = await supabase.rpc('get_asgns_for_course_teacher', { course_id_param: course_id });
        if (assignmentError) {
            //FIXME
        }
        for (var asgn of assignmentData as AsgnData[]) {
            for (var student of studentData as AccountData[]) {
                const { data: finalScore } = await supabase.rpc('calculate_final_score', {
                    user_id_param: student.uid,
                    asgn_id_param: asgn.asgn_id,
                });
                dataMap.get(student.uid)?.push(`${finalScore ?? "N/A"}`);
            }
        }
        downloadCSV(Array.from(dataMap.values()));
        return;
    }
    return (
        <div>
            {isPopUpOpen && (<div>
                <div className='fixed inset-0 opacity-50 bg-black z-40'>
                </div>
                <div className='fixed z-50 flex items-center inset-0 justify-center'>
                    <div className="w-4/5 h-4/5 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="flex flex-col items-center justify-center h-full px-6 py-4 text-center">

                            <h2 className="text-xl font-bold">Exporting Grades...</h2>
                            <p className="text-gray-700 text-base pb-10">
                                Please do not close this window.
                            </p>
                            <div className="relative h-3 w-4/5 bg-gray-200 rounded overflow-hidden">
                                <div
                                    className="absolute top-0 left-0 h-3 bg-blue-500 rounded"
                                    style={{ width: `${0.5 * 100}%` }}
                                ></div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>)}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={handleExportGrades}>
                Export Grades
            </button>
        </div>);
}
"use client";

import CloseIcon from "@/components/icons/CloseIcon";
import DownloadIcon from "@/components/icons/Download";
import useCourseDataQuery from "@/utils/hooks/QueryCourseData";
import { createClient } from "@/utils/supabase/client";
import { useParams } from "next/navigation";
import Papa from "papaparse";
import { join } from "path";
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
    max_score: number;
    end_date_grading: Date;
}

export default function ExportGrades() {
    const params = useParams();
    const course_id = params.course_id as string;
    const supabase = createClient();
    const [isPopUpOpen, setIsPopUpOpen] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0.0);
    const [data, setData] = useState<string[][] | null>(null);
    const [progressString, setProgressString] = useState<string | null>(null);

    const {
        data: courseData,
        isLoading: isCourseDataLoading,
        isError: isCourseDataError
    } = useCourseDataQuery(course_id);

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
        setProgressString("Reading students...");
        let dataMap = new Map<string, string[]>();
        const { data: studentData, error: studentError } = await supabase.rpc('get_students_in_course', { course_id_param: course_id });
        if (studentError) {
            //FIXME
        }
        setProgressString("Reading assignments...");
        (studentData as AccountData[]).forEach((value) => { dataMap.set(value.uid, [value.first_name, value.last_name, value.email]) });
        const { data: assignmentData, error: assignmentError } = await supabase.rpc('get_asgns_for_course_teacher', { course_id_param: course_id });
        if (assignmentError) {
            //FIXME
        }
        const header: string[] = ["First Name", "Last Name", "Email", ...(assignmentData as AsgnData[]).map((val) => { return `${val.name}/${val.max_score}` }), `Total/${(assignmentData as AsgnData[]).reduce((accumulator, value) => {
            return accumulator + value.max_score;
        }, 0)}`];
        const steps = (assignmentData as AsgnData[]).length * (studentData as AccountData[]).length;
        let count: number = 0;
        for (let i = 0; i < (assignmentData as AsgnData[]).length; i++) {
            const asgn = (assignmentData as AsgnData[])[i];
            for (let j = 0; j < (studentData as AccountData[]).length; j++) {
                const student = (studentData as AccountData[])[j];
                setProgressString(`Getting assignment ${i}, student ${j}...`);
                const { data: finalScore } = await supabase.rpc('calculate_final_score', {
                    user_id_param: student.uid,
                    asgn_id_param: asgn.asgn_id,
                });
                dataMap.get(student.uid)?.push(`${finalScore ?? "0"}`);
                count++;
                setProgress(count / steps * 100);
            }
        }
        const array: string[][] = Array.from(dataMap.values());
        array.forEach((value) => {
            const sum = value.reduce((accumulator, value, index) => {
                if (index < 3) return 0;
                console.log(Number.parseFloat(value));
                return accumulator + Number.parseFloat(value);
            }, 0);
            value.push(`${sum}`);
        });

        array.unshift(header)
        setData(array);
        setProgress(0);
        setProgressString(null);
        return;
    }
    // if (isCourseDataLoading || isCourseDataError) return (<></>);
    return (
        <div>
            {isPopUpOpen && (<div>
                <div className='fixed inset-0 opacity-50 bg-black z-40'>
                </div>
                <div className='fixed z-50 flex items-center inset-0 justify-center'>
                    <div className="w-4/5 h-4/5 bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-full px-4 py-4 text-center">

                            {!data ? <div className="h-full flex flex-col items-center justify-center">
                                <h2 className="text-xl font-bold">Exporting Grades...</h2>
                                <p className="text-gray-700 text-base pb-10">
                                    Please do not close this window.
                                </p>
                                <p className="text-gray-500">{progressString}</p>
                                <div className="relative h-3 w-4/5 bg-gray-200 rounded overflow-hidden">
                                    <div
                                        className="absolute top-0 left-0 h-3 bg-blue-500 rounded"
                                        style={{ width: `${progress}%` }}
                                    ></div>

                                </div>
                            </div>
                                :
                                <>
                                    <div className="flex justify-between items-start">
                                        <h1 className="text-left font-semibold text-xl">{courseData?.name}</h1>
                                        <div className="flex space-x-1 pb-4">
                                            <button title="Download CSV" onClick={(_) => {
                                                setIsPopUpOpen(false);
                                                downloadCSV(data);
                                                setData(null);
                                            }}>
                                                <DownloadIcon className="w-7 h-7 fill-gray-500" />
                                            </button>
                                            <button title="Close" onClick={(_) => {
                                                setIsPopUpOpen(false);
                                                setData(null);
                                            }}>
                                                <CloseIcon className="w-7 h-7 stroke-gray-500" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="overflow-auto">

                                        <table className="border-collapse bg-white">
                                            <thead>
                                                <tr className="bg-gray-200">
                                                    {data[0].map((val, index) => { return <th key={`header-${index}`} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{val}</th>; })}

                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">{data.map((row, i) => {
                                                if (i == 0) return;
                                                return (<tr key={`row-${i}`} className="hover:bg-gray-100">
                                                    {row.map((item, j) => {
                                                        return (
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600" key={`item-${i}-${j}`}>
                                                                {item}
                                                            </td>);
                                                    })}
                                                </tr>)
                                            })}</tbody>
                                        </table>
                                    </div>
                                </>
                            }

                        </div>

                    </div>
                </div>
            </div>)}
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full" onClick={handleExportGrades}>
                Export Grades
            </button>
        </div>);
}
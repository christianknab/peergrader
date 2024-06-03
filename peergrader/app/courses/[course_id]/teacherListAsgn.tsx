"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ListPhaseProgressBar from '@/components/ListPhaseProgressBar';

type AsgnData = {
    asgn_id: string;
    name: string;
    phase: string;
    start_date_submission: Date;
    end_date_submission: Date;
    start_date_grading: Date;
    end_date_grading: Date;
    max_score: number;
} | null;

interface ProgressData {
    [asgn_id: string]: {
        submissionProgress: number;
        gradingProgress: number;
    };
}


export default function TeacherListAsgn({ course_id }: { course_id: string }) {
    const supabase = createClient();
    const [asgns, setAsgns] = useState<AsgnData[]>([]);
    const [progressData, setProgressData] = useState<ProgressData>({});
    const router = useRouter();

    useEffect(() => {
        fetchAsgns(course_id).then(setAsgns);
    }, [course_id]);

    async function fetchAsgns(course_id: string) {
        const { data, error } = await supabase.rpc('get_asgns_for_course_teacher', { course_id_param: course_id });
        if (error) {
            console.error('Error fetching assignments:', error);
            return;
        }
        return data;
    }

    useEffect(() => {
        const updateProgressData = () => {
            const updatedProgressData: ProgressData = {};

            asgns.forEach((asgn) => {
                if (asgn) {
                    const currentDate = new Date();

                    const submissionStartDate = new Date(asgn.start_date_submission);
                    const submissionEndDate = new Date(asgn.end_date_submission);
                    const submissionTotalDays = (submissionEndDate.getTime() - submissionStartDate.getTime()) / (1000 * 60 * 60 * 24);
                    const submissionElapsedDays = (currentDate.getTime() - submissionStartDate.getTime()) / (1000 * 60 * 60 * 24);
                    const submissionProgress = (submissionElapsedDays / submissionTotalDays) * 100;

                    const gradingStartDate = new Date(asgn.start_date_grading);
                    const gradingEndDate = new Date(asgn.end_date_grading);
                    const gradingTotalDays = (gradingEndDate.getTime() - gradingStartDate.getTime()) / (1000 * 60 * 60 * 24);
                    const gradingElapsedDays = (currentDate.getTime() - gradingStartDate.getTime()) / (1000 * 60 * 60 * 24);
                    const gradingProgress = (gradingElapsedDays / gradingTotalDays) * 100;

                    updatedProgressData[asgn.asgn_id] = {
                        submissionProgress,
                        gradingProgress,
                    };
                }
            });

            setProgressData(updatedProgressData);
        };

        updateProgressData();
    }, [asgns]);


    return (
        <div className="flex flex-col w-full gap-6 h-full">
            <div className="flex flex-col rounded-lg overflow-hidden flex-grow">
                <div className="white-blue-gradient p-5 flex justify-between items-center">
                    <p className="text-xl text-left text-white font-semibold">Assignments</p>
                    <Link href={`/courses/${course_id}/create-assignment`} className="py-2 px-4 rounded-md light-grey write-grey font-semibold no-underline bg-btn-background hover:bg-btn-background-hover">
                        Add assignment
                    </Link>
                </div>
                <div className="light-grey flex-grow p-6">
                    {asgns && asgns.length > 0 ? (
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-400">
                                    <th className="px-6 py-3 text-left text-xs font-medium write-grey uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium write-grey uppercase tracking-wider">Points</th>
                                    <th className="py-3 text-left text-xs font-medium write-grey uppercase tracking-wider w-full">
                                        <div className="flex flex-row items-center justify-between">
                                            <span>Released</span>
                                            <div className="flex items-center space-x-4">
                                                <span>Submission due</span>
                                                <span>Grading opens</span>
                                            </div>
                                            <span>Grades due</span>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-300">
                                {asgns
                                    .sort((a, b) => {
                                        if (b && a) {
                                            return new Date(b.start_date_submission).getTime() - new Date(a.start_date_submission).getTime();
                                        }
                                        return 0;
                                    })
                                    .map((asgn) => (
                                        asgn && (
                                            <tr key={asgn.asgn_id} className="hover:bg-gray-100">
                                                <td>
                                                    <button
                                                        className="px-6 py-4 whitespace-nowrap text-sm font-medium write-grey underline hover:text-blue-500 hover:no-underline"
                                                        onClick={() => router.push(`/courses/${course_id}/${asgn.asgn_id}`)}
                                                    >
                                                        {`${asgn.name}`}
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm write-grey">{asgn.max_score}</td>
                                                <td className="w-full">
                                                    <ListPhaseProgressBar
                                                        asgn_id={asgn.asgn_id}
                                                        submissionProgress={progressData[asgn.asgn_id]?.submissionProgress || 0}
                                                        gradingProgress={progressData[asgn.asgn_id]?.gradingProgress || 0}
                                                    />
                                                </td>
                                            </tr>
                                        )
                                    ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="flex flex-row justify-center items-center">
                            <div className="px-6 py-4 whitespace-nowrap text-m font-medium write-grey">
                                No assignments yet
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

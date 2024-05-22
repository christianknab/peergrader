"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

type AsgnData = {
    asgn_id: string;
    name: string;
    phase: string;
    start_date_submission: Date;
    end_date_submission: Date;
    start_date_grading: Date;
    end_date_grading: Date;
} | null;


export default function TeacherListAsgn({ course_id }: { course_id: string }) {
    const supabase = createClient();
    const [asgns, setAsgns] = useState<AsgnData[]>([]); 1

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


    return (
        <div className="flex flex-col w-full gap-6 h-full">
            <div className="flex flex-col rounded-lg overflow-hidden flex-grow">
                <div className="light-blue p-5">
                    <p className="text-xl text-left font-semibold">Assignments</p>
                </div>
                <div className="light-grey flex-grow p-6">
                    {asgns && asgns.length > 0 ? (
                        <div className="grid grid-cols-1 gap-4">
                            {asgns.map((assignment) => (
                                assignment && (<Link
                                    key={assignment.asgn_id}
                                    href={`/courses/${course_id}/${assignment.asgn_id}`}
                                    className="block"
                                >
                                    <div className="rounded-lg border p-4 bg-white shadow hover:shadow-lg transition-shadow">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold">{assignment.name}</h3>
                                            {'Phase: ' + assignment.phase}
                                        </div>
                                    </div>
                                </Link>)
                            ))}
                        </div>
                    ) : (
                        <p>No assignments to display.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

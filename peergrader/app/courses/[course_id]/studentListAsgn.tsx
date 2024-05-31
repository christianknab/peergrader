"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

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


export default function StudentListAsgn({ course_id }: { course_id: string }) {
    const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
    const supabase = createClient();
    const [asgns, setAsgns] = useState<AsgnData[]>([]);

    useEffect(() => {
        fetchAsgns(course_id).then(setAsgns);
    }, [course_id]);

    async function fetchAsgns(course_id: string) {
        const { data, error } = await supabase.rpc('get_asgns_for_course_student', { course_id_param: course_id, user_id_param: currentUser?.uid });
        if (error) {
            console.error('Error fetching assignments:', error);
            return;
        }
        return data;
    }


    return (
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
                                    {assignment.phase == 'Closed' ? (assignment.final_score ? 'Final grade: ' + assignment.final_score : 'Grade unavailable') : 'Phase: ' + assignment.phase}
                                </div>
                            </div>
                        </Link>)
                    ))}
                </div>
            ) : (
                <p>No assignments to display.</p>
            )}
        </div>
    );
}

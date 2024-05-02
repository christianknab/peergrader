"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

interface AsgnData {
    asgn_id: string;
    name: string;
    final_grade: number | null;
}


export default function ListAsgn({ course_id }: { course_id: string }) {
    const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
    const supabase = createClient();
    const [asgns, setAsgns] = useState<AsgnData[]>([]);

    useEffect(() => {
        fetchAsgns(course_id).then(setAsgns);
    }, [course_id]);

    async function fetchAsgns(course_id: string) {
        const { data: assignments, error: assignmentsError } = await supabase
            .from('assignments')
            .select('asgn_id, name')
            .eq('course_id', course_id);

        if (assignmentsError) {
            console.error('Error fetching assignments:', assignmentsError);
            return [];
        }

        const asgnDataWithGrades: AsgnData[] = await Promise.all(
            assignments.map(async (assignment) => {
                const { data: submissions, error: submissionsError } = await supabase
                    .from('submissions')
                    .select('final_grade')
                    .eq('owner', currentUser?.uid)
                    .eq('asgn_id', assignment.asgn_id)
                    .order('created_at', { ascending: false })
                    .limit(1);

                if (submissionsError) {
                    console.error('Error fetching submissions:', submissionsError);
                    return {
                        asgn_id: assignment.asgn_id,
                        name: assignment.name,
                        final_grade: null,
                    };
                }

                const finalGrade = submissions.length > 0 ? submissions[0].final_grade : null;

                return {
                    asgn_id: assignment.asgn_id,
                    name: assignment.name,
                    final_grade: finalGrade,
                };
            })
        );

        return asgnDataWithGrades;

    }


    return (
        <div className="light-grey flex-grow p-6">
            {asgns && asgns.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                    {asgns.map((assignment) => (
                        <Link
                            key={assignment.asgn_id}
                            href={`/courses/${course_id}/${assignment.asgn_id}`}
                            className="block"
                        >
                            <div className="rounded-lg border p-4 bg-white shadow hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">{assignment.name}</h3>
                                    {assignment.final_grade ? 'Grade: ' + assignment.final_grade : 'Not graded yet'}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <p>No assignments to display.</p>
            )}
        </div>
    );
}

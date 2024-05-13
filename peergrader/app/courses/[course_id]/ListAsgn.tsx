"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

type AsgnData = {
    asgn_id: string;
    name: string;
    average_grade: number;
    phase: string;
    start_date_submission: Date;
    end_date_submission: Date;
    start_date_grading: Date;
    end_date_grading: Date;
} | null;


export default function ListAsgn({ course_id }: { course_id: string }) {
    const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
    const supabase = createClient();
    const [asgns, setAsgns] = useState<AsgnData[]>([]);

    useEffect(() => {
        fetchAsgns(course_id).then(setAsgns);
    }, [course_id]);

    async function fetchAsgns(course_id: string) {
        // get asgns for the course
        const { data: assignments, error: assignmentsError } = await supabase
            .from('assignments')
            .select('asgn_id, name, start_date_submission, end_date_submission, start_date_grading, end_date_grading')
            .eq('course_id', course_id);

        if (assignmentsError) {
            console.error('Error fetching assignments:', assignmentsError);
            return [];
        }

        const asgnDataWithGrades: AsgnData[] = await Promise.all(
            assignments.map(async (assignment) => {
                // get phase for each asgn
                const { data: phase, error: phaseError } = await supabase.rpc('get_assignment_phase', {
                    start_date_submission: assignment.start_date_submission,
                    end_date_submission: assignment.end_date_submission,
                    start_date_grading: assignment.start_date_grading,
                    end_date_grading: assignment.end_date_grading
                });

                // get file id for each asgn
                const { data: submissionData, error: submissionsError } = await supabase
                    .from('submissions')
                    .select('file_id')
                    .eq('owner', currentUser?.uid)
                    .eq('asgn_id', assignment.asgn_id)
                    .order('created_at', { ascending: false })
                    .limit(1)

                // if there is a submission get the grade if the phase is closed
                if (submissionData && submissionData.length > 0 && phase == 'Closed') {
                    const { data: average_grade, error: averageGradeError } = await supabase.rpc('calculate_average_grade', { file_id_param: submissionData[0].file_id });

                    if (averageGradeError) {
                        return {
                            asgn_id: assignment.asgn_id,
                            name: assignment.name,
                            average_grade: null,
                            phase: phase,
                            start_date_submission: assignment.start_date_submission,
                            end_date_submission: assignment.end_date_submission,
                            start_date_grading: assignment.start_date_grading,
                            end_date_grading: assignment.end_date_grading,
                        };
                    }
                    // if no errors
                    return {
                        asgn_id: assignment.asgn_id,
                        name: assignment.name,
                        average_grade: average_grade,
                        phase: phase,
                        start_date_submission: assignment.start_date_submission,
                        end_date_submission: assignment.end_date_submission,
                        start_date_grading: assignment.start_date_grading,
                        end_date_grading: assignment.end_date_grading,
                    };
                }
                return {
                    asgn_id: assignment.asgn_id,
                    name: assignment.name,
                    average_grade: null,
                    phase: phase,
                    start_date_submission: assignment.start_date_submission,
                    end_date_submission: assignment.end_date_submission,
                    start_date_grading: assignment.start_date_grading,
                    end_date_grading: assignment.end_date_grading,
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
                        assignment && (<Link
                            key={assignment.asgn_id}
                            href={`/courses/${course_id}/${assignment.asgn_id}`}
                            className="block"
                        >
                            <div className="rounded-lg border p-4 bg-white shadow hover:shadow-lg transition-shadow">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">{assignment.name}</h3>
                                    {assignment.phase == 'Closed' ? 'Grade: ' + assignment.average_grade : 'Phase: ' + assignment.phase}
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

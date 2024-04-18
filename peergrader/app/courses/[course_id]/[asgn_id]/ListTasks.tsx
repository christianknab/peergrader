"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/CurrentUser';

interface SubmissionData {
    filename: string;
    file_id: string | null;
    owner: string;
    grade: string | null;
}

interface ListTasks {
    course_id: string;
    asgn_id: string;
}

export default function ListTasks({ course_id, asgn_id }: ListTasks) {
    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError
    } = useCurrentUserQuery();
    if (isUserLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !currentUser) {
        return <div>Error</div>;
    }

    const supabase = createClient();
    const [submissions, setSubmissions] = useState<SubmissionData[]>([]);

    useEffect(() => {
        fetchSubmissions(course_id, asgn_id).then(setSubmissions);
    }, [course_id, asgn_id]);

    async function fetchSubmissions(course_id: string, asgn_id: string) {
        const { data: accountCourses, error: accountCoursesError } = await supabase
            .from('account_courses')
            .select('uid')
            .eq('course_id', course_id)
            // .not('uid', 'eq', currentUser?.uid);

        if (accountCoursesError) {
            console.error('Error fetching accounts:', accountCoursesError);
            return [];
        }

        const uids = accountCourses?.map((ac) => ac.uid) || [];

        const submissions: (SubmissionData | null)[] = await Promise.all(
            uids.map(async (owner) => {
                const { data: latestSubmission, error: latestSubmissionError } = await supabase
                    .from('submissions')
                    .select('filename, file_id')
                    .eq('asgn_id', asgn_id)
                    .eq('owner', owner)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (latestSubmissionError || !latestSubmission || !latestSubmission.file_id) {
                    return null;
                }

                const { data: gradeData, error: gradeError } = await supabase
                    .from('grades')
                    .select('grade')
                    .eq('file_id', latestSubmission.file_id)
                    .eq('graded_by', currentUser?.uid)
                    .single();

                if (gradeError) {
                    console.error('Error fetching grade:', gradeError);
                    return {
                        filename: latestSubmission.filename,
                        file_id: latestSubmission.file_id,
                        owner,
                        grade: null,
                    };
                }

                return {
                    filename: latestSubmission.filename,
                    file_id: latestSubmission.file_id,
                    owner,
                    grade: gradeData?.grade,
                };
            })
        );

        return submissions.filter(Boolean) as SubmissionData[];
    }

    return (
        <div>
            <h3>Tasks:</h3>
            <ul>
                {submissions.map((submission, index) => (
                    <li key={index}>
                        {index + 1}: {submission.filename}{' '}
                        {submission.file_id && (
                            <>
                                <Link
                                    href={{
                                        pathname: `/courses/${course_id}/${asgn_id}/grade`,
                                        query: {
                                            owner: submission.owner,
                                            file_id: submission.file_id,
                                            filename: submission.filename,
                                        },
                                    }}
                                >
                                    <button>
                                        {submission.grade !== null ? `-- Current Grade: ${submission.grade}` : ''}
                                        {submission.grade !== null ? ' -- Regrade' : 'Grade'}{' '}
                                    </button>
                                </Link>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
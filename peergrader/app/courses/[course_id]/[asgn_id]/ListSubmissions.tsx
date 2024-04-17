"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface SubmissionData {
    filename: string;
    file_id: string;
    ownerEmail: string;
    owner: string;
}

interface ListSubmissionsProps {
    course_id: string;
    asgn_id: string;
}

export default function ListSubmissions({ course_id, asgn_id }: ListSubmissionsProps) {
    const supabase = createClient();
    const [submissions, setSubmissions] = useState<SubmissionData[]>([]);

    useEffect(() => {
        fetchSubmissions(course_id, asgn_id).then(setSubmissions);
    }, [course_id, asgn_id]);


    async function fetchSubmissions(course_id: string, asgn_id: string) {
        const { data: accountCourses, error: accountCoursesError } = await supabase
            .from('account_courses')
            .select('uid')
            .eq('course_id', course_id);

        if (accountCoursesError) {
            console.error('Error fetching accounts:', accountCoursesError);
            return [];
        }

        const uids = accountCourses?.map((ac) => ac.uid) || [];

        const { data: accounts, error: accountsError } = await supabase
            .from('accounts')
            .select('email, uid')
            .in('uid', uids);

        if (accountsError) {
            console.error('Error fetching accounts:', accountsError);
            return [];
        }

        const submissions: SubmissionData[] = await Promise.all(
            accounts.map(async (account) => {
                const { data: latestSubmission, error: latestSubmissionError } = await supabase
                    .from('submissions')
                    .select('filename, file_id')
                    .eq('asgn_id', asgn_id)
                    .eq('owner', account.uid)
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .single();

                if (latestSubmissionError) {
                    console.error('Error fetching latest submission:', latestSubmissionError);
                    return { filename: 'No submission', file_id: null, ownerEmail: account.email, owner: account.uid };
                }

                return {
                    filename: latestSubmission?.filename,
                    file_id: latestSubmission?.file_id,
                    ownerEmail: account.email,
                    owner: account.uid,
                };
            })
        );

        return submissions;
    }

    return (
        <div>
            <h3>Submissions:</h3>
            <ul>
                {submissions.map((submission, index) => (
                    <li key={index}>
                        {submission.ownerEmail}: {submission.filename}
                        {submission.file_id && (
                            <>
                                {' -- '}<Link
                                    href={{
                                        pathname: `/courses/${course_id}/${asgn_id}/grade`,
                                        query: {
                                            owner: submission.owner,
                                            file_id: submission.file_id,
                                            filename: submission.filename,
                                        },
                                    }}
                                >
                                    <button>Grade</button>
                                </Link>{' -- '}
                                <Link
                                    href={{
                                        pathname: `/courses/${course_id}/${asgn_id}/view`,
                                        query: {
                                            owner: submission.owner,
                                            file_id: submission.file_id,
                                            filename: submission.filename,
                                        },
                                    }}
                                >
                                    <button>View</button>
                                </Link>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
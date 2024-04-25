"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

interface SubmissionData {
    filename: string;
    file_id: string | null;
    owner: string;
    grade: string | null;
}

interface ListGradedProps {
    course_id: string;
    asgn_id: string;
}

export default function ListGraded({ course_id, asgn_id }: ListGradedProps) {
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
    const [graded, setGraded] = useState<SubmissionData[]>([]);

    useEffect(() => {
        fetchGraded(asgn_id).then(setGraded);
    }, [asgn_id]);

    async function fetchGraded(asgn_id: string) {
        const { data: gradedFileIds, error: gradedFileIdsError } = await supabase
            .from('grades')
            .select('file_id, grade')
            .eq('graded_by', currentUser?.uid);

        if (gradedFileIdsError) {
            console.error('Error fetching graded file IDs:', gradedFileIdsError);
            return [];
        }

        const fileIds = gradedFileIds.map(({ file_id }) => file_id);

        const { data: submissions, error: submissionsError } = await supabase
            .from('submissions')
            .select('filename, file_id, owner')
            .in('file_id', fileIds)
            .eq('asgn_id', asgn_id);

        if (submissionsError) {
            console.error('Error fetching submissions:', submissionsError);
            return [];
        }

        const gradedSubmissionData = submissions.map((submission) => {
            const { file_id, filename, owner } = submission;
            const gradeData = gradedFileIds.find((gradeFileId) => gradeFileId.file_id === file_id);
            return {
                filename,
                file_id,
                owner,
                grade: gradeData?.grade,
            };
        });

        return gradedSubmissionData;
    }

    return (
        <div>
            <h3>People i have graded</h3>
            <ul>
                {graded.map((submission, index) => (
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
                                        {`-- Current Grade: ${submission.grade} -- Regrade`}
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
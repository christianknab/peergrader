"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import useSubmissionsGradedByUserQuery from '@/utils/hooks/QuerySubmissionsGradedByUser';

interface ListGradedProps {
    course_id: string;
    asgn_id: string;
}

export default function ListGraded({ course_id, asgn_id }: ListGradedProps) {
    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError: isUserError
    } = useCurrentUserQuery();
    const {
        data: gradedSubmissions,
        isLoading: isGradedSubmissionsLoading,
        isError: isGradedSubmissionsError
    } = useSubmissionsGradedByUserQuery("a8bf851b-2af7-4f28-97af-0fbf512fd164", asgn_id, !!currentUser);

    if (isUserLoading || isGradedSubmissionsLoading) {
        return <div>Loading...</div>;
    }

    if (isUserError || !currentUser || isGradedSubmissionsError || !gradedSubmissions) {
        return <div>Error</div>;
    }

    // const supabase = createClient();


    // useEffect(() => {
    //     fetchGraded(asgn_id).then(setGraded);
    // }, [asgn_id]);

    // async function fetchGraded(asgn_id: string) {
    //     const { data: gradedFileIds, error: gradedFileIdsError } = await supabase
    //         .from('grades')
    //         .select('file_id, grade')
    //         .eq('graded_by', currentUser?.uid);

    //     if (gradedFileIdsError) {
    //         console.error('Error fetching graded file IDs:', gradedFileIdsError);
    //         return [];
    //     }

    //     const fileIds = gradedFileIds.map(({ file_id }) => file_id);

    //     const { data: submissions, error: submissionsError } = await supabase
    //         .from('submissions')
    //         .select('filename, file_id, owner')
    //         .in('file_id', fileIds)
    //         .eq('asgn_id', asgn_id);

    //     if (submissionsError) {
    //         console.error('Error fetching submissions:', submissionsError);
    //         return [];
    //     }

    //     const gradedSubmissionData = submissions.map((submission) => {
    //         const { file_id, filename, owner } = submission;
    //         const gradeData = gradedFileIds.find((gradeFileId) => gradeFileId.file_id === file_id);
    //         return {
    //             filename,
    //             file_id,
    //             owner,
    //             grade: gradeData?.grade,
    //         };
    //     });

    //     return gradedSubmissionData;
    // }

    return (
        <div>
            <h3>Peer Grades: {gradedSubmissions.length}\5</h3>
            <ul>
                {gradedSubmissions.map((submission, index) => (
                    <li key={index}>

                        <Link href={{
                            pathname: `/courses/${course_id}/${asgn_id}/grade`,
                            query: {
                                file_id: submission.file_id,
                            },
                        }}><div className='w-full h-10 pl-3 bg-btn-background hover:bg-btn-background-hover rounded-lg flex items-center'>
                                <span className='text-lg'>
                                    {`Submission ${index + 1} - ${submission.has_annotation ?'Edit Grade':'Finish Grading'}`}
                                </span>
                            </div>
                        </Link>

                    </li>
                ))}
            </ul>
        </div>
    );
}
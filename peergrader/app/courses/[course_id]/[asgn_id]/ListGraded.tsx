"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import useSubmissionsGradedByUserQuery from '@/utils/hooks/QuerySubmissionsGradedByUser';
import { Phase } from '@/utils/types/phaseEnum';
import { LoadingSpinner } from '@/components/loadingSpinner';
import useAsgnDataQuery from '@/utils/hooks/QueryAsgnData';

interface ListGradedProps {
    course_id: string;
    asgn_id: string;
    phase: string;
}

export default function ListGraded({ course_id, asgn_id, phase }: ListGradedProps) {
    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError: isUserError
    } = useCurrentUserQuery();
    const {
        data: asgnData,
        isLoading: isAsgnDataLoading,
        isError: isAsgnDataError
      } = useAsgnDataQuery(asgn_id);
    const {
        data: gradedSubmissions,
        isLoading: isGradedSubmissionsLoading,
        isError: isGradedSubmissionsError
    } = useSubmissionsGradedByUserQuery(currentUser?.uid, asgn_id, !!currentUser);

    if (isUserLoading || isGradedSubmissionsLoading || isAsgnDataLoading) {
        return <LoadingSpinner/>;
    }

    if (isUserError || !currentUser || isGradedSubmissionsError || !gradedSubmissions || isAsgnDataError || !asgnData) {
        return <div>Error</div>;
    }

    return (
        <div>
            <h3>Peer Grades: {gradedSubmissions.length}\{asgnData.num_peergrades}</h3>
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
                                    {`Submission ${index + 1} - ${phase == Phase.grading ?
                                        submission.has_annotation ?
                                            'Edit Grade' :
                                            'Finish Grading' :
                                        submission.has_annotation ?
                                            'Review Grade' :
                                            'Grade Incomplete'}`}
                                </span>
                            </div>
                        </Link>

                    </li>
                ))}
            </ul>
        </div>
    );
}
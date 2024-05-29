"use client";
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingSpinner } from '@/components/loadingSpinner';
import { Dispatch, SetStateAction } from 'react';
import useSubmissionsGradedByUserQuery from '@/utils/hooks/QuerySubmissionsGradedByUser';

interface GetNextToGradeProps {
    course_id: string;
    asgn_id: string;
    setIsNoSubmissionsToGrade: Dispatch<SetStateAction<boolean>>;
    setIsIncompleteGrade: Dispatch<SetStateAction<boolean>>;
}

export default function GetNextToGrade({ course_id, asgn_id, setIsIncompleteGrade, setIsNoSubmissionsToGrade}: GetNextToGradeProps) {
    const router = useRouter();
    const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
    const supabase = createClient();
    const queryClient = useQueryClient();

    const {
        data: gradedSubmissions,
        isLoading: isGradedSubmissionsLoading,
        isError: isGradedSubmissionsError
    } = useSubmissionsGradedByUserQuery(currentUser?.uid, asgn_id, !!currentUser);

    if (isUserLoading || isGradedSubmissionsLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !currentUser || isGradedSubmissionsError) {
        return <div>Error</div>;
    }

    const handleGetNextToGrade = async () => {
        if(gradedSubmissions?.some((item)=>!item.has_annotation)){
            setIsIncompleteGrade(true);
            return;
        }

        const { data, error } = await supabase.rpc('get_next_asgn_grade', { p_asgn_id: asgn_id, p_grader: currentUser.uid });
        if (error) {
            console.error('Error fetching submission:', error);
            return;
        }
        if (data == null){
            setIsNoSubmissionsToGrade(true);
            return;
        }
        queryClient.invalidateQueries({ queryKey: ['gradedSubs'] });
        const queryString = `?file_id=${data}`;
        router.push(`/courses/${course_id}/${asgn_id}/grade${queryString}`);
    };

    return (
        <div>
            
            <button onClick={handleGetNextToGrade}
                className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
                Get Next Submission to Grade
            </button></div>
    );
}
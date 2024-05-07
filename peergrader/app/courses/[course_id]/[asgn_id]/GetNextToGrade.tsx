"use client";
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { useQueryClient } from '@tanstack/react-query';

interface GetNextToGradeProps {
    course_id: string;
    asgn_id: string;
}

export default function GetNextToGrade({ course_id, asgn_id }: GetNextToGradeProps) {
    const router = useRouter();
    const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
    const supabase = createClient();
    const queryClient = useQueryClient();

    if (isUserLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !currentUser) {
        return <div>Error</div>;
    }

    const handleGetNextToGrade = async () => {
        
        const {data, error} = await supabase.rpc('get_next_asgn_grade', {p_asgn_id: asgn_id, p_grader: currentUser.uid});
        if (error || data == null) {
            console.error('Error fetching submission:', error);
            return;
        }
        queryClient.invalidateQueries({queryKey: ['gradedSubs']})
        const queryString = `?file_id=${data}`;
        router.push(`/courses/${course_id}/${asgn_id}/grade${queryString}`);
    };

    return (
        <button onClick={handleGetNextToGrade}
        className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
            Get Next Submission to Grade
        </button>
    );
}
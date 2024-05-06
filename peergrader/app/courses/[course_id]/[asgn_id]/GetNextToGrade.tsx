"use client";
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

interface GetNextToGradeProps {
    course_id: string;
    asgn_id: string;
}

export default function GetNextToGrade({ course_id, asgn_id }: GetNextToGradeProps) {
    const router = useRouter();
    const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
    const supabase = createClient();

    if (isUserLoading) {
        return <div>Loading...</div>;
    }

    if (isError || !currentUser) {
        return <div>Error</div>;
    }

    const handleGetNextToGrade = async () => {
        const { data: submissionGradeCounts, error: submissionGradeCountsError } = await supabase
            .from('submissions')
            .select('file_id, num_grades')
            .eq('asgn_id', asgn_id)
            .neq('owner', currentUser.uid)

        if (submissionGradeCountsError) {
            console.error('Error fetching submission grade counts:', submissionGradeCountsError);
            return;
        }

        const sortedSubmissionGradeCounts = submissionGradeCounts.sort((a, b) => a.num_grades - b.num_grades);
        const leastGradeCount = sortedSubmissionGradeCounts[0]?.num_grades;

        const leastGradedSubmissions = sortedSubmissionGradeCounts.filter(
            (submission) => submission.num_grades === leastGradeCount
        );

        if (leastGradedSubmissions.length === 0) {
            console.error('No submissions found for grading');
            return;
        }

        const randomIndex = Math.floor(Math.random() * leastGradedSubmissions.length);
        const leastGradedFileId = leastGradedSubmissions[randomIndex].file_id;

        // const { data: submission, error: submissionError } = await supabase
        //     .from('submissions')
        //     .select('filename, owner')
        //     .eq('file_id', leastGradedFileId)
        //     .eq('asgn_id', asgn_id)
        //     .single();

        // if (submissionError) {
        //     console.error('Error fetching submission:', submissionError);
        //     return;
        // }
        const queryString = `?file_id=${leastGradedFileId}`;
        router.push(`/courses/${course_id}/${asgn_id}/grade${queryString}`);
    };

    return (
        <button onClick={handleGetNextToGrade}
        className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover">
            Get Next Submission to Grade
        </button>
    );
}
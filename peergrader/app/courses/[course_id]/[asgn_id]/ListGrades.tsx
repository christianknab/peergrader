import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";
import useSubmissionGradeForUserQuery from "@/utils/hooks/QuerySubmissionGradeForUser";
import Link from "next/link";


interface ListGradesProps {
    course_id: string;
    asgn_id: string;
    file_id: string | undefined;
    max_score: number;
}

export default function ListGrades({ course_id, asgn_id, file_id, max_score }: ListGradesProps) {
    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError: isUserError
    } = useCurrentUserQuery();
    const {
        data: grades,
        isLoading: isGradesLoading,
        isError: isGradesError
    } = useSubmissionGradeForUserQuery(currentUser?.uid, asgn_id, !!currentUser);
    if (isUserLoading || isGradesLoading) {
        return <div>Loading...</div>;
    }

    if (isUserError || !currentUser || isGradesError || !grades) {
        return <div>Error</div>;
    }
    return (
        <div>
            {grades.length != 0 && (<h3>My Feedback:</h3>)}
            <ul>
                {grades.map((item, index) => (
                    <li key={index}>

                        <Link href={{
                            pathname: `/courses/${course_id}/${asgn_id}/grade`,
                            query: {
                                grader: item.graded_by,
                                file_id: file_id,
                            },
                        }}><div className='w-full h-10 pl-3 bg-btn-background hover:bg-btn-background-hover rounded-lg flex items-center'>
                                <span className='text-lg'>
                                    {`Grader ${index + 1} score:${item.total}/${max_score}`}
                                </span>
                            </div>
                        </Link>

                    </li>
                ))}
            </ul>
        </div>
    );
}
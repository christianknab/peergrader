import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";
import useSubmissionGradeForUserQuery from "@/utils/hooks/QuerySubmissionGradeForUser";
import Link from "next/link";


interface ListGradesProps {
    course_id: string;
    asgn_id: string;
}

export default function ListGrades({ course_id, asgn_id }: ListGradesProps){
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
            <ul>
                {grades.map((item, index) => (
                    <li key={index}>

                        <Link href={{
                            pathname: `/courses/${course_id}/${asgn_id}/grade`,
                            query: {
                                file_id: item,
                            },
                        }}><div className='w-full h-10 pl-3 bg-btn-background hover:bg-btn-background-hover rounded-lg flex items-center'>
                                <span className='text-lg'>
                                    {`Grade ${index + 1}`}
                                </span>
                            </div>
                        </Link>

                    </li>
                ))}
            </ul>
        </div>
    );
}
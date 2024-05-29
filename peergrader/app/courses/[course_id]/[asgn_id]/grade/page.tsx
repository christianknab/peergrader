"use client";

import useCurrentUserQuery from "@/utils/hooks/QueryCurrentUser";
import StudentGradePage from "./studentGradePage";
import TeacherGradePage from "./teacherGradePage";
import { LoadingSpinner } from "@/components/loadingSpinner";
import NavBar from "@/components/NavBar";
import { useParams } from "next/navigation";
import useCourseDataQuery from "@/utils/hooks/QueryCourseData";
import useAsgnDataQuery from "@/utils/hooks/QueryAsgnData";

export default function CoursePage() {
    const {
        data: currentUser,
        isLoading: isUserLoading,
        isError
    } = useCurrentUserQuery();

    const params = useParams();
    const course_id = params.course_id as string;
    const asgn_id = params.asgn_id as string;

    const {
        data: courseData,
        isLoading: courseDataLoading,
        isError: courseDataError
    } = useCourseDataQuery(course_id);

    const {
        data: asgnData,
        isLoading: asgnDataLoading,
        isError: asgnDataError
    } = useAsgnDataQuery(asgn_id);

    if (courseDataLoading || asgnDataLoading) { return (<LoadingSpinner />); }
    if (courseDataError || asgnDataError) { return <div>Error</div>; }

    if (isUserLoading) {
        return <LoadingSpinner />;
    }

    if (isError || !currentUser) {
        return <div>Error</div>;
    }

    if (currentUser.is_teacher) {
        return (<div><NavBar courseName={courseData?.name} courseId={course_id} assignmentName={asgnData?.name} assignmentId={asgn_id} />
            <TeacherGradePage /></div>);
    } else {
        return (
            <StudentGradePage />);
    }
}
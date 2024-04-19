"use client";

import useCurrentUserQuery from "@/utils/hooks/CurrentUser";
import StudentGradePage from "./studentGradePage";
import TeacherGradePage from "./teacherGradePage";

export default function CoursePage() {
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

    if (currentUser.is_teacher) { return (<TeacherGradePage />); } else { return (<StudentGradePage />); }
}
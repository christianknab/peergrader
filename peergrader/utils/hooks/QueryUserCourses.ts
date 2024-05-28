"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";


interface Course {
    course_id: string;
    name: string;
    number: string;
}

interface CoursesData {
    course: Course[];
}

function useUserCoursesQuery( userId: string, isTeacher: boolean, enabled: boolean = true) {

    const supabase = createClient();
    const queryKey = [userId, isTeacher, "getCourses"];

    const queryFn = async (): Promise<CoursesData> => {
        if (isTeacher) {
            const { data } = await supabase.rpc('get_teacher_courses', { user_id_param: userId });
            return { course: data ?? [] }; // Return empty array if data is null or undefined
        } else {
            const { data } = await supabase.rpc('get_courses_student', { user_id_param: userId });
            return { course: data ?? [] }; // Return empty array if data is null or undefined
        }
    };
    return useQuery<CoursesData>({ queryKey: queryKey, queryFn, staleTime: 3 * 60 * 1000, enabled });
}

export default useUserCoursesQuery;



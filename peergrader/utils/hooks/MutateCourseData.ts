"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import SetCourse from "../queries/SetCourse";

function useCourseMutation() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (courseData: {
            courseId: string;
            name: any;
            number: any;
            start_date: any;
            end_date: any;
        }) => {
            try {
                const { data } = await SetCourse(supabase, courseData);
                return data;
            } catch (error) { throw error; }
        },
        onSuccess: (data, variables) => {
            // Use the specific course ID to update the cache
            queryClient.setQueryData([variables.courseId, "CourseData"], data);
        },
        onSettled: (data, error, variables) => {
            // Invalidate queries related to the specific course ID
            queryClient.invalidateQueries({ queryKey: [variables.courseId, "CourseData"] });
        },

    });

    return mutation;
}
export default useCourseMutation;
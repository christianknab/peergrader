"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import SetSubmissionGrade from "../queries/SetSubmissionGrade";

function useSubmissionGradeMutation() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (annotationData: { userId: string, fileId: string, data: JSON }) => {
            try {
                const { data } = await SetSubmissionGrade(supabase, annotationData);
                return data;
            } catch (error) { throw error; }
        },
        onSettled: () => { queryClient.invalidateQueries({queryKey: ['gradeAnnotations']}) },

    });

    return mutation;
}
export default useSubmissionGradeMutation;
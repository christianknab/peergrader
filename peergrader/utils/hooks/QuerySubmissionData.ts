"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";

function useSubmissionDataQuery(user_id: string, asgn_id: string, enabled: boolean) {

    const supabase = createClient();
    const queryKey = [user_id, asgn_id, "SubmissionData"];

    const queryFn = async () => {

        const { data } = await supabase
            .from('submissions')
            .select('file_id, filename, created_at')
            .eq('owner', user_id)
            .eq('asgn_id', asgn_id)
            .order('created_at', { ascending: false })
            .limit(1);

        return data;
    };
    return useQuery({ queryKey: queryKey, queryFn, enabled, staleTime: 0 });
}

export default useSubmissionDataQuery;
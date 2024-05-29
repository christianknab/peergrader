"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";

function useAsgnDataQuery(asgn_id: string) {

    const supabase = createClient();
    const queryKey = [asgn_id, "AsgnData"];

    const queryFn = async () => {

        const { data } = await supabase
            .from('assignments')
            .select('name, start_date_submission, end_date_submission, start_date_grading, end_date_grading, max_score, num_peergrades')
            .eq('asgn_id', asgn_id)
            .single();

        return data
    };

    return useQuery({ queryKey: queryKey, queryFn, staleTime: 5 * 60 * 1000 });
}

export default useAsgnDataQuery;
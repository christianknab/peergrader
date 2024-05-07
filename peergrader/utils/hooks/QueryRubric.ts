"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";

function useRubricFromAsgnQuery( asgnId: string) {

    const supabase = createClient();
    const queryKey = [asgnId, "asgnId"];

    const queryFn = async () => {
        try {
            const { data, error, status } = await supabase.rpc('get_rubric', { asgn_id_param: asgnId });
            console.log('caching')
            if (error) {
                console.error("RPC Error:", error.message);
                throw new Error(`Error fetching rubric: ${error.message}`);
            }
            return data;
        } catch (error) {
            console.error('Error in query function:', error);
            throw error;
        }
    };
    
    return useQuery({ queryKey: queryKey, queryFn, staleTime: 3 * 60 * 1000 });

}

export default useRubricFromAsgnQuery;
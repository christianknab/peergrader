"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";

function useRubricFromAsgnQuery(asgnId: string) {
  const supabase = createClient();

  const queryKey = [asgnId, "asgnId"];

  const queryFn = async () => {
    try {
      const { data: rubricData, error: rubricError, status: rubricStatus } =
        await supabase.rpc('get_rubric', { asgn_id_param: asgnId });

      if (rubricError) {
        console.error("RPC Error:", rubricError.message);
        throw new Error(`Error fetching rubric: ${rubricError.message}`);
      }

      const { data: assignmentData, error: maxScoreError, status: maxScoreStatus } =
        await supabase
          .from('assignments')
          .select('max_score, number_input')
          .eq('asgn_id', asgnId)
          .single();

      if (maxScoreError) {
        console.error("Error fetching max score:", maxScoreError.message);
        throw new Error(`Error fetching max score: ${maxScoreError.message}`);
      }

      return { rubric: rubricData, maxScore: assignmentData.max_score, numberInput: assignmentData.number_input };
    } catch (error) {
      console.error('Error in query function:', error);
      throw error;
    }
  };

  return useQuery({ queryKey: queryKey, queryFn, staleTime: 3_60_1000, meta:{}});
}

export default useRubricFromAsgnQuery;
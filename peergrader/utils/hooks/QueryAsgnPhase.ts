"use client";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import GetPhaseFromId from "../queries/GetPhaseFromId";


function usePhaseFromIdQuery(asgnId: string, enabled:boolean) {

    const supabase = createClient();
    const queryKey = [asgnId, "asgnPhase"];

    const queryFn = async () => {
        const { data } = await GetPhaseFromId(supabase, asgnId);
        return data;
    };
    return useQuery({ queryKey: queryKey, queryFn, enabled });
}

export default usePhaseFromIdQuery;
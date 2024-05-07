"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";

function useOwnerFromFileQuery( fileId: string) {

    const supabase = createClient();
    const queryKey = [fileId, "fileOwner"];

    const queryFn = async () => {
        const { data } = await supabase.from("submissions").select("owner").eq("file_id", fileId).limit(1);
        return data?.[0].owner;
    };
    return useQuery({ queryKey: queryKey, queryFn, staleTime: 3 * 60 * 1000 });
}

export default useOwnerFromFileQuery;
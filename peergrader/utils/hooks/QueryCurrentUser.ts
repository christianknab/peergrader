"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";
import GetUserById from "../queries/GetUser";
import { AppUser } from "../types/user";
import { useRouter } from "next/navigation";

function useCurrentUserQuery() {
    const router = useRouter();

    const client = createClient();
    const queryKey = ['currentUser'];

    const queryFn = async () => {
        const { data: { user } } = await client.auth.getUser();
        if (!user) throw "No User";
        const { data, error } = await GetUserById(client, user.id);
        if (error) {
            if (error.code == "PGRST116") {
                router.push('/dashboard/edit-account');
            }
            throw error;
        }
        return data

    };

    return useQuery({ queryKey, queryFn });
}

export default useCurrentUserQuery;
"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";
import GetUserById from "../queries/GetUser";
import { AppUser } from "../types/user";

function useCurrentUserQuery() {

    const client = createClient();
    const queryKey = ['currentUser'];

    const queryFn = async () => {
        console.log("readin");
        const { data: { user } } = await client.auth.getUser();
        if (!user) throw "No User";
        return GetUserById(client, user.id).then(
            (result) => (result.data as AppUser)
        );
    };

    return useQuery({ queryKey, queryFn });
}

export default useCurrentUserQuery;
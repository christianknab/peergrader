"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";
import GetUserById from "../queries/GetUser";




function useCurrentUserQuery() {

    const client = createClient();
    const queryKey = ['currentUser'];

    const queryFn = async () => {
        console.log("readin");
        const { data: { user } } = await client.auth.getUser();
        if (!user) throw "No User";
        return GetUserById(client, user.id).then(
            (result) => result.data
        );
    };

    return useQuery({ queryKey, queryFn });
}

export default useCurrentUserQuery;

export type AppUser = {
    uid: string;
    email: string;
    is_teacher: boolean;
};
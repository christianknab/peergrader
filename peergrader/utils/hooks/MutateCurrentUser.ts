"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import SetUser from "../queries/SetUser";
import { AppUser } from "../types/user";

function useCurrentUserMutation(onSettledCallback?: () => void) {
    const client = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation<AppUser, unknown, AppUser>({
        mutationFn: async (userData: AppUser) => {
            const {data, error} = await SetUser(client, userData);
            if (error) throw new Error(error.message);
            return data;
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["currentUser"], data as AppUser);
        },
        onError: (error) => {
            console.error("Error creating user:", error);
        },
        onSettled: onSettledCallback
    });

    return mutation;
}
export default useCurrentUserMutation;
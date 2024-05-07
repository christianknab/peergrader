"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "../supabase/client";
import SetUser from "../queries/SetUser";
import { AppUser } from "../types/user";

function useCurrentUserMutation() {
    const supabase = createClient();
    const queryClient = useQueryClient();

    const mutation = useMutation<AppUser, unknown, AppUser>({
        mutationFn: async (userData: AppUser) => {
            try {
                const { data } = await SetUser(supabase, userData);
                // if (error) throw error;
                return data;
            } catch (error) { throw error; }
        },
        onSuccess: (data) => {
            queryClient.setQueryData(["currentUser"], data as AppUser);
        },
        onError: (error) => {
            console.error("Error creating user:", error);
        },

    });

    return mutation;
}
export default useCurrentUserMutation;
"use client";
import { useQuery } from "@tanstack/react-query"
import { createClient } from "../supabase/client";
import GetUserById from "../queries/GetUser";
import { useRouter } from "next/navigation";

function useCurrentUserQuery(redirect: boolean = true) {
    const router = useRouter();

    const supabase = createClient();
    const queryKey = ['currentUser'];

    const queryFn = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw "No User";
        const { data, error } = await GetUserById(supabase, user.id);
        if (error) {
            if (redirect) {
                if (error.code == "PGRST116") {
                    router.push('/dashboard/edit-account');
                }
                throw error;
            }
            else {
                if (error.code == "PGRST116") {
                    throw new Error("redirectAccount");
                }
                else {
                    throw error;
                }
            }
        }
        return data

    };

    return useQuery({ queryKey, queryFn, staleTime: 3 * (60 * 1000), retry: (failureCount, error) => {
        if (error.message === "redirectAccount" && !redirect) {
          // redirect is false, don't retry
          return false;
        } else {
          //nuse the default retry behavior
          return failureCount < 3;
        }
      }
     }); //2 min
}

export default useCurrentUserQuery;
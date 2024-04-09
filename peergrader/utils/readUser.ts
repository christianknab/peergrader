
import { AppUser } from "@/providers/UserDataProvider";
import { createClient } from "./supabase/server";

export async function readUser(uid: string): Promise<AppUser> {

    const supabase = createClient();
    //FIXME maybe remove this. added to supress a warning.
    await supabase.auth.getUser();
    const { data, error } = await supabase
        .from('accounts')
        .select('uid, email, is_teacher').eq('uid', uid).single();
    if (error) throw error;
    return data;
};
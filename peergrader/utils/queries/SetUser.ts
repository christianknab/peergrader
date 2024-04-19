import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { AppUser } from "../types/user";


export default async function SetUser(client: SupabaseClient, user: AppUser) {
    const {data, error} = await client.from('accounts')
    .insert([
        {uid: user.uid, email: user.email, is_teacher: user.is_teacher},
      ]).select().single()
      return {data, error};
}
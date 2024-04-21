import { SupabaseClient } from "@supabase/supabase-js";

export default async function GetUserById(client: SupabaseClient, userId: string) {
    const data = await client.from('accounts')
        .select('uid, email, is_teacher').eq('uid', userId).single();
        return data;
}


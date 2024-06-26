import { SupabaseClient } from "@supabase/supabase-js";
import { AppUser } from "../types/user";

export default async function SetUser(client: SupabaseClient, user: AppUser) {
  const { data, error } = await client
    .from("accounts")
    .upsert([
      {
        uid: user.uid,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        is_teacher: user.is_teacher,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error upserting user:", error);
    throw error;
  }

  return { data };
}
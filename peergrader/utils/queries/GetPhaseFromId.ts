import { SupabaseClient } from "@supabase/supabase-js";

export default async function GetPhaseFromId(client: SupabaseClient, asgnId: string) {
    const { data, error} = await client.rpc('get_phase_from_id', {asgn_id_param: asgnId});
    return {data:data as string, error};
}
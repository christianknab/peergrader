import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function uploadFile(file: File) {

    // Call Storage API to upload file
    const { data, error } = await supabase.storage
        .from('files')
        .upload(file.name, file);

    // Handle error if upload failed
    if (error) {
        console.error('Error uploading file here:', error);
        return { success: false, error: error.message };
    }

    return { success: true};
}

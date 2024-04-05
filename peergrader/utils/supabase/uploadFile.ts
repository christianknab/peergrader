import { User, createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export async function uploadFile(file: File, user: User) {
    // TODO: change to add it to the correct folder
    
    const uniqueFileName = `${file.name}-${Date.now()}`;

    const { data, error } = await supabase.storage
        .from('files')
        .upload(uniqueFileName, file);

    if (error) {
        console.error('Error uploading file:', error);
        return { success: false, error: error.message };
    }

    // Write to the account_files table
    const { data: insertData, error: insertError } = await supabase
        .from('account_files')
        .insert([
            { file_path: data.path, uid: user.id },
        ]);

    if (insertError) {
        console.error("Error writing to account_files: ", insertError);
        return { success: false, error: insertError.message };
    }

    // Return the Key as the fileID
    return { success: true, fileID: data.path };
}

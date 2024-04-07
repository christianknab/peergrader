import { User} from '@supabase/supabase-js'
import { supabase } from './client';



export async function uploadFile(file: File, user: User) {
    const uniqueFileName = `${file.name}-${user.id}-${Date.now()}`;

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

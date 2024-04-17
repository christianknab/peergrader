import { supabase } from './supabase/client';


export async function uploadFile(file: File, uid: string, asgn_id?: string) {
    // store file with timestamp as name, in users folder
    const timestamp = Date.now();
    const file_path = `${uid}/${timestamp}`;

    const { data, error } = await supabase.storage
        .from('files')
        .upload(file_path, file);

    if (error) {
        console.error('Error uploading file:', error);
        return { success: false };
    }

    // Write to the submissions table
    const { data: tableData, error: tabletError } = await supabase
        .from('submissions')
        .insert([
            { file_id: timestamp, owner: uid, filename: file.name, asgn_id: asgn_id || null },
        ]);

    if (tabletError) {
        console.error("Error writing to files: ", tabletError);
        return { success: false };
    }

    return { success: true };
}


import { supabase } from './supabase/client';


export async function resubmitFile(file: File, uid: string, asgn_id: string) {
    // find any current submissions
    const { data: oldSubmissions, error: submissionData } = await supabase
        .from('submissions')
        .select('file_id')
        .eq('owner', uid)
        .eq('asgn_id', asgn_id);

    // delete the current files
    if (oldSubmissions && oldSubmissions.length > 0) {
        for (const submission of oldSubmissions) {
            const file_path = `${uid}/${submission.file_id}`;
            console.log(file_path);
            const { data: removeData, error } = await supabase.storage.from('files').remove([file_path]);
            console.log(removeData);
            if (error) {
                console.error('Error deleting old file:', error);
            }
        }
        // delete from submissions
        const { error: deleteError } = await supabase
            .from('submissions')
            .delete()
            .eq('owner', uid)
            .eq('asgn_id', asgn_id);

        if (deleteError) {
            console.error('Error deleting old submissions:', deleteError);
        }
    }

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


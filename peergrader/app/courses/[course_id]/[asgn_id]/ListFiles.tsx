"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useUser } from '@/utils/providers/UserDataProvider';

interface FileData {
    file_id: string;
    filename: string;
    owner: string;
}

interface ListFilesProps {
    course_id: string;
    asgn_id: string;
}

export default function ListFiles({ course_id, asgn_id }: ListFilesProps) {
    const supabase = createClient();
    const userContext = useUser();
    const [files, setFiles] = useState<FileData[]>([]);

    useEffect(() => {
        if (userContext?.currentUser) {
            fetchFiles(userContext?.currentUser.uid, asgn_id).then(setFiles);
        }
    }, [userContext?.currentUser]);


    async function fetchFiles(userId: string, asgn_id: string) {
        const { data, error } = await supabase
            .from('files')
            .select('file_id, owner, filename')
            .eq('owner', userId)
            .eq('asgn_id', asgn_id)

        if (error) {
            console.error('Error fetching user files:', error);
            return [];
        }

        return data;
    }


    return (
        <div>
            <h3>Your submission:</h3>
            <ul>
                {files.map((fileData) => (
                    <li key={fileData.filename}>
                        <Link
                            href={{
                                pathname: `/courses/${course_id}/${asgn_id}/grade`,
                                query: { owner: fileData.owner, file_id: fileData.file_id, filename: fileData.filename },
                            }}>
                            View File: {fileData.filename}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
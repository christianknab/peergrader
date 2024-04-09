"use client";

import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';


export default function UserFilesList({ user }: { user: User }) {
    const [userFiles, setUserFiles] = useState<string[]>([]);

    useEffect(() => {
        fetchUserFiles(user.id).then(setUserFiles);
    }, [user.id]);

    async function fetchUserFiles(userId: string) {
        const { data, error } = await supabase
            .from('account_files')
            .select('file_path')
            .eq('uid', userId);

        if (error) {
            console.error('Error fetching user files:', error);
            return [];
        }

        return data.map((row) => row.file_path);
    }


    return (
        <div>
            <h3>Your Files:</h3>
            <ul>
                {userFiles.map((filePath) => (
                    <li key={filePath}>
                        <Link
                            href={{
                                pathname: '/files',
                                query: { file: encodeURIComponent(filePath) },
                            }}>
                            View File: {filePath}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
"use client";

import { useEffect, useState } from 'react';
import { User, createClient } from '@supabase/supabase-js';
import Link from 'next/link';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
                                pathname: '/protected/files',
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
"use client";
import { useEffect, useState } from 'react';
import { User, createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

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

        // Get URLs for each file
        const urls = await Promise.all(
            data.map(async row => {
                const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(row.file_path);
                // const { data, error } = await supabase.storage.from('files').createSignedUrl(row.file_path, 60);

                if (error) {
                    console.error('Error getting file URL:', error);
                    return null;
                }
                return publicUrl;
            })
        );

        return urls.filter((url): url is string => url !== null);
    }

    return (
        <div>
            <h3>Your Files:</h3>
            <ul>
                {userFiles.map(url => (
                    <li key={url}>
                        <a href={url} target="_blank" rel="noopener noreferrer">
                            {url}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}

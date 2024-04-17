"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useUser } from '@/utils/providers/UserDataProvider';

interface FileData {
  file_id: string;
  filename: string;
  created_at: string; // Add the created_at field
}

interface ListFilesProps {
  course_id: string;
  asgn_id: string;
}

export default function ListMyFiles({ course_id, asgn_id }: ListFilesProps) {
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
      .from('submissions')
      .select('file_id, filename, created_at')
      .eq('owner', userId)
      .eq('asgn_id', asgn_id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching user files:', error);
      return [];
    }

    return data;
  }

  return (
    <div>
      <h3>Your submission:</h3>
      {files.length > 0 ? (
        <ul>
          <li key={files[0].filename}>
            <Link
              href={{
                pathname: `/courses/${course_id}/${asgn_id}/grade`,
                query: {
                  owner: userContext?.currentUser?.uid,
                  file_id: files[0].file_id,
                  filename: files[0].filename,
                },
              }}
            >
              View File: {files[0].filename}
            </Link>
          </li>
        </ul>
      ) : (
        <p>No submissions found.</p>
      )}
    </div>
  );
}
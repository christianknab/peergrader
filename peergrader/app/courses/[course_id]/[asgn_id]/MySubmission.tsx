"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';


interface FileData {
  file_id: string;
  filename: string;
  created_at: string;
  grade: string | null;
}

interface MySubmissionProps {
  course_id: string;
  asgn_id: string;
}

export default function MySubmission({ course_id, asgn_id }: MySubmissionProps) {
  const supabase = createClient();

  const {
    data: currentUser,
    isLoading: isUserLoading,
    isError
  } = useCurrentUserQuery();

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !currentUser) {
    return <div>Error</div>;
  }
  const [files, setFiles] = useState<FileData[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchFiles(currentUser.uid, asgn_id).then(setFiles);
    }
  }, [currentUser]);

  async function fetchFiles(userId: string, asgn_id: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('file_id, filename, created_at, final_grade')
      .eq('owner', userId)
      .eq('asgn_id', asgn_id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching user files:', error);
      return [];
    }

    return data.map((file) => ({
      file_id: file.file_id,
      filename: file.filename,
      created_at: file.created_at,
      grade: file.final_grade,
    }));
  }

  return (
    <div>
      <h3>Your submission:</h3>
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.filename}>
              <Link
                href={{
                  pathname: `/courses/${course_id}/${asgn_id}/view`,
                  query: {
                    owner: currentUser?.uid,
                    file_id: file.file_id,
                    filename: file.filename,
                  },
                }}
              >
                View File: {file.filename} {file.grade !== null ? `-- Grade: ${file.grade}` : '-- Not graded yet'}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No submissions found.</p>
      )}
    </div>
  );
}
"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useUser } from '@/utils/providers/UserDataProvider';

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

    const fileData = await Promise.all(
      data.map(async (file) => {
        const { data: gradeData, error: gradeError } = await supabase
          .from('grades')
          .select('grade')
          .eq('file_id', file.file_id)
          .single();

        if (gradeError) {
          console.error('Error fetching grade:', gradeError);
          return { ...file, grade: null };
        }

        return { ...file, grade: gradeData?.grade ?? null };
      })
    );

    return fileData;
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
                    owner: userContext?.currentUser?.uid,
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
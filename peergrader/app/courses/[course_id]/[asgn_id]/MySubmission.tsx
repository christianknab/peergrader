"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import UploadButton from './UploadButton';


interface SubmissionData {
  file_id: string;
  filename: string;
  created_at: string;
  grade: string | null;
  view_url: string;
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
  const [submission, setSubmission] = useState<SubmissionData | null>(null);

  useEffect(() => {
    if (currentUser) {
      fetchSubmission(currentUser.uid, asgn_id).then((data) => setSubmission(data));
    }
  }, [currentUser]);

  async function fetchSubmission(userId: string, asgn_id: string) {
    const { data, error } = await supabase
      .from('submissions')
      .select('file_id, filename, created_at, final_grade')
      .eq('owner', userId)
      .eq('asgn_id', asgn_id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Error fetching user files:', error);
      return null;
    }

    // Check if data array has at least one element
    if (data.length > 0) {
      const view_url = supabase.storage.from('files').getPublicUrl(`${userId}/${data[0].file_id}` || '');

      return {
        file_id: data[0].file_id,
        filename: data[0].filename,
        created_at: data[0].created_at,
        grade: data[0].final_grade,
        view_url: view_url.data.publicUrl,
      };
    }

    return null;
  }

  return (
    <div>
      {submission ? (
        <div>
          <h1>Your submission:</h1>
          {submission.grade ? 'Grade: '+ submission.grade : 'Not graded yet'}

          <h1>{submission.filename}</h1>
          <div style={{ height: '90vh', width: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <iframe
              src={submission.view_url}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                overflow: 'hidden',
              }}
            >
            </iframe>
          </div>

        </div>
      ) : (
        <div>
          <h2>Submit assignment</h2>
          < UploadButton asgn_id={asgn_id} />
        </div>

      )}
    </div>
  );
}
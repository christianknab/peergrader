"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

interface SubmissionData {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  file_id: string | null;
}

interface ListSubmissionsProps {
  course_id: string;
  asgn_id: string;
}

export default function ListSubmissions({ course_id, asgn_id }: ListSubmissionsProps) {
  const supabase = createClient();
  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);

  useEffect(() => {
    fetchSubmissions(course_id, asgn_id).then(setSubmissions);
  }, [course_id, asgn_id]);

  async function fetchSubmissions(course_id: string, asgn_id: string) {
    const { data, error } = await supabase.rpc('get_submissions', { course_id_param: course_id, asgn_id_param: asgn_id });
    if (error) {
      console.error('Error fetching submissions:', error);
      return;
    }
    return data;
  }

  return (
    <div>
      <ul>
        {submissions.map((submission, index) => (
          <li key={index}>
            {submission.first_name} {submission.last_name}: {' '}
            {submission.file_id && ('Turned in') || ('No Submission')}
          </li>
        ))}
      </ul>
    </div>
  );
}
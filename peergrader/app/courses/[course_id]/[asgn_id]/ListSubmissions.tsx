"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

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

  let totalPeople = submissions.length;
  let submitted = submissions.filter(submission => submission.file_id).length;
  let progress = totalPeople > 0 ? submitted / totalPeople : 0;

  return (
    <div>
      <div className="flex space-x-2 items-center">
        <progress value={progress} max="1" />
        <span>{submitted}/{totalPeople} submissions</span>
      </div>
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
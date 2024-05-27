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
  const [progress, setProgress] = useState<number>(0);
  const [submitted, setSubmitted] = useState<number>(0);

  useEffect(() => {
    fetchSubmissions(course_id, asgn_id).then(setSubmissions);
  }, [asgn_id]);

  useEffect(() => {
    if (submissions.length > 0) {
      let submitted = submissions.filter(submission => submission.file_id).length;
      setSubmitted(submitted);
      setProgress(submitted / submissions.length);
    }
  }, [submissions]);

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
      <div className="flex space-x-2 items-center">
        <div className="w-full mb-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">{submitted}/{submissions.length} submissions</span>
          </div>
          <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className="absolute top-0 left-0 h-3 progress-gradient rounded"
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
        </div>
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
"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

type AsgnData = {
  asgn_id: string;
  name: string;
  course_id: string;
  average_grade: number;
  phase: string;
  start_date_submission: Date;
  end_date_submission: Date;
  start_date_grading: Date;
  end_date_grading: Date;
} | null;

export default function StudentListAllAsgn() {
  const supabase = createClient();
  const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
  const [asgns, setUserAssignments] = useState<AsgnData[]>([]);

  useEffect(() => {
    fetchUserAssignments(currentUser?.uid).then(setUserAssignments);
  }, [currentUser]);

  async function fetchUserAssignments(userId: string) {

    const { data: accountCourses, error: accountCoursesError } = await supabase
      .from('account_courses')
      .select('course_id')
      .eq('uid', userId);

    if (accountCoursesError) {
      console.error('Error fetching user courses:', accountCoursesError);
      return [];
    }

    const courseIds = accountCourses.map((row) => row.course_id);
    const allAsgns: AsgnData[] = []

    for (const courseId of courseIds) {
      const { data, error } = await supabase.rpc('get_asgns_list', { course_id_param: courseId, user_id_param: currentUser?.uid });

      if (error) {
        console.error('Error fetching assignments:', error);
        continue;
      }

      const assignmentsWithCourseId = data.map((asgnData: AsgnData) => ({
        ...asgnData,
        course_id: courseId,
      }));

      allAsgns.push(...assignmentsWithCourseId);
    }

    return allAsgns;
  }

  return (
    <div className="light-grey flex-grow p-6">
      {asgns && asgns.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {asgns.map((assignment) => (
            assignment && (<Link
              key={assignment.asgn_id}
              href={`/courses/${assignment.course_id}/${assignment.asgn_id}`}
              className="block"
            >
              <div className="rounded-lg border p-4 bg-white shadow hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{assignment.name}</h3>
                  {assignment.phase == 'Closed' ? 'Final grade: ' + assignment.average_grade : 'Phase: ' + assignment.phase}
                </div>
              </div>
            </Link>)
          ))}
        </div>
      ) : (
        <p>No assignments to display.</p>
      )}
    </div>
  );
}
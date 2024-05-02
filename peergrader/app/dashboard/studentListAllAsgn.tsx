"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

interface AsgnData {
  asgn_id: string;
  name: string;
  course_id: string;
  final_grade: number | null;
}

export default function StudentListAllAsgn() {
  const supabase = createClient();
  const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
  const [userAssignments, setUserAssignments] = useState<AsgnData[]>([]);

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

    // Fetch assignments for the user's courses
    const { data: assignments, error: assignmentsError } = await supabase
      .from('assignments')
      .select('asgn_id, name, course_id')
      .in('course_id', courseIds);

    if (assignmentsError) {
      console.error('Error fetching user assignments:', assignmentsError);
      return [];
    }

    // Fetch final grades for each assignment
    const asgnDataWithGrades: AsgnData[] = await Promise.all(
      assignments.map(async (assignment) => {
        const { data: submissions, error: submissionsError } = await supabase
          .from('submissions')
          .select('final_grade')
          .eq('owner', userId)
          .eq('asgn_id', assignment.asgn_id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (submissionsError) {
          console.error('Error fetching submissions:', submissionsError);
          return {
            asgn_id: assignment.asgn_id,
            name: assignment.name,
            course_id: assignment.course_id,
            final_grade: null,
          };
        }

        const finalGrade = submissions.length > 0 ? submissions[0].final_grade : null;

        return {
          asgn_id: assignment.asgn_id,
          name: assignment.name,
          course_id: assignment.course_id,
          final_grade: finalGrade,
        };
      })
    );

    return asgnDataWithGrades;
  }

  return (
    <div className="light-grey flex-grow p-6">
      {userAssignments && userAssignments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {userAssignments.map((asgnData) => (
            <Link
              key={asgnData.asgn_id}
              href={`/courses/${asgnData.course_id}/${asgnData.asgn_id}`}
              className="block"
            >
              <div className="rounded-lg border p-4 bg-white shadow hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold">{asgnData.name}</h3>
                  {asgnData.final_grade ? 'Grade: ' + asgnData.final_grade : 'Not graded yet'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No assignments to display.</p>
      )}
    </div>
  );
}
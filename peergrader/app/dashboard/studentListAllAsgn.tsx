"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

interface AsgnData {
  asgn_id: string;
  name: string;
  course_id: string;
  average_grade: number;
  phase: string;
  start_date_submission: Date;
  end_date_submission: Date;
  start_date_grading: Date;
  end_date_grading: Date;
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
      .select('asgn_id, name, course_id, start_date_submission, end_date_submission, start_date_grading, end_date_grading')
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
          .select('file_id')
          .eq('owner', userId)
          .eq('asgn_id', assignment.asgn_id)
          .order('created_at', { ascending: false })
          .limit(1);

        const { data: average_grade, error: averageGradeError } = await supabase.rpc('calculate_average_grade', { file_id_param: submissions });

        const { data: phase, error: phaseError } = await supabase.rpc('get_assignment_phase', {
          start_date_submission: assignment.start_date_submission,
          end_date_submission: assignment.end_date_submission,
          start_date_grading: assignment.start_date_grading,
          end_date_grading: assignment.end_date_grading
        });

        if (submissionsError || phaseError || averageGradeError) {
          console.error('Error fetching submissions:', submissionsError);
          return {
            asgn_id: assignment.asgn_id,
            name: assignment.name,
            course_id: assignment.course_id,
            average_grade: null,
            phase: 'Closed',
            start_date_submission: assignment.start_date_submission,
            end_date_submission: assignment.end_date_submission,
            start_date_grading: assignment.start_date_grading,
            end_date_grading: assignment.end_date_grading,
          };
        }


        return {
          asgn_id: assignment.asgn_id,
          name: assignment.name,
          course_id: assignment.course_id,
          average_grade: average_grade,
          phase: phase,
          start_date_submission: assignment.start_date_submission,
          end_date_submission: assignment.end_date_submission,
          start_date_grading: assignment.start_date_grading,
          end_date_grading: assignment.end_date_grading,
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
                  {'Phase: ' + asgnData.phase + ' -- '}
                  {(asgnData.average_grade && asgnData.phase == 'Closed') ? 'Grade: ' + asgnData.average_grade : 'Not graded yet'}
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
"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import '@fortawesome/fontawesome-free/css/all.css';

interface CourseData {
  course_id: string;
  name: string;
}

interface AsgnData {
  asgn_id: string;
  name: string;
  course_id: string;
  course_name: string;  // Add course_name property
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
  const [asgns, setUserAssignments] = useState<AsgnData[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchUserAssignments(currentUser.uid).then(setUserAssignments);
    }
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
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select('name')
        .eq('course_id', courseId)
        .single();

      if (courseError) {
        console.error('Error fetching course:', courseError);
        continue;
      }

      const { data, error } = await supabase.rpc('get_asgns_for_course_student', { course_id_param: courseId, user_id_param: currentUser?.uid });

      if (error) {
        console.error('Error fetching assignments:', error);
        continue;
      }

      const assignmentsWithCourseId = data.map((asgnData: AsgnData) => ({
        ...asgnData,
        course_id: courseId,
        course_name: courseData.name, 
      }));

      allAsgns.push(...assignmentsWithCourseId);
    }

    return allAsgns;
  }

  const filteredAssignments = asgns.filter(assignment => assignment.phase === 'Submit');

  return (
    <div className="flex-grow p-6">
      {filteredAssignments && filteredAssignments.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredAssignments.map((assignment) => (
            assignment && (
              <Link
                key={assignment.asgn_id}
                href={`/courses/${assignment.course_id}/${assignment.asgn_id}`}
                className="block"
              >
                <div className="rounded-lg border p-4 bg-white shadow hover:shadow-lg transition-shadow">
                  <div className="flex flex-col space-y-2">
                    <h4 className="text-md font-semibold text-gray-600">{assignment.course_name}</h4>
                    <hr className="my-1 border-t-2"></hr>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <i className="fas fa-pencil-alt text-lg text-gray-700 mr-3"></i>
                        <h3 className="text-lg font-semibold">{assignment.name}</h3>
                      </div>
                      <div className="text-right">
                        <div>
                          {assignment.phase === 'Closed' ? (
                            assignment.average_grade ? (
                              `Final grade: ${assignment.average_grade}`
                            ) : (
                              'Grade unavailable'
                            )
                          ) : (
                            `Phase: ${assignment.phase}`
                          )}
                        </div>
                        <div className="text-center rounded-lg" style={{ backgroundColor: '#FAD2D2' }}>
                          Due: {new Date(assignment.end_date_submission).getMonth() + 1}/{new Date(assignment.end_date_submission).getDate()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          ))}
        </div>
      ) : (
        <p>No assignments to display.</p>
      )}
    </div>
  );
}

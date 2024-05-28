"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

interface AsgnData {
  asgn_id: string;
  name: string;
  course_id: string;
  course_name: string;
}

interface SubmissionData {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  file_id: string | null;
}

interface TeacherListAllAsgnProps {
  setCourseAssignmentsCount: (counts: { [course_id: string]: number }) => void;
}


export default function TeacherListAllAsgn({ setCourseAssignmentsCount }: TeacherListAllAsgnProps) {
  const supabase = createClient();
  const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
  const [userAssignments, setUserAssignments] = useState<AsgnData[]>([]);
  const [submissions, setSubmissions] = useState<{ [key: string]: SubmissionData[] }>({});

  useEffect(() => {
    if (currentUser) {
      fetchUserAssignments(currentUser.uid).then(assignments => {
        setUserAssignments(assignments);
        calculateAssignmentsCount(assignments);
      });
    }
  }, [currentUser]);

  async function fetchUserAssignments(userId: string) {
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('course_id, name')
      .eq('owner', userId);

    if (coursesError) {
      console.error('Error fetching user courses:', coursesError);
      return [];
    }

    const courseIds = courses.map((row) => row.course_id);
    const courseMap = Object.fromEntries(courses.map((course) => [course.course_id, course.name]));

    const { data, error } = await supabase
      .from('assignments')
      .select('asgn_id, name, course_id')
      .in('course_id', courseIds);

    if (error) {
      console.error('Error fetching user assignments:', error);
      return [];
    }

    return data.map((assignment) => ({
      ...assignment,
      course_name: courseMap[assignment.course_id],
    }));
  }

  async function fetchSubmissions(course_id: string, asgn_id: string) {
    const { data, error } = await supabase.rpc('get_submissions', { course_id_param: course_id, asgn_id_param: asgn_id });
    if (error) {
      console.error('Error fetching submissions:', error);
      return [];
    }
    return data;
  }
  function calculateAssignmentsCount(assignments: AsgnData[]) {
    const courseAssignmentsCount: { [key: string]: number } = {};

    assignments.forEach((assignment) => {
      if (!courseAssignmentsCount[assignment.course_id]) {
        courseAssignmentsCount[assignment.course_id] = 0;
      }
      courseAssignmentsCount[assignment.course_id]++;
    });

    setCourseAssignmentsCount(courseAssignmentsCount);
  }

  useEffect(() => {
    userAssignments.forEach((assignment) => {
      fetchSubmissions(assignment.course_id, assignment.asgn_id).then((data) => {
        setSubmissions((prevSubmissions) => ({
          ...prevSubmissions,
          [assignment.asgn_id]: data,
        }));
      });
    });
  }, [userAssignments]);

  return (
    <div className="flex-grow p-6">
      {userAssignments && userAssignments.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {userAssignments.map((asgnData) => {
            const assignmentSubmissions = submissions[asgnData.asgn_id] || [];
            const totalPeople = assignmentSubmissions.length;
            const submitted = assignmentSubmissions.filter(submission => submission.file_id).length;
            const progress = totalPeople > 0 ? submitted / totalPeople : 0;

            return (
              <Link
                key={asgnData.asgn_id}
                href={`/courses/${asgnData.course_id}/${asgnData.asgn_id}`}
                className="block"
              >
                <div className="rounded-lg border p-4 bg-white shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex flex-col space-y-">
                    <h4 className="text-md font-semibold text-gray-600">{asgnData.course_name}</h4>
                    <hr className="my-1 border-t-2"></hr>
                    <h3 className="text-lg font-semibold text-gray-800">{asgnData.name}</h3>
                    <div className="flex space-x-2 items-center">
                      <div className="relative w-full h-4 bg-gray-200 rounded">
                        <div
                          className="absolute top-0 left-0 h-4 progress-gradient rounded"
                          style={{ width: `${progress * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{submitted}/{totalPeople} submissions</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-gray-600">No assignments to display.</p>
      )}
    </div>
  );
}

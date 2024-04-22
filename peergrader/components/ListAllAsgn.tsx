"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

import Link from 'next/link';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';

interface AsgnData {
  asgn_id: string;
  name: string;
  course_id: string;
}

export default function ListAllAsgn() {
  const supabase = createClient();

  const { 
    data: currentUser, 
    isLoading, 
    isError 
  } = useCurrentUserQuery();
 
  if (isLoading) {
    return <div>Loading...</div>;
  }
 
  if (isError) {
    return <div>Error</div>;
  }

  const [userAssignments, setUserAssignments] = useState<AsgnData[]>([]);

  useEffect(() => {
    if (currentUser) {
      fetchUserAssignments(currentUser.uid).then(setUserAssignments);
    }
  }, [currentUser]);

  async function fetchUserAssignments(userId: string) {
    if (currentUser?.is_teacher) {
      const { data: courses, error: coursesError } = await supabase
        .from('courses')
        .select('course_id')
        .eq('owner', userId);

      if (coursesError) {
        console.error('Error fetching user courses:', coursesError);
        return [];
      }

      const courseIds = courses.map((row) => row.course_id);

      const { data, error } = await supabase
        .from('assignments')
        .select('asgn_id, name, course_id')
        .in('course_id', courseIds);

      if (error) {
        console.error('Error fetching user assignments:', error);
        return [];
      }

      return data;
    }
    else {
      const { data: accountCourses, error: accountCoursesError } = await supabase
        .from('account_courses')
        .select('course_id')
        .eq('uid', userId);

      if (accountCoursesError) {
        console.error('Error fetching user courses:', accountCoursesError);
        return [];
      }

      const courseIds = accountCourses.map((row) => row.course_id);

      const { data, error } = await supabase
        .from('assignments')
        .select('asgn_id, name, course_id')
        .in('course_id', courseIds);

      if (error) {
        console.error('Error fetching user assignments:', error);
        return [];
      }

      return data;
    }
  }

  return (
    <div>
      <ul>
        {userAssignments.map((asgnData) => (
          <li key={asgnData.asgn_id}>
            <Link
              href={{
                pathname: `/courses/${asgnData.course_id}/${asgnData.asgn_id}`,
              }}
              className="text-blue-500 hover:text-blue-700 underline"
            >
              {asgnData.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
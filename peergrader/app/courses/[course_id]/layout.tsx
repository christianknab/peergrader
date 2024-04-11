'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface CourseData {
//   id: string;
  name: string;
//   owne r: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { course_id } = useParams();
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('name')
          .eq('course_id', course_id)
          .single();

        if (error) {
          console.error('Error fetching course data:', error);
        } else {
          setCourseData(data);
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      }
    }

    if (course_id) {
      fetchCourseData();
    }
  }, [course_id]);

  return (
    <div>
      <header>
        <h1>{courseData?.name || 'Course Page'}</h1>
      </header>
      <main>{children}</main>
    </div>
  );
};

export default Layout;
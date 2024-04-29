'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface CourseData {
  name: string;
}

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
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
    // <div className="w-full min-h-screen flex flex-col">
    //   <main>
    //     <div className="w-full flex justify-between items-center p-4 light-grey">
    //       <button 
    //         className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
    //         onClick={() => router.push('/dashboard')}>
    //           Return to Dashboard
    //       </button>
    //       <span className="font-bold text-lg">PeerGrader</span>
    //     </div>
    //     <header>
    //       <div className="w-4/5 mx-auto bold-blue rounded-lg">
    //         <h2 className="text-5xl font-bold text-left mt-4 mb-8 p-28 text-white">{courseData?.name || 'Course Page'}</h2>
    //       </div>
    //     </header>
    //     <div className="w-4/5 mx-auto">
          <main>{children}</main>
    //     </div>
    //   </main>
    //   <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
    //     <p>&copy;2024 PeerGrader</p>
    //   </footer>
    // </div>
  );
};

export default Layout;
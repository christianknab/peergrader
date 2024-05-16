'use client';

import { useParams, useRouter } from 'next/navigation';
import useCourseDataQuery from '@/utils/hooks/QueryCourseData';


interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const course_id = useParams().course_id as string;
  const {
    data: courseData,
    isLoading: courseDataLoading,
    isError: courseDataError
  } = useCourseDataQuery(course_id);
  if (courseDataLoading) { return <div>Loading...</div>; }
  if (courseDataError) { return <div>Error</div>; }


  return (
    <div className="w-full min-h-screen flex flex-col">
      <main>{children}</main>
    </div>
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
    //     </div>
    //   </main>
    //   <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
    //     <p>&copy;2024 PeerGrader</p>
    //   </footer>
    // </div>
  );
};

export default Layout;
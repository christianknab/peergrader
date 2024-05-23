import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import '@fortawesome/fontawesome-free/css/all.css';
import StudentListAllAsgn from "@/app/dashboard/studentListAllAsgn";
import { LoadingSpinner } from "@/components/loadingSpinner";


export default function StudentDashboardPage() {
  const router = useRouter();
  interface CourseData {
    course_id: string;
    name: string;
  }
  const supabase = createClient();
  const [userCourses, setUserCourses] = useState<CourseData[]>([]);
  const { data: currentUser, isLoading, isError } = useCurrentUserQuery();

  useEffect(() => {
    fetchUserCourses(currentUser?.uid).then(setUserCourses);
  }, [currentUser]);

  async function fetchUserCourses(userId: string) {
    const { data, error } = await supabase.rpc('get_courses_student', { user_id_param: userId });
    if (error) {
      console.error('Error fetching courses:', error);
      return;
    }
    return data;
  }
  if (isLoading) { return <LoadingSpinner/>; }
  if (isError) { return <div>Error</div>; }

  return (
    <div className="flex flex-col min-h-screen w-full bg-white">

      <header className="w-full py-3">
        <h1 className="text-5xl font-bold text-left pl-4 write-blue">Student Dashboard</h1>
        <hr className="my-1 border-t-2"></hr>
      </header>

      <main className="flex-1 w-full">
        <div className="px-4 py-0 flex gap-8">

          <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
            <div className="light-blue p-5">
              <p className="text-xl text-left font-semibold write-grey">Assignments</p>
            </div>
            <div className="light-white flex-grow p-6">
              <StudentListAllAsgn />
            </div>
          </div>

          <div className="flex flex-col flex-grow rounded-lg overflow-hidden">
            <div className="flex justify-between items-center light-blue p-5">
              <Link
                href="/courses"
                className="text-xl text-left font-semibold write-grey"
              >
                Courses Enrolled
              </Link>
              <button
                className="bg-blue-500 text-white font-bold py-1 px-4 rounded hover:bg-btn-background-hover"
                onClick={() => router.push('/courses')}>
                + Add Course
              </button>
            </div>

            <div className="min-h-[500px] light-white flex-grow p-6">
              <div className="grid grid-cols-3 gap-8 flex-grow">
                {userCourses.map((courseData) => (
                  <div key={courseData.course_id} className="rounded-lg border p-6 bg-white">
                    <Link href={`/courses/${courseData.course_id}`}>
                      <div className="text-center">
                        <div className="font-semibold light-grey">
                          {courseData.name}
                        </div>
                        <i className="fas fa-book text-5xl mt-8"></i>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full font-bold light-grey p-4 bg-white text-center">
        <p>&copy;2024 PeerGrader</p>
      </footer>
    </div>
  );
}

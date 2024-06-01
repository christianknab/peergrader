"use client";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import '@fortawesome/fontawesome-free/css/all.css';
import StudentListAllAsgn from "@/app/dashboard/studentListAllAsgn";
import { LoadingSpinner } from "@/components/loadingSpinner";
import JoinCourse from '@/app/courses/JoinCourse';
import CourseCard from "@/components/CourseCard";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
      <div className="white-blue-gradient rounded-lg p-8 relative">
        <button className="absolute top-0 right-0 m-2 font-bold text-gray-700" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default function StudentDashboardPage() {
  const router = useRouter();
  interface CourseData {
    course_id: string;
    name: string;
    assignmentsCount?: number;
    number: string;
  }
  const supabase = createClient();
  const [userCourses, setUserCourses] = useState<CourseData[]>([]);
  const { data: currentUser, isLoading, isError } = useCurrentUserQuery();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (currentUser) {
      fetchUserCourses(currentUser.uid).then(setUserCourses);
    }
  }, [currentUser]);

  async function fetchUserCourses(userId: string) {
    const { data, error } = await supabase.rpc('get_courses_student', { user_id_param: userId });
    if (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
    return data;
  }

  const setCourseAssignmentsCount = (counts: { [courseId: string]: number }) => {
    setUserCourses(prevCourses =>
      prevCourses.map(course => ({
        ...course,
        assignmentsCount: counts[course.course_id] || 0,
      }))
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="w-full py-8">
        <h1 className="text-6xl font-bold text-left pl-4 write-blue">Student Dashboard</h1>
      </header>

      <main className="flex-1 w-full">
        <div className="px-4 py-0 flex gap-8 mb-10">
          <div className="flex flex-col flex-grow rounded-lg overflow-hidden shadow-lg">
            <div className="white-blue-gradient p-5">
              <p className="text-xl text-left text-white font-semibold">To-Do Assignments</p>
            </div>
            <div className="light-white flex-grow p-6">
              <StudentListAllAsgn setCourseAssignmentsCount={setCourseAssignmentsCount} />
            </div>
          </div>

          <div className="flex flex-col flex-grow rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-center white-blue-gradient p-5">
              {/* <Link
                href="/courses"
                className="text-xl text-left text-white font-semibold"
              >
                Courses Enrolled
              </Link> */}
              <p className="text-xl text-left text-white font-semibold">Courses Enrolled</p>
              <button
                className="light-grey text-black font-semibold py-1 px-4 rounded hover:bg-btn-background-hover"
                onClick={() => setShowModal(true)}>
                + Join Course
              </button>
            </div>

            <div className="min-h-[500px] light-white flex-grow p-6">
              <div className="grid grid-cols-3 gap-8 flex-grow">
                {userCourses.map((courseData) => (
                  <CourseCard key={courseData.course_id} courseData={courseData} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="shadow w-full font-bold p-4 bg-white text-center">
        <p>&copy;2024 PeerGrader</p>
      </footer>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <JoinCourse onClose={() => setShowModal(false)} />
      </Modal>
    </div>
  );
}

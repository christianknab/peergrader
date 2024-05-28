"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { redirect, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import '@fortawesome/fontawesome-free/css/all.css';
import TeacherListAllAsgn from "./teacherListAllAsgn";
import { LoadingSpinner } from "@/components/loadingSpinner";
import CreateCourse from '../courses/CreateCourse';
import CourseCard from '@/components/CourseCard';

interface CourseData {
  course_id: string;
  name: string;
  assignmentsCount?: number;
  number: string;
}

const TeacherDashboard: React.FC = () => {
  const router = useRouter();
  const supabase = createClient();
  const [userCourses, setUserCourses] = useState<CourseData[]>([]);
  const [showModal, setShowModal] = useState(false);

  const {
    data: currentUser,
    isLoading: isUserLoading,
    isError
  } = useCurrentUserQuery();

  useEffect(() => {
    if (currentUser) {
      fetchUserCourses(currentUser.uid).then(setUserCourses);
    }
  }, [currentUser]);

  async function fetchUserCourses(userId: string) {
    const { data, error } = await supabase
      .from('courses')
      .select('course_id, name, number')
      .eq('owner', userId);

    if (error) {
      console.error('Error fetching course names:', error);
      return [];
    }

    return data;
  }

  const refreshCourses = async () => {
    if (currentUser) {
      const updatedCourses = await fetchUserCourses(currentUser.uid);
      setUserCourses(updatedCourses);
    }
  };

  const setCourseAssignmentsCount = (counts: { [courseId: string]: number }) => {
    setUserCourses(prevCourses =>
      prevCourses.map(course => ({
        ...course,
        assignmentsCount: counts[course.course_id] || 0,
      }))
    );
  };

  if (isUserLoading) {
    return <LoadingSpinner />;
  }

  if (isError || !currentUser) {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col min-h-screen w-full">
      <header className="w-full py-8">
        <h1 className="text-6xl font-bold text-left pl-4 write-blue">Teacher Dashboard</h1>
      </header>

      <main className="flex-1 w-full">
        <div className="px-4 py-0 flex gap-8 mb-10">
          <div className="flex flex-col flex-grow rounded-lg overflow-hidden shadow-lg">
            <div className="white-blue-gradient p-5">
              <p className="text-xl text-left font-semibold text-white">Assignments</p>
            </div>
            <div className="light-white flex-grow p-6">
              <div className="max-w-7xl mx-auto">
                <TeacherListAllAsgn setCourseAssignmentsCount={setCourseAssignmentsCount} />
              </div>
            </div>
          </div>

          <div className="flex flex-col flex-grow rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-center white-blue-gradient p-5">
              <p className="text-xl text-left font-semibold text-white">Active Courses</p>
              <button
                className="light-grey text-black font-semibold py-1 px-4 rounded hover:bg-btn-background-hover"
                onClick={() => setShowModal(true)}>
                + Add Course
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

      <CreateCourse
        showModal={showModal}
        onClose={() => setShowModal(false)}
        refreshCourses={refreshCourses}
      />
    </div>
  );
}

export default TeacherDashboard;

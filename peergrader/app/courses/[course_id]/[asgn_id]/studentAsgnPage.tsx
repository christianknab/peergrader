'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import MySubmission from './MySubmission';
import ListGraded from './ListGraded';
import GetNextToGrade from './GetNextToGrade';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AsgnData {
  name: string;
  phase: string
}

interface CourseData {
  owner: string;
  name: string;
}

export default function StudentAsgnPage() {
  const router = useRouter();
  const supabase = createClient();
  const params = useParams();
  const course_id = params.course_id as string;
  const asgn_id = params.asgn_id as string;

  const [asgnData, setAsgnData] = useState<AsgnData | null>(null);
  const [courseData, setCourseData] = useState<CourseData | null>(null);

  useEffect(() => {
    async function fetchCourseData() {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('owner, name')
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


  useEffect(() => {
    async function fetchAsgnData() {
      try {
        const { data: asgnData, error: asgnError } = await supabase
          .from('assignments')
          .select('name')
          .eq('asgn_id', asgn_id)
          .single();

        const { data: phaseData, error: phaseError } = await supabase
          .from('assignment_phases')
          .select('phase')
          .eq('asgn_id', asgn_id)
          .single();

        if (asgnError || phaseError) {
          console.error('Error fetching data:', asgnError || phaseError);
        } else {
          setAsgnData({
            name: asgnData.name,
            phase: phaseData.phase,
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchAsgnData();
  }, [asgn_id]);


  return (
    <div className="w-full min-h-screen flex flex-col">
      <main className="flex-1 w-full">
        <div className="w-full flex justify-between items-center p-4 light-grey">
          <button
            className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
            onClick={() => router.push('/dashboard')}>
            Return to Dashboard
          </button>
          <span className="font-bold text-lg">PeerGrader</span>
        </div>
        <header>
          <div className="w-4/5 mx-auto">
            <nav className="rounded-md w-1/5 bg-light-grey">
              <ul className="flex justify-between px-4 py-2">
                <li><Link href={`/courses/${course_id}`} className="text-black hover:text-blue-800">Home</Link></li>
                <li className="text-black hover:text-blue-800">Students</li>
                <li className="text-black hover:text-blue-800">Grades</li>
              </ul>
            </nav>
            <h2 className=" bold-blue rounded-lg text-5xl font-bold text-left mb-6 p-14 text-white">
              {courseData?.name || 'Course Page'}
            </h2>
          </div>
        </header>
        <div className="w-4/5 mx-auto bg-white shadow-lg rounded-lg p-8 mt-12 mb-12">
          {asgnData && (
            <div className="mb-4 p-4 bg-blue-100 rounded-md">
              <h2 className="text-xl font-semibold">Assignment: {asgnData.name} -- Phase: {asgnData.phase}</h2>
            </div>
          )}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <MySubmission asgn_id={asgn_id} />
            </div>
            <div className="w-1/2 flex flex-col space-y-4">
              <ListGraded course_id={course_id} asgn_id={asgn_id} />
              <div className='flex justify-center w-full'>
                <GetNextToGrade course_id={course_id} asgn_id={asgn_id} />
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
        <p>&copy;2024 PeerGrader</p>
      </footer>
    </div>
  );
}
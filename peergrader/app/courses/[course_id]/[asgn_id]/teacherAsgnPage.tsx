'use client';
import { useParams } from 'next/navigation';
import ListSubmissions from './ListSubmissions';
import { useRouter } from 'next/navigation';
import useCourseDataQuery from '@/utils/hooks/QueryCourseData';
import useAsgnDataQuery from '@/utils/hooks/QueryAsgnData';
import usePhaseFromIdQuery from '@/utils/hooks/QueryAsgnPhase';
import { LoadingSpinner } from '@/components/loadingSpinner';
import NavBar from '@/components/NavBar';
import PhaseProgressBar from './PhaseProgressBar';
import Description from './Description';


export default function TeacherAsgnPage() {
  const router = useRouter();
  const params = useParams();
  const course_id = params.course_id as string;
  const asgn_id = params.asgn_id as string;

  const {
    data: courseData,
    isLoading: courseDataLoading,
    isError: courseDataError
  } = useCourseDataQuery(course_id);

  const {
    data: asgnData,
    isLoading: asgnDataLoading,
    isError: asgnDataError
  } = useAsgnDataQuery(asgn_id);

  const {
    data: phase,
    isLoading: isPhaseLoading,
    isError: isPhaseError
  } = usePhaseFromIdQuery(asgn_id, true);

  if (courseDataLoading || asgnDataLoading || isPhaseLoading) { return (<LoadingSpinner />); }
  if (courseDataError || asgnDataError || isPhaseError) { return <div>Error</div>; }


  return (
    <div className="w-full min-h-screen flex flex-col">
      <main className="flex-1 w-full">
        <NavBar courseName={courseData?.name} courseId={course_id} assignmentName={asgnData?.name} assignmentId={asgn_id} />
        <header>
          <div className="w-4/5 mx-auto pt-5">
            <nav className="rounded-md w-1/5 bg-light-grey">
            </nav>
            <h2 className=" bold-blue rounded-lg text-5xl font-bold text-left p-14 text-white">
              {asgnData?.name ?? 'Unnamed Course'}
            </h2>
          </div>
        </header>
        <div className="w-4/5 mx-auto bg-white shadow-lg rounded-lg p-8 mt-12 mb-12">
          {asgnData && (
            <Description asgnData={asgnData} />
          )}
          <div className="flex flex-col space-y-4">
            <PhaseProgressBar asgn_id={asgn_id} />
            <ListSubmissions course_id={course_id} asgn_id={asgn_id} />
          </div>
        </div>
      </main>
      <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
        <p>&copy;2024 PeerGrader</p>
      </footer>
    </div>
  );
}
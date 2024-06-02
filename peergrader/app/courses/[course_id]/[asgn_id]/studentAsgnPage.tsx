'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MySubmission from './MySubmission';
import ListGraded from './ListGraded';
import GetNextToGrade from './GetNextToGrade';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { format } from 'date-fns';
import UploadButton from './UploadButton';
import ListGrades from './ListGrades';
import useCourseDataQuery from '@/utils/hooks/QueryCourseData';
import useAsgnDataQuery from '@/utils/hooks/QueryAsgnData';
import usePhaseFromIdQuery from '@/utils/hooks/QueryAsgnPhase';
import { Phase } from '@/utils/types/phaseEnum';
import { LoadingSpinner } from '@/components/loadingSpinner';
import NavBar from '@/components/NavBar';
import PhaseProgressBar from './PhaseProgressBar';
import Description from './Description';
import ForgotPasswordClient from '@/app/dashboard/change-password/page';


export interface SubmissionData {
  file_id: string;
  filename: string;
  created_at: string;
  view_url: string;
}

export default function StudentAsgnPage() {
  const router = useRouter();
  const params = useParams();
  const course_id = params.course_id as string;
  const asgn_id = params.asgn_id as string;
  const [submission, setSubmission] = useState<SubmissionData | null>(null);
  const [isNoSubmissionsToGrade, setIsNoSubmissionsToGrade] = useState(false);
  const [isIncompleteGrade, setIsIncompleteGrade] = useState(false);

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

  useEffect(() => {
    if (isIncompleteGrade || isNoSubmissionsToGrade) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
  }, [isIncompleteGrade, isNoSubmissionsToGrade]);
  

  if (courseDataLoading || asgnDataLoading || isPhaseLoading) { return (<LoadingSpinner />); }
  if (courseDataError || asgnDataError || isPhaseError) { return <div>Error</div>; }
  document.body.style.overflow = 'auto';

  return (

      <div className="w-full min-h-screen flex flex-col">

        <main className="flex-1 w-full">
          {(isIncompleteGrade || isNoSubmissionsToGrade) &&
            <div>
              <div className='fixed w-screen h-screen opacity-50 bg-black z-40'>
              </div>
              <div className='fixed z-50 flex items-center inset-0 justify-center'>
                <div className="max-w-sm h-auto bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="px-6 py-4">
                    {isIncompleteGrade && <h2 className="text-xl font-bold mb-2">Incomplete Grade</h2>}
                    {isIncompleteGrade && <p className="text-gray-700 text-base">
                      Please grading current assignments before requesting more.
                    </p>}
                    {isNoSubmissionsToGrade && <h2 className="text-xl font-bold mb-2">Submission Unavailable</h2>}
                    {isNoSubmissionsToGrade && <p className="text-gray-700 text-base">
                      There are currently no more submissions to grade.
                    </p>}


                  </div>
                  <div className="px-6 py-4 bg-gray-100 flex justify-end">
                    <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      onClick={(_) => {
                        setIsIncompleteGrade(false);
                        setIsNoSubmissionsToGrade(false)
                      }}>
                      Ok
                    </button>
                  </div>
                </div>
              </div>
            </div>}
          <NavBar courseName={courseData?.name} courseId={course_id} assignmentName={asgnData?.name} assignmentId={asgn_id} />
          <header>
            <div className="w-4/5 mx-auto">
              <nav className="rounded-md w-1/5 bg-light-grey">
              </nav>
              <h2 className="white-blue-gradient rounded-lg text-5xl font-bold text-left p-14 text-white">
                {asgnData?.name ?? 'Unnamed assignment'}
              </h2>
            </div>
          </header>
          <div className="w-4/5 mx-auto bg-white shadow-lg rounded-lg p-8 mt-12 mb-12">

            {asgnData && (
              <Description asgnData={asgnData} />
            )}
            <PhaseProgressBar asgn_id={asgn_id} />
            {asgnData && (
              <div>
                {(() => {
                  switch (phase) {
                    case Phase.early:
                      return <div>This assignment opens for submission {format(asgnData.start_date_submission, 'MMMM d, yyyy h:mm a')}.</div>;
                    case Phase.submit:
                      return (
                        <div className="flex flex-col items-center space-y-4">
                          <MySubmission asgn_id={asgn_id} setSubmission={setSubmission} submission={submission} />
                          <div className="w-full items-center">
                            <UploadButton asgn_id={asgn_id} setSubmission={setSubmission} submission={submission} />
                          </div>
                        </div>
                      );
                    case Phase.grading:
                      return (
                        <div className="flex space-x-4">
                          <div className="w-full">
                            <MySubmission asgn_id={asgn_id} setSubmission={setSubmission} submission={submission} />
                          </div>
                          <div className="w-full flex flex-col space-y-4">
                            <ListGraded course_id={course_id} asgn_id={asgn_id} phase={phase} />
                            <div className="flex justify-center w-full">
                              <GetNextToGrade course_id={course_id} asgn_id={asgn_id} setIsIncompleteGrade={setIsIncompleteGrade} setIsNoSubmissionsToGrade={setIsNoSubmissionsToGrade}/>
                            </div>
                          </div>
                        </div>
                      );
                    case Phase.closed:
                      return (
                        <div className="flex space-x-4">
                          <div className="w-full">
                            <MySubmission asgn_id={asgn_id} setSubmission={setSubmission} submission={submission} />
                          </div>
                          <div className="w-full flex flex-col space-y-4">
                            <ListGraded course_id={course_id} asgn_id={asgn_id} phase={phase} />
                            <ListGrades course_id={course_id} asgn_id={asgn_id} file_id={submission?.file_id} max_score={asgnData.max_score} />
                          </div>
                        </div>
                      );
                  }
                })()}
              </div>
            )}
          </div>
        </main>
        <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
          <p>&copy;2024 PeerGrader</p>
        </footer>
      </div>
  );
}
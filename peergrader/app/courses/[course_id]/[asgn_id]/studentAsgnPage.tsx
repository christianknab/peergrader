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
                <li><Link href={`/courses/${course_id}`} className="text-black hover:text-blue-800">Back to course page</Link></li>
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
              <h2 className="text-xl font-semibold">Assignment: {asgnData.name} -- Phase: {phase}</h2>
            </div>
          )}
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
                          <UploadButton asgn_id={asgn_id} />
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
                            <GetNextToGrade course_id={course_id} asgn_id={asgn_id} />
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
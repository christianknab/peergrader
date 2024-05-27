import { LoadingSpinner } from '@/components/loadingSpinner';
import useAsgnDataQuery from '@/utils/hooks/QueryAsgnData';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface PhaseProgressBarProps {
  asgn_id: string;
}

export default function PhaseProgressBar({ asgn_id, }: PhaseProgressBarProps) {
  const {
    data: asgnData,
    isLoading: asgnDataLoading,
    isError: asgnDataError
  } = useAsgnDataQuery(asgn_id);
  if (asgnDataLoading) { return (<LoadingSpinner />); }
  if (asgnDataError) { return <div>Error</div>; }

  const submissionLables = ['Start submission', 'Submission due'];
  const gradingLables = ['Start grading', 'Grading due'];
  const [submissionProgress, setsubmissionProgress] = useState<number>(0);
  const [gradingProgress, setgradingProgress] = useState<number>(0);

  useEffect(() => {
    updateProgressBars();
  }, []);

  const updateProgressBars = () => {
    const currentDate = new Date();

    const submissionStartDate = new Date(asgnData?.start_date_submission);
    const submissionEndDate = new Date(asgnData?.end_date_submission);
    const submissionTotalDays = (submissionEndDate.getTime() - submissionStartDate.getTime()) / (1000 * 60 * 60 * 24);
    const submissionElapsedDays = (currentDate.getTime() - submissionStartDate.getTime()) / (1000 * 60 * 60 * 24);
    const submissionProgress = (submissionElapsedDays / submissionTotalDays) * 100;

    const gradingStartDate = new Date(asgnData?.start_date_grading);
    const gradingEndDate = new Date(asgnData?.end_date_grading);
    const gradingTotalDays = (gradingEndDate.getTime() - gradingStartDate.getTime()) / (1000 * 60 * 60 * 24);
    const gradingElapsedDays = (currentDate.getTime() - gradingStartDate.getTime()) / (1000 * 60 * 60 * 24);
    const gradingProgress = (gradingElapsedDays / gradingTotalDays) * 100;

    setsubmissionProgress(submissionProgress);
    setgradingProgress(gradingProgress);
  };

  return (
    <div className="w-full flex">
      <div className="w-1/2 mr-4 mb-2">
        <div className="flex justify-between mb-2 text-sm">
          {submissionLables.map((label) => (
            <span key={label} className="font-medium">
              {label}
            </span>
          ))}
        </div>

        <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
          <div
            className="absolute top-0 left-0 h-3 bg-green-500 rounded"
            style={{ width: `${submissionProgress}%` }}
          ></div>
        </div>

        <div className="flex justify-between mt-1 text-xs">
          <span className="font-medium">
            {format(asgnData?.start_date_submission, 'MMMM d \'at\' h:mm a')}
          </span>
          <span className="font-medium">
            {format(asgnData?.end_date_submission, 'MMMM d \'at\' h:mm a')}
          </span>
        </div>
      </div>
      <div className="w-1/2">
        <div className="flex justify-between mb-2 text-sm">
          {gradingLables.map((label) => (
            <span key={label} className="font-medium">
              {label}
            </span>
          ))}
        </div>

        <div className="relative w-full h-3 bg-gray-200 rounded overflow-hidden">
          <div
            className="absolute top-0 left-0 h-3 bg-blue-500 rounded"
            style={{ width: `${gradingProgress}%` }}
          ></div>
        </div>

        <div className="flex justify-between mt-1 text-xs">
          <span className="font-medium">
            {format(asgnData?.start_date_grading, 'MMMM d \'at\' h:mm a')}
          </span>
          <span className="font-medium">
            {format(asgnData?.end_date_grading, 'MMMM d \'at\' h:mm a')}
          </span>
        </div>
      </div>
    </div>
  );
}
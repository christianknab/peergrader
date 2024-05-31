"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import useAsgnDataQuery from '@/utils/hooks/QueryAsgnData';
import { LoadingSpinner } from '@/components/loadingSpinner';

interface SubmissionData {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  file_id: string | null;
  grades_given: number;
  grades_received: number;
  avg_grade: number | null;
  grading_score: number | null;
  final_score: number | null;
}

interface ListSubmissionsProps {
  course_id: string;
  asgn_id: string;
}

export default function ListSubmissions({ course_id, asgn_id }: ListSubmissionsProps) {
  const supabase = createClient();
  const {
    data: asgnData,
    isLoading: asgnDataLoading,
    isError: asgnDataError
  } = useAsgnDataQuery(asgn_id);
  if (asgnDataLoading) { return (<LoadingSpinner />); }
  if (asgnDataError) { return <div>Error</div>; }

  const [submissions, setSubmissions] = useState<SubmissionData[]>([]);
  const [submissionProgress, setSubmissionProgress] = useState<number>(0);
  const [submitted, setSubmitted] = useState<number>(0);
  const [gradingProgress, setGradingProgress] = useState<number>(0);
  const [graded, setGraded] = useState<number>(0);
  const [gradesNeeded, setGradesNeeded] = useState<number>(0);

  const [avgGradesGiven, setAvgGradesGiven] = useState<number>(0);
  const [avgGradingScore, setAvgGradingScore] = useState<number>(0);
  const [avgGradesReceived, setAvgGradesReceived] = useState<number>(0);
  const [avgAverageGrade, setAvgAverageGrade] = useState<number>(0);
  const [avgFinalScore, setAvgFinalScore] = useState<number>(0);

  useEffect(() => {
    fetchSubmissions(course_id, asgn_id).then(setSubmissions);
  }, [asgn_id]);

  useEffect(() => {
    if (submissions.length > 0) {
      const submitted = submissions.filter(submission => submission.file_id).length;
      setSubmitted(submitted);
      setSubmissionProgress(submitted / submissions.length);

      const totalGradesToBeCompleted = submissions.length * asgnData?.num_peergrades;
      const totalGradesCompleted = submissions.reduce((sum, submission) => {
        return sum + submission.grades_given;
      }, 0);
      setGraded(totalGradesCompleted);
      setGradesNeeded(totalGradesToBeCompleted);
      setGradingProgress(totalGradesCompleted / totalGradesToBeCompleted);

      const avgGradesGivenValue = submissions.reduce((sum, submission) => sum + submission.grades_given, 0) / submissions.length;
      setAvgGradesGiven(avgGradesGivenValue);

      const avgGradingScoreValue = submissions.reduce((sum, submission) => sum + (submission.grading_score || 0), 0) / submissions.length;
      setAvgGradingScore(avgGradingScoreValue);

      const avgGradesReceivedValue = submissions.reduce((sum, submission) => sum + submission.grades_received, 0) / submissions.length;
      setAvgGradesReceived(avgGradesReceivedValue);

      const avgAverageGradeValue = submissions.reduce((sum, submission) => sum + (submission.avg_grade || 0), 0) / submissions.length;
      setAvgAverageGrade(avgAverageGradeValue);

      const avgFinalScoreValue = submissions.reduce((sum, submission) => sum + (submission.final_score || 0), 0) / submissions.length;
      setAvgFinalScore(avgFinalScoreValue);
    }
  }, [submissions]);


  async function fetchSubmissions(course_id: string, asgn_id: string): Promise<SubmissionData[]> {
    const { data: submissionsData, error: submissionsError } = await supabase.rpc('get_submissions', {
      course_id_param: course_id,
      asgn_id_param: asgn_id,
    });

    if (submissionsError) {
      console.error('Error fetching submissions:', submissionsError);
      return [];
    }

    let mergedData: SubmissionData[] = submissionsData;

    mergedData = await Promise.all(
      submissionsData.map(async (submission: SubmissionData) => {
        const { data: averageGrade, error: averageGradeError } = await supabase.rpc('calculate_average_grade', {
          file_id_param: submission.file_id,
        });

        if (averageGradeError) {
          console.error('Error calculating average grade:', averageGradeError);
          return submission;
        }

        const { data: gradingScore, error: gradingScoreError } = await supabase.rpc('calculate_grading_score', {
          user_id_param: submission.uid,
          asgn_id_param: asgn_id,
        });

        if (gradingScoreError) {
          console.error('Error calculating grading score:', gradingScoreError);
          return submission;
        }

        const { data: finalScore, error: finalScoreError } = await supabase.rpc('calculate_final_score', {
          user_id_param: submission.uid,
          asgn_id_param: asgn_id,
        });

        if (finalScoreError) {
          console.error('Error calculating final score:', finalScoreError);
          return submission;
        }

        return { ...submission, avg_grade: averageGrade, grading_score: gradingScore, final_score: finalScore };
      })
    );

    return mergedData;
  }

  return (
    <div>
      <div className="w-full flex mb-6">
        <div className="w-1/2 mr-4">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">{submitted}/{submissions.length} submissions</span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className="absolute top-0 left-0 h-3 bg-blue-500 rounded"
              style={{ width: `${submissionProgress * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex justify-between mb-2 text-sm">
            <span className="font-medium">{graded}/{gradesNeeded} grades</span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded overflow-hidden">
            <div
              className="absolute top-0 left-0 h-3 bg-blue-500 rounded"
              style={{ width: `${gradingProgress * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grades given/{asgnData?.num_peergrades}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grading Score/100</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grades received</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Average Grade/{asgnData?.max_score}</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Final Score/{asgnData?.max_score}</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          <tr className="bg-gray-100">
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Average</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{avgGradesGiven.toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{avgGradingScore.toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{avgGradesReceived.toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{avgAverageGrade.toFixed(2)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{avgFinalScore.toFixed(2)}</td>
          </tr>
          {submissions.sort((a, b) => a.last_name.localeCompare(b.last_name)).map((submission) => (
            <tr key={submission.uid} className="hover:bg-gray-100">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{`${submission.first_name} ${submission.last_name}`}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.file_id ? 'Submitted' : '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.grades_given}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.grading_score ?? '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.grades_received}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.avg_grade ?? '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.final_score ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
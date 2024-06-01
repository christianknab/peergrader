import { LoadingSpinner } from '@/components/loadingSpinner';
import useAsgnDataQuery from '@/utils/hooks/QueryAsgnData';
import { format } from 'date-fns';

interface ListPhaseProgressBarProps {
    asgn_id: string;
    submissionProgress: number;
    gradingProgress: number;
}

export default function ListPhaseProgressBar({ asgn_id, submissionProgress, gradingProgress }: ListPhaseProgressBarProps) {
    const {
        data: asgnData,
        isLoading: asgnDataLoading,
        isError: asgnDataError
    } = useAsgnDataQuery(asgn_id);
    if (asgnDataLoading) { return (<LoadingSpinner />); }
    if (asgnDataError) { return <div>Error</div>; }


    return (
        <div className="w-full flex">
            <div className="w-1/2 mr-2">

                <div className="relative w-full h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-3 bg-green-500 rounded"
                        style={{ width: `${submissionProgress}%` }}
                    ></div>
                </div>

                <div className="flex justify-between mt-1 text-xs">
                    <span className="write-grey">
                        {format(asgnData?.start_date_submission, 'MMMM d \'at\' h:mm a')}
                    </span>
                    <span className="write-grey">
                        {format(asgnData?.end_date_submission, 'MMMM d \'at\' h:mm a')}
                    </span>
                </div>
            </div>
            <div className="w-1/2">

                <div className="relative w-full h-2 bg-gray-200 rounded overflow-hidden">
                    <div
                        className="absolute top-0 left-0 h-3 bg-green-500 rounded"
                        style={{ width: `${gradingProgress}%` }}
                    ></div>
                </div>

                <div className="flex justify-between mt-1 text-xs">
                    <span className="write-grey">
                        {format(asgnData?.start_date_grading, 'MMMM d \'at\' h:mm a')}
                    </span>
                    <span className="write-grey">
                        {format(asgnData?.end_date_grading, 'MMMM d \'at\' h:mm a')}
                    </span>
                </div>
            </div>
        </div>
    );
}
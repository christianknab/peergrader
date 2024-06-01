import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InputFieldForm from '@/components/InputFieldForm';
import JoinShareButton from '@/components/JoinShareButton';
import ExportGrades from './ExportGrades';
import useCourseMutation from '@/utils/hooks/MutateCourseData';

export default function TeacherCourseSettings({ courseId, courseData }: {
    courseData: {
        name: any;
        number: any;
        owner: any;
        join_code: any;
        start_date: any;
        end_date: any;
    } | null | undefined;
    courseId: string;
}) {
    const [formEdited, setFormEdited] = useState(false);
    const courseMutation = useCourseMutation();
    const [dateError, setDateError] = useState('');
    const [startDate, setStartDate] = useState(courseData?.start_date || '');
    const [endDate, setEndDate] = useState(courseData?.end_date || '');

    function validDates(): boolean {
        if (startDate > endDate) {
            setDateError('Course must start before it ends.');
            return false;
        } else {
            setDateError('');
            return true;
        }
    }

    const handleStartDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormEdited(true);
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormEdited(true);
        setEndDate(event.target.value);
    };

    useEffect(() => {
        validDates();
    }, [startDate, endDate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get('name') as string;
        const number = formData.get('number') as string;

        if (!validDates()) {
            return false;
        }

        await courseMutation.mutateAsync({
            courseId,
            name,
            number,
            start_date: startDate,
            end_date: endDate,
        });
        setFormEdited(false);
    };

    return (
        <div className="flex flex-col rounded-lg overflow-hidden w-full">
            <form onSubmit={handleSubmit} className="">
                <label className="block text-gray-700 font-bold mb-2">Basic Settings</label>
                <div className="px-4">
                    <div className="flex space-x-4">
                        <InputFieldForm
                            format="mb-4 flex-1"
                            label="Course Name"
                            value={courseData?.name}
                            name="name"
                            type="text"
                            onChange={() => setFormEdited(true)}
                            isRequired={true}
                        />
                        <InputFieldForm
                            format="mb-4 flex-1"
                            label="Course Number"
                            value={courseData?.number}
                            name="number"
                            type="text"
                            onChange={() => setFormEdited(true)}
                            isRequired={false}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <InputFieldForm
                            format="mb-4 flex-1"
                            label="Start Date"
                            value={startDate}
                            name="start_date"
                            type="date"
                            onChange={handleStartDateChange}
                            isRequired={true}
                        />
                        <InputFieldForm
                            format="mb-4 flex-1"
                            label="End Date"
                            value={endDate}
                            name="end_date"
                            type="date"
                            onChange={handleEndDateChange}
                            isRequired={true}
                        />
                    </div>
                </div>
                <label className="block text-gray-700 font-bold mb-2">Student Settings</label>

                <JoinShareButton joinCode={courseData?.join_code} />
                <div className="text-red-500">{dateError}</div>
                <div>
                    {formEdited ? (
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Save
                        </button>
                    ) : (
                        <div className="py-5"></div>
                    )}
                </div>
            </form>
            <ExportGrades />
        </div>
    );
}

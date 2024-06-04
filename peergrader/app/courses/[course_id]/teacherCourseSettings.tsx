import { useEffect, useState } from 'react';
import InputFieldForm from '@/components/InputFieldForm';
import ExportGrades from './ExportGrades';
import useCourseMutation from '@/utils/hooks/MutateCourseData';
import CopyIcon from '@/components/icons/Copy';

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
    const [copySuccess, setCopySuccess] = useState('');
    const joinCode = courseData?.join_code;
    const joinLink = `peergrader.vercel.app/courses?code=${joinCode}`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(
            () => setCopySuccess('Copied!'),
            () => setCopySuccess('Failed to copy!')
        );
        setTimeout(() => setCopySuccess(''), 2000);
    };

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
        <div className="flex flex-col w-full gap-6 h-full">
            <div className="flex flex-col rounded-lg overflow-hidden flex-grow">
                <div className="white-blue-gradient p-5">
                    <p className="text-xl text-left text-white font-semibold">Settings</p>
                </div>
                <div className="light-grey flex-grow p-3">

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
                        <div className='px-4 pb-2'>
                            <button
                                type="submit"
                                className={`${formEdited ? 'bg-blue-500' : 'bg-gray-400'} ${formEdited ? 'hover:bg-blue-700' : ''} text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                                disabled={!formEdited}
                            >
                                Save
                            </button>
                        </div>
                    </form>
                    <label className="block text-gray-700 font-bold mb-2">Student Settings</label>
                    <div className="px-4">
                        <div className="flex">
                            {/* TODO: need better way to align things */}
                            <div className="flex space-x-2 flex-shrink-0">
                                <InputFieldForm
                                    format="mb-4 flex-1"
                                    label="Join Link"
                                    value={`peergrader.vercel.app/courses?code=${joinCode}`}
                                    name="name"
                                    type="text"
                                    isRequired={true}
                                    disabled={true}
                                />
                                <button className='pt-3' onClick={() => copyToClipboard(joinLink)}>
                                    <CopyIcon />
                                </button>
                            </div>
                            <div className="flex px-4 space-x-2">
                                <InputFieldForm
                                    format="mb-4 flex-1"
                                    label="Join Code"
                                    value={joinCode}
                                    name="name"
                                    type="text"
                                    isRequired={true}
                                    disabled={true}
                                />
                                <button className='pt-3' onClick={() => copyToClipboard(joinCode)}>
                                    <CopyIcon />
                                </button>
                                <div className='pt-9'>{copySuccess && (
                                    <span className="text-blue-500">{copySuccess}</span>
                                )}</div>
                            </div>
                        </div>
                    </div>
                    <label className="block text-gray-700 font-bold mb-2">Grading</label>
                    <div className='px-2 w-1/4'><ExportGrades /></div>
                    <div className="text-red-500">{dateError}</div>

                </div>
            </div>
        </div>
    );
}

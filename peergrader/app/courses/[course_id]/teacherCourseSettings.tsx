"use client";

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const number = formData.get("number") as string;
        const startDate = formData.get("start_date") as string;
        const endDate = formData.get("end_date") as string;
        
        // VALIDATE DATES!
        await courseMutation.mutateAsync({
            courseId: courseId,
            name: name,
            number: number,
            start_date: startDate,
            end_date: endDate,
        });

        setFormEdited(false);
    };

    return (
        // <div>
        //     <div className="flex flex-col rounded-lg overflow-hidden">
        //         <div className="light-blue p-5">
        //             <p className="text-xl text-left font-semibold">Join Link</p>
        //         </div>
        //         <div className="light-grey flex-grow p-6">
        //             http://localhost:3000/courses?code={courseData?.join_code} {/* TODO: change this domain and make copyable */}
        //         </div>
        //     </div>
        // </div>
        <div className="flex flex-col rounded-lg overflow-hidden w-full">
            <form onSubmit={handleSubmit} className="">
                <label className="block text-gray-700 font-bold mb-2">
                    Basic Settings
                </label>
                <div className='px-4'><div className='flex space-x-4'>
                    <InputFieldForm format={'mb-4 flex-1'} label={'Course Name'} value={courseData?.name} name={'name'} type={'text'} onChange={setFormEdited} isRequired={true} />
                    <InputFieldForm format={'mb-4 flex-1'} label={'Course Number'} value={courseData?.number} name={'number'} type={'text'} onChange={setFormEdited} isRequired={false} />
                </div>
                    <div className='flex space-x-4'>
                        <InputFieldForm format={'mb-4 flex-1'} label={'Start Date'} value={courseData?.start_date} name={'start_date'} type={'date'} onChange={setFormEdited} isRequired={true} />
                        <InputFieldForm format={'mb-4 flex-1'} label={'End Date'} value={courseData?.end_date} name={'end_date'} type={'date'} onChange={setFormEdited} isRequired={true} />
                    </div>
                </div>
                <label className="block text-gray-700 font-bold mb-2">
                    Student Settings
                </label>

                <JoinShareButton joinCode={courseData?.join_code} />
                <div>
                    {formEdited ? (
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
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

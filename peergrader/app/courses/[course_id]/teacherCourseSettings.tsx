"use client";

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InputFieldForm from '@/components/InputFieldForm';
import JoinShareButton from '@/components/JoinShareButton';
import ExportGrades from './ExportGrades';

export default function TeacherCourseSettings({ courseData }: {
    courseData: {
        name: any;
        number: any;
        owner: any;
        join_code: any;
        start_date: any;
        end_date: any;
    } | null | undefined
}) {
    const [formEdited, setFormEdited] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // const formData = new FormData(e.currentTarget);
        // const firstName = formData.get("firstName") as string;
        // const lastName = formData.get("lastName") as string;
        // const accountType = formData.get("account_type") as "student" | "teacher";

        // await currentUserMutation.mutateAsync({
        //     uid: currentUser?.uid,
        //     email: currentUser?.email,
        //     first_name: firstName,
        //     last_name: lastName,
        //     is_teacher: accountType === "teacher",
        //     profile_image: profileImageUrl,
        // });
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
            <form onSubmit={handleSubmit} className="p-6">
                <div className='flex space-x-4'>
                    <InputFieldForm format={'mb-4 flex-1'} label={'Course Name'} value={courseData?.name} name={'name'} type={'text'} onChange={setFormEdited} isRequired={true} />
                    <InputFieldForm format={'mb-4 flex-1'} label={'Course Number'} value={courseData?.number} name={'number'} type={'text'} onChange={setFormEdited} isRequired={false} />
                </div>
                <div className='flex space-x-4'>
                    <InputFieldForm format={'mb-4 flex-1'} label={'Start Date'} value={courseData?.start_date} name={'start_date'} type={'date'} onChange={setFormEdited} isRequired={true} />
                    <InputFieldForm format={'mb-4 flex-1'} label={'End Date'} value={courseData?.end_date} name={'end_date'} type={'date'} onChange={setFormEdited} isRequired={true} />
                </div>
                <JoinShareButton joinCode={courseData?.join_code} />
                <div>
                    {/* <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Save
                    </button> */}
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
            <ExportGrades/>
        </div>

    );
}

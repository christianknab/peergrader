"use client";
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { useRouter } from 'next/navigation';

interface CreateCourseProps {
    showModal: boolean;
    onClose: () => void;
    refreshCourses: () => void;
}

const CreateCourse: React.FC<CreateCourseProps> = ({ showModal, onClose, refreshCourses }) => {
    const [courseName, setCourseName] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();
    const { data: currentUser } = useCurrentUserQuery();

    const createCourse = async () => {
        try {
            setIsLoading(true);
            var bcrypt = require('bcryptjs');
            let course_id: string = await bcrypt.hash(`${new Date().toISOString()}${courseName}${currentUser?.uid}`, 5);
            course_id = course_id.replace(/[^a-zA-Z0-9]/g, 'd');

            const { error } = await supabase.from('courses').insert([
                { course_id: course_id, name: courseName, owner: currentUser?.uid, number: courseNumber },
            ]);

            if (error) {
                console.error('Error creating course:', error);
            } else {
                setCourseName('');
                setCourseNumber('');
                // refreshCourses();
                router.push(`/courses/${course_id}`)
                // onClose();
            }
        } catch (error) {
            console.error('Error creating course:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="white-blue-gradient rounded-lg p-4 relative w-3/7">
                <button className="absolute top-0 right-0 m-2 font-bold text-gray-700" onClick={onClose}>x</button>
                <div className="white-blue-gradient flex flex-col space-y-4 p-5 rounded-lg overflow-hidden">
                    <table className='border-separate border-spacing-y-3'>
                        <tbody><tr className='pb-4'>
                            <td className='pr-3'>
                                <label htmlFor="courseNumber" className="font-semibold">Course Number:</label>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    placeholder="eg. CSE 115"
                                    value={courseNumber}
                                    onChange={(e) => setCourseNumber(e.target.value)}
                                    className="py-2 px-4 rounded-md light-grey shadow-lg"
                                />
                            </td>
                        </tr>
                            <tr className='pb-4'>
                                <td>
                                    <label htmlFor="courseName" className="font-semibold">Course Name:</label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="eg. Software Engineering"
                                        value={courseName}
                                        onChange={(e) => setCourseName(e.target.value)}
                                        className="py-2 px-4 rounded-md light-grey shadow-lg"
                                    />
                                </td>
                            </tr></tbody>

                    </table>
                    <button
                        className="py-2 px-4 rounded-md font-semibold no-underline bg-btn-background hover:bg-btn-background-hover"
                        onClick={createCourse}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Loading...' : 'Create Course'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateCourse;

"use client";
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface CreateCourseProps {
    showModal: boolean;
    onClose: () => void;
    refreshCourses: () => void;
}

function addMonths(date: string | number | Date, months: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + months * 30);
    return result;
}

const CreateCourse: React.FC<CreateCourseProps> = ({ showModal, onClose, refreshCourses }) => {
    const [courseName, setCourseName] = useState('');
    const [courseNumber, setCourseNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();
    const { data: currentUser } = useCurrentUserQuery();
    const queryClient = useQueryClient();
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(addMonths(new Date(), 3));
    const [dateError, setDateError] = useState('');

    const handleSubmitStartDateChange = (event: { target: { value: string | number | Date; }; }) => {
        setStartDate(new Date(event.target.value));
    };

    const handleSubmitEndDateChange = (event: { target: { value: string | number | Date; }; }) => {
        setEndDate(new Date(event.target.value));
    };

    function validDates(): boolean {
        if (startDate > endDate) {
            setDateError('End date must come after start date');
            return false;
        }
        setDateError('');
        return true;
    }

    useEffect(() => {
        validDates();
    }, [
        startDate,
        endDate,
    ]);

    const createCourse = async () => {
        if (validDates()) {
            try {
                setIsLoading(true);
                var bcrypt = require('bcryptjs');
                let course_id: string = await bcrypt.hash(`${new Date().toISOString()}${courseName}${currentUser?.uid}`, 5);
                course_id = course_id.replace(/[^a-zA-Z0-9]/g, 'd');

                const { error } = await supabase.from('courses').insert([
                    { course_id: course_id, name: courseName, owner: currentUser?.uid, number: courseNumber, start_date: startDate, end_date: endDate },
                ]);

                if (error) {
                    console.error('Error creating course:', error);
                    return false;
                } else {
                    queryClient.invalidateQueries({ queryKey: ['getCourses'] });
                    // refreshCourses();
                    router.push(`/courses/${course_id}?tab=settings`)
                    // onClose();
                }
                return true;
            } catch (error) {
                console.error('Error creating course:', error);
                return false;
            } finally {
                setIsLoading(false);
                return false;
            }
        };
        return false;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createCourse();
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="white-blue-gradient rounded-lg p-4 relative w-3/7">
                <button className="absolute top-0 right-0 m-2 font-bold text-gray-700" onClick={onClose}>x</button>
                <form onSubmit={handleSubmit}>
                    <div className="white-blue-gradient flex flex-col space-y-4 p-5 rounded-lg overflow-hidden">
                        <table className='border-separate border-spacing-y-3 border-spacing-x-3'>
                            <tbody><tr>
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
                                        required
                                    />
                                </td>
                            </tr><tr>
                                    <td>
                                        <label htmlFor="courseNumber" className="font-semibold">Course Number:</label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="eg. CSE 115 (optional)"
                                            value={courseNumber}
                                            onChange={(e) => setCourseNumber(e.target.value)}
                                            className="py-2 px-4 rounded-md light-grey shadow-lg"
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <label htmlFor="startDate" className="font-semibold">Course Start Date:</label>
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 light-grey shadow-lg"
                                            value={startDate ? startDate.toISOString().split('T')[0] : ''}
                                            onChange={handleSubmitStartDateChange}
                                            required
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="endDate" className="font-semibold">Course End Date:</label>
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 light-grey shadow-lg"
                                            value={endDate ? endDate.toISOString().split('T')[0] : ''}
                                            onChange={handleSubmitEndDateChange}
                                            required
                                        />
                                    </td>
                                </tr>

                            </tbody>
                        </table>
                        <div className="text-red-500">{dateError}</div>
                        <button
                            type='submit'
                            className="py-2 px-4 rounded-md font-semibold no-underline bg-btn-background hover:bg-btn-background-hover"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Create Course'}
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default CreateCourse;

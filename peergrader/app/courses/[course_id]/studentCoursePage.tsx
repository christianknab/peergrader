'use client';
import { useParams, useRouter } from 'next/navigation';
import StudentListAsgn from './studentListAsgn';
import useCourseDataQuery from '@/utils/hooks/QueryCourseData';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { LoadingSpinner } from '@/components/loadingSpinner';
import NavBar from '@/components/NavBar';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { addDays, isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import CalendarComponent from '@/components/CalendarComponent';
import RemindersComponent from '@/components/RemindersComponent';

interface AsgnData {
    asgn_id: string;
    name: string;
    course_id: string;
    course_name: string;
    max_score: number;
    final_score: number;
    phase: string;
    start_date_submission: Date;
    end_date_submission: Date;
    start_date_grading: Date;
    end_date_grading: Date;
}

export default function StudentCoursePage() {
    const router = useRouter();
    const course_id = useParams().course_id as string;
    const supabase = createClient();
    const { data: currentUser, isLoading: isUserLoading, isError } = useCurrentUserQuery();
    const [asgns, setUserAssignments] = useState<AsgnData[]>([]);
    const [highlightDates, setHighlightDates] = useState<{ date: Date; type: 'submission' | 'grading' }[]>([]);
    const [reminders, setReminders] = useState<{ type: string; assignment: AsgnData }[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        if (currentUser) {
            fetchUserAssignments(currentUser.uid).then(assignments => {
                const courseAssignments = assignments.filter(asgn => asgn.course_id === course_id);
                setUserAssignments(courseAssignments);
                setHighlightDates(
                    courseAssignments.flatMap(asgn => [
                        { date: new Date(asgn.end_date_submission), type: 'submission' },
                        { date: new Date(asgn.end_date_grading), type: 'grading' }
                    ])
                );
                updateReminders(courseAssignments, new Date());
            });
        }
    }, [currentUser, course_id]);

    async function fetchUserAssignments(userId: string) {
        const { data: accountCourses, error: accountCoursesError } = await supabase
            .from('account_courses')
            .select('course_id')
            .eq('uid', userId);

        if (accountCoursesError) {
            console.error('Error fetching user courses:', accountCoursesError);
            return [];
        }

        const courseIds = accountCourses.map((row) => row.course_id);
        const allAsgns: AsgnData[] = [];

        for (const courseId of courseIds) {
            const { data: courseData, error: courseError } = await supabase
                .from('courses')
                .select('name, number')
                .eq('course_id', courseId)
                .single();

            if (courseError) {
                console.error('Error fetching course:', courseError);
                continue;
            }

            const { data, error } = await supabase.rpc('get_asgns_for_course_student', { course_id_param: courseId, user_id_param: userId });
            if (error) {
                console.error('Error fetching assignments:', error);
                continue;
            }

            const assignmentsWithCourseId = data.map((asgnData: AsgnData) => ({
                ...asgnData,
                course_id: courseId,
                course_name: courseData.name,
            }));

            allAsgns.push(...assignmentsWithCourseId);
        }

        return allAsgns;
    }

    const updateReminders = (assignments: AsgnData[], date: Date) => {
        const upcomingReminders = assignments.flatMap(asgn => [
            isWithinInterval(new Date(asgn.end_date_submission), { start: startOfDay(date), end: endOfDay(addDays(date, 7)) })
                ? { type: 'submission', assignment: asgn }
                : null,
            isWithinInterval(new Date(asgn.end_date_grading), { start: startOfDay(date), end: endOfDay(addDays(date, 7)) })
                ? { type: 'grading', assignment: asgn }
                : null
        ]).filter(reminder => reminder !== null) as { type: string; assignment: AsgnData }[];

        upcomingReminders.sort((a, b) => {
            const dateA = a.type === 'submission' ? new Date(a.assignment.end_date_submission) : new Date(a.assignment.end_date_grading);
            const dateB = b.type === 'submission' ? new Date(b.assignment.end_date_submission) : new Date(b.assignment.end_date_grading);
            return dateA.getTime() - dateB.getTime();
        });

        setReminders(upcomingReminders);
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        updateReminders(asgns, date);
    };

    const {
        data: courseData,
        isLoading: courseDataLoading,
        isError: courseDataError
    } = useCourseDataQuery(course_id);
    if (courseDataLoading) { return <LoadingSpinner />; }
    if (courseDataError) { return <div>Error</div>; }

    return (
        <div className="w-full min-h-screen flex flex-col">
            <main className="flex-1 w-full">
                <NavBar courseName={courseData?.name} courseId={course_id} />
                <header>
                    <div className="w-4/5 mx-auto">
                        <h2 className="white-blue-gradient rounded-lg text-5xl font-bold text-left mb-6 p-14 text-white">
                            {courseData?.name || 'Course Page'}
                        </h2>
                    </div>
                </header>
                <div className="w-4/5 mx-auto">
                    <div className="flex gap-8">
                        <div className="w-1/4">
                            <CalendarComponent
                                highlightDates={highlightDates}
                                handleDateChange={handleDateChange}
                            />
                            <RemindersComponent reminders={reminders} />
                        </div>
                        <div className="flex flex-col w-3/4 gap-6 h-full">
                            <div className="flex flex-col rounded-lg  shadow hover:shadow-lg transition-shadow overflow-hidden flex-grow">
                                <div className="white-blue-gradient p-5">
                                    <p className="text-xl text-left text-white font-semibold">Assignments</p>
                                </div>
                                <StudentListAsgn course_id={course_id} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
                <p>&copy;2024 PeerGrader</p>
            </footer>
        </div>
    );
}

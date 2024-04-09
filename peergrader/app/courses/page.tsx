'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient, supabase } from '@/utils/supabase/client';
import UserCoursesList from '@/components/listCourses';

export default async function CoursesPage() {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    return (
        <div>
            <h1>Courses Page</h1>
            <UserCoursesList user={user!} />

        </div>
    );
}
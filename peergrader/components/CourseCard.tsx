"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ProfileLink from "@/app/dashboard/ProfileLink";
import { createClient } from '@/utils/supabase/client';
import Link from "next/link";

interface CourseData {
    course_id: string;
    name: string;
    assignmentsCount?: number;
    number: string;
}

export default function CourseCard({ courseData }: { courseData: CourseData }) {
    return (<div className="rounded-lg overflow-hidden shadow-lg border">
        <Link href={`/courses/${courseData.course_id}`} className="block">
            <div className="p-4">
                <div className="text-lg font-bold truncate">{(courseData.number == null || courseData.number == '') ? courseData.name : courseData.number}</div>
                <hr className="my-1 border-t-2"></hr>
                <div className="text-md text-gray-600 truncate mt-4">{(courseData.number == null || courseData.number == '') ? String.fromCharCode(160) : ((courseData.name != null || courseData.name != '') ? courseData.name : String.fromCharCode(160))}</div>
            </div>
            <div className="white-blue-gradient text-white p-1 text-left">
                <span className="px-3 text-sm font-bold">{courseData.assignmentsCount} assignments</span>
            </div>
        </Link>
    </div>);
}

"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface GradeData {
    grade: string;
    graded_by: string;
    email: string;
}

interface ListGradesProps {
    file_id: string;
}

export default function ListGrades({ file_id }: ListGradesProps) {
    const supabase = createClient();
    const [grades, setGrades] = useState<GradeData[]>([]);

    useEffect(() => {
        fetchGrades(file_id).then(setGrades);
    }, [file_id]);

    async function fetchGrades(file_id: string) {
        const { data: gradesData, error: gradesError } = await supabase
            .from('grades')
            .select('grade, graded_by')
            .eq('file_id', file_id);

        if (gradesError) {
            console.error('Error fetching grades:', gradesError);
            return [];
        }

        const graded_by_ids = gradesData.map((gradeData) => gradeData.graded_by);

        const { data: accountsData, error: accountsError } = await supabase
            .from('accounts')
            .select('uid, email')
            .in('uid', graded_by_ids);

        if (accountsError) {
            console.error('Error fetching accounts:', accountsError);
            return [];
        }

        const emailLookup = new Map(accountsData.map((account) => [account.uid, account.email]));

        const gradesWithEmail: GradeData[] = gradesData.map((gradeData) => ({
            grade: gradeData.grade,
            graded_by: gradeData.graded_by,
            email: emailLookup.get(gradeData.graded_by),
        }));

        return gradesWithEmail;
    }

    return (
        <div>
            <h3 className="font-bold text-lg">Peer grades:</h3>
            <ul>
                {grades.map((gradeData) => (
                    <li key={gradeData.graded_by}>
                        {gradeData.email} : {gradeData.grade}
                    </li>
                ))}
            </ul>
        </div>
    );
}
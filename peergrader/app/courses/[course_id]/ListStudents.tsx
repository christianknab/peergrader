"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AccountData {
  email: string;
}

export default function ListStudents({ course_id }: { course_id: string }) {
  const supabase = createClient();
  const [accounts, setAccounts] = useState<AccountData[]>([]);

  useEffect(() => {
    fetchAccounts(course_id).then(setAccounts);
  }, [course_id]);

  async function fetchAccounts(course_id: string) {
    const { data: accountCourses, error: accountCoursesError } = await supabase
      .from('account_courses')
      .select('uid')
      .eq('course_id', course_id);

    if (accountCoursesError) {
      console.error('Error fetching account courses:', accountCoursesError);
      return [];
    }

    const uids = accountCourses?.map((ac) => ac.uid) || [];

    const { data: accounts, error: accountsError } = await supabase
      .from('accounts')
      .select('email')
      .in('uid', uids);

    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
      return [];
    }

    return accounts || [];
  }

  return (
    <div>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>{account.email}</li>
        ))}
      </ul>
    </div>
  );
}
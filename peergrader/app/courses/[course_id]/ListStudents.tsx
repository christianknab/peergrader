"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface AccountData {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
}

export default function ListStudents({ course_id }: { course_id: string }) {
  const supabase = createClient();
  const [accounts, setAccounts] = useState<AccountData[]>([]);

  useEffect(() => {
    fetchStudents(course_id).then(setAccounts);
  }, [course_id]);

  async function fetchStudents(course_id: string) {
    const { data, error } = await supabase.rpc('get_students_in_course', { course_id_param: course_id });
    if (error) {
      console.error('Error fetching students:', error);
      return;
    }
    return data;
  }

  return (
    <div>
      <ul>
        {accounts.map((account, index) => (
          <li key={index}>{account.first_name} {account.last_name} - {account.email}</li>
        ))}
      </ul>
    </div>
  );
}
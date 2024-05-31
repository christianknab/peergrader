"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ProfileImage from '@/components/ProfileImage';
import StudentGrades from './StudentGrades';

interface AccountData {
  uid: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image: string | null;
}

export default function ListStudents({ course_id }: { course_id: string }) {
  const supabase = createClient();
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [uid, setUid] = useState('');

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
    <div className="flex flex-col w-full gap-6 h-full">
      <div className="flex flex-col rounded-lg overflow-hidden flex-grow">
        <div className="light-blue p-5">
          <p className="text-xl text-left font-semibold">Students</p>
        </div>
        <div className="light-grey flex-grow p-3">
          <div>
            <ul>
              {accounts.sort((a, b) => a.last_name.localeCompare(b.last_name)).map((account, index) => (
                <li key={index} className="flex items-center rounded px-2 py-2">
                  <ProfileImage src={account.profile_image} width={30} height={30} />
                  <button
                    className="pl-2 text-sm write-grey hover:text-blue-500"
                    onClick={() => { setUid(account.uid); setShowModal(true); }}
                  >
                    {account.first_name} {account.last_name} - {account.email}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <StudentGrades
        showModal={showModal}
        onClose={() => setShowModal(false)}
        uid={uid}
        course_id={course_id}
      />
    </div>
  );
}
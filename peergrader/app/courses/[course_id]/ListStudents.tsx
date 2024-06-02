"use client";
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import ProfileImage from '@/components/ProfileImage';
import StudentGrades from './StudentGrades';
import RemoveStudent from './RemoveStudent';
import DeleteIcon from '@/components/icons/Delete';

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
  const [showGrades, setShowGrades] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [uid, setUid] = useState('');
  const [accountData, setAccountData] = useState<AccountData>();

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
        <div className="white-blue-gradient p-5">
          <p className="text-xl text-left text-white font-semibold">Students</p>
        </div>
        <div className="light-grey flex-grow p-3">

          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-400">
                <th className="px-6 py-3 text-left text-xs font-medium write-grey uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium write-grey uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-right text-xs font-medium write-grey uppercase tracking-wider">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300">
              {accounts.sort((a, b) => a.last_name.localeCompare(b.last_name)).map((account) => (
                <tr key={account.uid} className="hover:bg-gray-100">
                  <td>
                    <div className="flex items-center pl-6">
                      <ProfileImage src={account.profile_image} width={30} height={30} />
                      <button
                        className="pl-2 text-sm write-grey font-medium underline hover:text-blue-500 hover:no-underline"
                        onClick={() => { setUid(account.uid); setShowGrades(true); }}
                      >
                        {account.first_name} {account.last_name}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm write-grey">{`${account.email}`}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => { setAccountData(account); setShowRemove(true); }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      </div>
      <StudentGrades
        showGrades={showGrades}
        onClose={() => setShowGrades(false)}
        uid={uid}
        course_id={course_id}
      />
      <RemoveStudent
        showRemove={showRemove}
        onClose={() => setShowRemove(false)}
        course_id={course_id}
        accountData={accountData}
        onStudentRemoved={() => fetchStudents(course_id).then(setAccounts)}
      />
    </div>
  );
}
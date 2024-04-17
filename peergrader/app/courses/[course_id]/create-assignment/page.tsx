'use client';
import { useUser } from '@/utils/providers/UserDataProvider';
import { createClient } from '@/utils/supabase/client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Rubric {
    names: string[]; // Array of strings representing the names of the rubric categories
    descriptions: string[]; // Array of objects, each containing a descriptions property which is an array of strings
}


export default function CreateAssignmentPage() {
    const supabase = createClient();
    const userContext = useUser();
    const router = useRouter()
    const { course_id } = useParams();
    const [assignmentName, setCourseName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [rubric, setRubric] = useState<Rubric[]>([]);


    useEffect(() => {
        const fetchRubric = async () => {
            try {
                const { data, error } = await supabase.rpc('get_rubric');
                if (error) {
                    throw new Error('Error fetching rubric');
                }
                console.log(data);


                setRubric(data);
            } catch (error) {
                console.error('Error fetching rubric:', error);
            }
        };

        fetchRubric();
    }, []);




    const createAssignment = async () => {
        if (userContext?.currentUser) {
            try {
                setIsLoading(true);
                const { data, error } = await supabase.from('assignments').insert([
                    { name: assignmentName, owner: userContext?.currentUser.uid, course_id: course_id },
                ]);

                if (error) {
                    console.error('Error creating course:', error);
                } else {
                    router.push(`/courses/${course_id}`);
                }
            } catch (error) {
                console.error('Error creating course:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div>
            <h1>Create Assignment Page</h1>
            <div>
                <label htmlFor="assignmentName">Assignment Name:</label>
                <input
                    type="text"
                    id="assignmentName"
                    value={assignmentName}
                    onChange={(e) => setCourseName(e.target.value)}
                />
                {rubric && (
                    <div style={{ fontFamily: 'Arial, sans-serif' }}>
                        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Rubric for Assignment ID:</h2>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Criteria</th>
                                    <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rubric.map((rubricItem, index) => (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold' }}>{rubricItem.names[0]}</td>
                                        <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                            <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                                                {rubricItem.descriptions.map((description, descIndex) => (
                                                    <li key={descIndex}>{description}</li>
                                                ))}
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <button onClick={createAssignment} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Create Assignment'}
                </button>
            </div>
        </div>
    );
}
'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface AsgnData {
  asgn_id: string;
  name: string;
  course_id: string;
}

export default function AsgnPage() {
  const supabase = createClient();
  const { asgn_id } = useParams();
  const [asgnData, setAsgnData] = useState<AsgnData | null>(null);


  useEffect(() => {
    async function fetchAsgnData() {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select('*')
          .eq('asgn_id', asgn_id)
          .single();

        if (error) {
          console.error('Error fetching asgn data:', error);
        } else {
          setAsgnData(data);
        }
      } catch (error) {
        console.error('Error fetching asgn data:', error);
      }
    }

    if (asgn_id) {
      fetchAsgnData();
    }
  }, [asgn_id]);

  return (
    <div>
      <h1>Asignment Page</h1>
      {asgnData && (
        <p>Asgn Name: {asgnData.name}</p>
      )}
    </div>
  );
}
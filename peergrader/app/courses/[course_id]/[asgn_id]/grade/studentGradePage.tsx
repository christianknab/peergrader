'use client';

import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import { Document, Page } from 'react-pdf';
import { pdfjs } from "react-pdf";
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export default function StudentGradePage() {
  const {
    data: currentUser,
    isLoading,
    isError
  } = useCurrentUserQuery();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  // const supabase = createClient();
  // const searchParams = useSearchParams();
  // const owner = searchParams.get('owner');
  // const file_id = searchParams.get('file_id');
  // const filename = searchParams.get('filename');
  // const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(`${owner}/${file_id}` || '');
  // const [grade, setGrade] = useState('');
  // const [currentGrade, setCurrentGrade] = useState<string | null>(null);
  // const [loading, setLoading] = useState(false);



  const [numPages, setNumPages] = useState<number>();


  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }
  // function onDocumentLoadError({error}:{error:OnPageLoadError}){
  //     console.log("error", error.message);
  // }

  const onDocumentLoadError = (err: any) => {
    console.log(`Error loading PDF: ${err.message}`);
  };
  const onDocumentClick = (event: React.MouseEvent<HTMLDivElement>, pageIndex:number) => {
    const pdfRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - pdfRect.left;
    const y = event.clientY - pdfRect.x;
    console.log(`Clicked at x: ${x}, y: ${y}`);
  };

  return (
    <div>
      <Document file="https://vrmbrpvpedkdpziqlbzp.supabase.co/storage/v1/object/public/files/d647afcc-fb40-4859-8e7f-562374d652cc/1714072602171" onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError} >
        {Array.from(
          new Array(numPages),
          (_, index) => (
            <div key={`page-container-${index + 1}`} className="mb-4"><Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              onClick={(event:React.MouseEvent<HTMLDivElement>) => onDocumentClick(event, index)}
            /></div>
          ),
        )}
      </Document>
    </div>
  );
}

// useEffect(() => {
//     const fetchCurrentGrade = async () => {
//         try {
//             const { data, error } = await supabase
//                 .from('grades')
//                 .select('grade')
//                 .eq('file_id', file_id)
//                 .eq('graded_by', currentUser?.uid)
//                 .single();

//             if (error) {
//                 console.error('Error fetching current grade:', error);
//             }
//             if (data) {
//                 setCurrentGrade(data.grade);
//                 setGrade(data.grade);
//             } else {
//                 setCurrentGrade(null);
//             }
//         } catch (error) {
//             console.error('Error fetching current grade:', error);
//         }
//     };

//     fetchCurrentGrade();
// }, [file_id]);

// const handleSaveGrade = async () => {
//     if (!currentUser) {
//         alert('You must be logged in');
//         return;
//     }

//     const graded_by = currentUser.uid;
//     setLoading(true);

//     try {
//         // Save the grade
//         const { data, error } = await supabase
//             .from('grades')
//             .upsert({ file_id, grade, graded_by })
//             .single();

//         if (error) {
//             console.error('Error writing to grades table:', error);
//         } else {
//             console.log('Grade saved successfully');
//             setCurrentGrade(grade);
//             setGrade('');

//             // Calculate the average grade for the file_id
//             const { data: gradeData, error: gradeError } = await supabase
//                 .from('grades')
//                 .select('grade')
//                 .eq('file_id', file_id);

//             if (gradeError) {
//                 console.error('Error getting grades:', gradeError);
//             } else {
//                 const averageGrade =
//                     gradeData.reduce((sum, { grade }) => sum + grade, 0) /
//                     gradeData.length;

//                 // Update the 'final_grades' table with the average grade
//                 await supabase
//                     .from('submissions')
//                     .upsert({ file_id, final_grade: averageGrade, num_grades: gradeData.length })
//                     .single();

//                 console.log('Final grade updated successfully');
//             }
//         }
//     } catch (error) {
//         console.error('Error writing to grades table:', error);
//     } finally {
//         setLoading(false);
//     }
// };


// {/* <div style={{ display: 'flex', flexDirection: 'row', height: '100vh' }}>
// <div style={{ width: '70%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//     {filename ? (
//         <div style={{ height: '90vh', width: '70vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
//             <iframe src={publicUrl} style={{ width: '100%', height: '100%', border: 'none', overflow: 'hidden' }}>
//                 This browser does not support PDFs. Please download the PDF to view it:
//                 <a href={publicUrl} target="_blank" rel="noopener noreferrer"> Download PDF </a>
//             </iframe>
//         </div>
//     ) : (
//         <p>Loading file...</p>
//     )}
// </div>
// <div style={{ width: '30%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
//     <div>
//         {currentGrade !== null ? (
//             <p>Current grade: {currentGrade}</p>
//         ) : (
//             <p>No grade yet</p>
//         )}
//         <input type="text" id="gradeInput" value={grade} onChange={(e) => setGrade(e.target.value)} />
//         <button onClick={handleSaveGrade} disabled={loading}>
//             {loading ? 'Saving...' : 'Save Grade'}
//         </button>
//     </div>
// </div>
// </div> */}
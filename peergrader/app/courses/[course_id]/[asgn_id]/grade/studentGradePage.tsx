'use client';
import { useEffect, useRef, useState } from 'react';
import PDFView from './PdfView';
import throttle from 'lodash.throttle';
import Marker from './AnnotationMarker';
import { AnnotationMarkerData } from '@/utils/types/AnnotationMarkerData';

export default function StudentGradePage() {
  const [columnWidth, setColumnWidth] = useState(75);
  const [annotationMarkers, setAnnotationMarkers] = useState<readonly AnnotationMarkerData[]>([{page: 1, x: 500, y:500}]);
  const [PDFWidth, setPDFWidth] = useState<number | undefined>(undefined);
  const pdfContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const setPDFWidthThrottled = throttle(() => {
      const width = pdfContainerRef.current?.offsetWidth;
      setPDFWidth(width || undefined);
    }, 500);

    setPDFWidthThrottled();
    window.addEventListener('resize', setPDFWidthThrottled);

    return () => {
      window.removeEventListener('resize', setPDFWidthThrottled);
    };
  }, []);


  const dragResizeHandler = () => {

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      requestAnimationFrame(() => {
        setColumnWidth((mouseMoveEvent.pageX / document.body.offsetWidth) * 100);
      });
    }
    function onMouseUp() {
      setPDFWidth(pdfContainerRef.current?.offsetWidth);
      document.body.removeEventListener("mousemove", onMouseMove);
     
    }

    document.body.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseup", onMouseUp, { once: true });
  };

  const documentClickHandler = (event: React.MouseEvent<HTMLDivElement>, pageIndex: number):void => {
    const pdfRect = event.currentTarget.getBoundingClientRect();
    //normalize with linear interpolation
    const x = ((event.clientX - pdfRect.left) / (pdfRect.right - pdfRect.left)) * 1000;
    const y = ((event.clientY - pdfRect.top) / (pdfRect.bottom - pdfRect.top)) * 1000;
    console.log(`Page ${pageIndex + 1} Clicked at x: ${x}, y: ${y}`);
  }

  return (
    <div className='flex w-full'>
      <div style={{ width: `${columnWidth}%` }}>
        <div className='overflow-y-auto h-screen' ref={pdfContainerRef}>

          <PDFView fileUrl='https://vrmbrpvpedkdpziqlbzp.supabase.co/storage/v1/object/public/files/699eca23-2746-46e6-b549-437ba53f93ec/Copy%20of%20Homework%202%20CSE120%20Spring%202024.docx.pdf'
            width={PDFWidth} onPageClick={documentClickHandler}
            annotationMarkers={annotationMarkers}/>
        </div>
      </div>
      <button type="button" onMouseDown={dragResizeHandler} className="h-screen w-1 bg-gradient-to-r from-gray-100 via-gray-500 to-gray-100 cursor-col-resize">
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className='overflow-y-auto h-screen'>
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem
          accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
          quae ab illo inventore veritatis et quasi architecto beatae vitae
          dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores
          eos qui ratione voluptatem sequi nesciunt.

        </div>
        
      </div>
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






// const supabase = createClient();
// const searchParams = useSearchParams();
// const owner = searchParams.get('owner');
// const file_id = searchParams.get('file_id');
// const filename = searchParams.get('filename');
// const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(`${owner}/${file_id}` || '');
// const [grade, setGrade] = useState('');
// const [currentGrade, setCurrentGrade] = useState<string | null>(null);
// const [loading, setLoading] = useState(false);
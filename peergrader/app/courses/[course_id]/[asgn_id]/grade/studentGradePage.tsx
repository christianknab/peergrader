'use client';
import React, { useEffect, useRef, useState } from 'react';
import PDFView from './PdfView';
import throttle from 'lodash.throttle';
import { AnnotationMarkerData } from '@/utils/types/AnnotationMarkerData';
import Textarea from 'react-expanding-textarea'
import { supportedColors } from '@/utils/constants';


export default function StudentGradePage() {
  const [columnWidth, setColumnWidth] = useState<number>(70);
  const [annotationMarkers, setAnnotationMarkers] = useState<readonly AnnotationMarkerData[]>([]);
  const [PDFWidth, setPDFWidth] = useState<number | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [addPointSelected, setAddPointSelected] = useState<boolean>(false);

  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const tabs: (readonly string[]) = ["Grade", "Comment"];



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

  const handleAddAnnotationMarker = (value: AnnotationMarkerData) => {
    setAnnotationMarkers((prevStates) => {
      const newStates = [...prevStates];
      newStates.push(value);
      return newStates;
    });
  };

  const commentColorClickHandler = (index: number) => {
    const newStates = [...annotationMarkers];
    if (newStates[index].colorIndex >= supportedColors.length - 1) {
      newStates[index].colorIndex = 0;
    } else {
      newStates[index].colorIndex++;
    }
    setAnnotationMarkers(newStates);
  }


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

  const documentClickHandler = (event: React.MouseEvent<HTMLDivElement>, pageIndex: number): void => {
    if (addPointSelected) {
      setAddPointSelected((val) => !val);
      const pdfRect = event.currentTarget.getBoundingClientRect();
      //normalize with linear interpolation
      const x = ((event.clientX - pdfRect.left) / (pdfRect.right - pdfRect.left)) * 1000;
      const y = ((event.clientY - pdfRect.top) / (pdfRect.bottom - pdfRect.top)) * 1000;
      handleAddAnnotationMarker({ page: pageIndex + 1, x: x, y: y, colorIndex: 0 });
    }
  }

  return (
    <div className='flex w-full'>
      {addPointSelected && <div style={{ position: 'fixed', left: `${columnWidth / 2}%`, transform: 'translate(-50%, 0)', top: 13, zIndex: 50 }}>
        <div className='bg-gray-800 rounded-full py-1 px-4'>
          <span className='text-white'>Click the document to add a point.</span>
        </div>
      </div>}
      <div style={{ width: `${columnWidth}%` }}>
        <div className='overflow-y-auto h-screen' ref={pdfContainerRef}>


          <PDFView fileUrl='https://vrmbrpvpedkdpziqlbzp.supabase.co/storage/v1/object/public/files/699eca23-2746-46e6-b549-437ba53f93ec/Copy%20of%20Homework%202%20CSE120%20Spring%202024.docx.pdf'
            width={PDFWidth} onPageClick={documentClickHandler}
            annotationMarkers={selectedTab == 1 ? annotationMarkers : []}
            pointSelectionEnabled={addPointSelected} />
        </div>
      </div>
      <button type="button" onMouseDown={dragResizeHandler} className="h-screen w-1 bg-gradient-to-r from-gray-100 via-gray-500 to-gray-100 cursor-col-resize">
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className='overflow-y-auto h-screen'>
          {/* Tab Bar */}
          <div className="text-m font-medium text-center text-gray-500 border-b border-gray-300">
            <ul className="flex flex-wrap justify-center -mb-px">
              {tabs.map((value, index) => {
                const unselected = "w-full inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-400 transition-all ease-in-out";
                const selected = "w-full inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active transition-all ease-in-out";
                return (<li className="me-2 w-5/12" key={`tab${index}`}>
                  <button className={selectedTab == index ? selected : unselected} onClick={(_) => {
                    setSelectedTab(index);
                    if (index == 0) {
                      setAddPointSelected(false);
                    }
                  }}>
                    {value}
                  </button>
                </li>);
              })}
            </ul>
          </div>
          {/* Tabs */}
          {selectedTab == 0 ?
            (<div>
              Grade
            </div>)
            :
            (<div>
              <div className='flex w-full p-2 border-b border-gray-300 justify-end'>
                <button className={`flex items-center rounded-md  ${addPointSelected ? "bg-gray-400" : "bg-gray-100"}`} onClick={(_) => setAddPointSelected((val) => !val)}>
                  <span className='text-sm pl-4 pr-2'>Add Comment</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className='w-11 h-11 p-2 fill-gray-500' viewBox="0 0 45.4 45.4"><path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z" /></svg>
                </button>
              </div>
              {annotationMarkers.map((value, index) => {
                return (
                  <div className='flex w-full border-b border-gray-300 items-start' key={`comment${index}`}>
                    {/* Circle */}
                    <div className='w-14 h-14 p-3'>
                      <button className="w-full h-full rounded-full aspect-square" style={{ backgroundColor: supportedColors[value.colorIndex] }} onClick={(_) => commentColorClickHandler(index)}>
                      </button>
                    </div>
                    {/* Text */}
                    <div><Textarea
                      className="w-full pt-2 pr-4 text-gray-900 bg-gray-50 outline-none focus:ring-0 focus:shadow-none resize-none"
                      id="my-textarea"
                      maxLength={2000}
                      placeholder="Add a comment..."
                    />
                      <div className='flex'>
                        <div className='w-6 h-6 pr-1 pb-1'>
                          <button className='w-full h-full'>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" /></svg></button>
                        </div>
                        <div className='w-6 h-6 pl-1 pb-1'>
                          <button className='w-full h-full'>
                            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 28.577 28.577" ><path d="M28.19,13.588l-3.806-3.806c-0.494-0.492-1.271-0.519-1.733-0.054
   c-0.462,0.462-0.439,1.237,0.057,1.732l1.821,1.821h-9.047V4.118l1.82,1.82c0.495,0.493,1.271,0.521,1.732,0.055
   c0.464-0.464,0.442-1.238-0.055-1.733l-3.805-3.807c-0.495-0.493-1.271-0.517-1.733-0.054c-0.013,0.012-0.021,0.024-0.031,0.038
   c-0.017,0.013-0.036,0.025-0.054,0.044l-3.75,3.754C9.118,4.724,9.097,5.493,9.562,5.957c0.463,0.461,1.233,0.443,1.723-0.044
   l1.825-1.828v9.196H4.017l1.83-1.827c0.488-0.489,0.505-1.26,0.041-1.721C5.426,9.268,4.656,9.289,4.169,9.776l-3.756,3.752
   c-0.017,0.02-0.028,0.037-0.043,0.053c-0.012,0.012-0.026,0.021-0.037,0.03c-0.465,0.467-0.44,1.241,0.057,1.734l3.804,3.807
   c0.494,0.495,1.271,0.52,1.733,0.056s0.438-1.24-0.056-1.733l-1.82-1.82h9.059v8.803l-1.817-1.82
   c-0.495-0.494-1.271-0.519-1.734-0.054c-0.463,0.463-0.439,1.237,0.056,1.73l3.805,3.807c0.495,0.496,1.271,0.52,1.734,0.057
   c0.013-0.013,0.021-0.024,0.029-0.04c0.018-0.013,0.036-0.026,0.056-0.042l3.751-3.756c0.489-0.484,0.51-1.256,0.045-1.721
   c-0.465-0.46-1.234-0.442-1.722,0.042l-1.829,1.829l0.001-8.835h9.078l-1.83,1.83c-0.488,0.485-0.506,1.255-0.043,1.722
   c0.462,0.462,1.232,0.443,1.721-0.046l3.754-3.754c0.017-0.016,0.029-0.036,0.045-0.053c0.013-0.012,0.027-0.019,0.039-0.03
   C28.708,14.859,28.684,14.084,28.19,13.588z"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>);
              })}
            </div>)}
        </div>
      </div>
    </div>
  );
}




// 'textarea '


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
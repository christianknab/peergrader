'use client';
import React, { useEffect, useRef, useState } from 'react';
import PDFView from './PdfView';
import throttle from 'lodash.throttle';
import { AnnotationMarkerData } from '@/utils/types/AnnotationMarkerData';
import Textarea from 'react-expanding-textarea'
import { supportedColors } from '@/utils/constants';
import MoveIcon from '@/components/icons/Move';
import DeleteIcon from '@/components/icons/Delete';

export default function StudentGradePage() {
  const [columnWidth, setColumnWidth] = useState<number>(70);

  const [annotationMarkers, setAnnotationMarkers] = useState<readonly AnnotationMarkerData[]>([]);
  const [annotationMoveIndex, setAnnotationMoveIndex] = useState<number | undefined>(undefined);
  const [deletePendingIndex, setDeletePendingIndex] = useState<number | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const [PDFWidth, setPDFWidth] = useState<number | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [addPointSelected, setAddPointSelected] = useState<boolean>(false);


  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const commentSectionRef = useRef<HTMLDivElement>(null);
  const tabs: (readonly string[]) = ["Grade", "Comment"];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (commentSectionRef.current && !commentSectionRef.current.contains(event.target as Node)) {
        setSelectedIndex(undefined);
      }
    }
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [commentSectionRef]);

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

  const handleMoveAnnotationMarker = (index: number) => {
    if (annotationMoveIndex != index) { setAnnotationMoveIndex(index); } else { setAnnotationMoveIndex(undefined); }
  }
  const handleAddCommentPressed = () => {
    setAddPointSelected((val) => !val);
    setAnnotationMoveIndex(undefined);
  }

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
    const pdfRect = event.currentTarget.getBoundingClientRect();
    //normalize with linear interpolation
    const x = ((event.clientX - pdfRect.left) / (pdfRect.right - pdfRect.left)) * 1000;
    const y = ((event.clientY - pdfRect.top) / (pdfRect.bottom - pdfRect.top)) * 1000;

    if (addPointSelected) {
      setAddPointSelected((val) => !val);

      handleAddAnnotationMarker({ page: pageIndex + 1, x: x, y: y, colorIndex: 0 });
    } else if (annotationMoveIndex != undefined) {
      setAnnotationMoveIndex(undefined);
      setAnnotationMarkers((prevStates) => {
        const newStates = [...prevStates];
        const obj = newStates[annotationMoveIndex];
        obj.page = pageIndex + 1;
        obj.x = x;
        obj.y = y;
        return newStates;
      });
    }

  }

  return (
    <div className='flex w-full'>
      {addPointSelected && <div style={{ position: 'fixed', left: `${columnWidth / 2}%`, transform: 'translate(-50%, 0)', top: 13, zIndex: 50 }}>
        <div className='bg-gray-800 rounded-full py-1 px-4'>
          <span className='text-white'>Click the document to add a point.</span>
        </div>
      </div>}
      {annotationMoveIndex != undefined &&
        <div style={{ position: 'fixed', left: `${columnWidth / 2}%`, transform: 'translate(-50%, 0)', top: 13, zIndex: 50 }}>
          <div className='bg-gray-800 rounded-full py-1 px-4'>
            <span className='text-white'>Click the document to set new position.</span>
          </div>
        </div>}
      {deletePendingIndex != undefined &&
        <div>
          <div className='fixed w-screen h-screen opacity-50 bg-black z-40'>
          </div>
          <div className='fixed z-50 flex items-center inset-0 justify-center'>
            <div className="max-w-sm h-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4">
                <h2 className="text-xl font-bold mb-2">Confirm Delete</h2>
                <p className="text-gray-700 text-base">
                  Are you sure you would like to delete this comment? This cannot be undone.
                </p>
              </div>
              <div className="px-6 py-4 bg-gray-100 flex justify-end">
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2" onClick={(_) => setDeletePendingIndex(undefined)}>
                  No
                </button>
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={(_) => {
                    setAnnotationMarkers((prevStates) => {
                      const newStates = [...prevStates];
                      newStates.splice(deletePendingIndex, 1);
                      return newStates;
                    });
                    setDeletePendingIndex(undefined);
                  }}>
                  Yes
                </button>
              </div>
            </div>
          </div>
          {/* <div className='fixed w-80 h-48 inset-0 rounded-lg m-auto bg-white z-50'>
            <div className='text-xl px-7 pt-5'>
              Are you sure you want to delete this comment?
            </div>
            <button className='bg-blue-600 rounded-lg px-2'>
              Yes
            </button>
          </div> */}
        </div>}

      <div style={{ width: `${columnWidth}%` }}>
        <div className='overflow-y-auto h-screen' ref={pdfContainerRef}>
          <PDFView fileUrl='https://vrmbrpvpedkdpziqlbzp.supabase.co/storage/v1/object/public/files/699eca23-2746-46e6-b549-437ba53f93ec/Copy%20of%20Homework%202%20CSE120%20Spring%202024.docx.pdf'
            width={PDFWidth} onPageClick={documentClickHandler}
            annotationMarkers={selectedTab == 1 ? annotationMarkers : []}
            pointSelectionEnabled={addPointSelected || annotationMoveIndex != undefined}
            excludeIndex={annotationMoveIndex} 
            selectedIndex={selectedIndex}/>
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
              <div className={`flex w-full p-2 border-b-2 justify-end ${(selectedIndex == 0) ? 'border-blue-300' : 'border-gray-100'}`}>
                <button className={`flex items-center rounded-md ${addPointSelected ? "bg-gray-400" : "bg-gray-100"}`} onClick={(_) => handleAddCommentPressed()}>
                  <span className='text-sm pl-4 pr-2'>Add Comment</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className='w-11 h-11 p-2 fill-gray-500' viewBox="0 0 45.4 45.4"><path d="M41.267,18.557H26.832V4.134C26.832,1.851,24.99,0,22.707,0c-2.283,0-4.124,1.851-4.124,4.135v14.432H4.141 c-2.283,0-4.139,1.851-4.138,4.135c-0.001,1.141,0.46,2.187,1.207,2.934c0.748,0.749,1.78,1.222,2.92,1.222h14.453V41.27 c0,1.142,0.453,2.176,1.201,2.922c0.748,0.748,1.777,1.211,2.919,1.211c2.282,0,4.129-1.851,4.129-4.133V26.857h14.435 c2.283,0,4.134-1.867,4.133-4.15C45.399,20.425,43.548,18.557,41.267,18.557z" /></svg>
                </button>
              </div><div ref={commentSectionRef}>
                {annotationMarkers.map((value, index) => {
                  return (
                    <div className={`flex w-full border-b-2  items-start ${(selectedIndex == index || selectedIndex == index + 1) ? 'border-blue-300' : 'border-gray-100'}`}
                      key={`comment${index}`}
                      onClick={(_) => setSelectedIndex(index)}>
                      {/* Circle */}
                      <div className='w-14 h-14 p-3'>
                        <button className="w-full h-full rounded-full aspect-square" style={{ backgroundColor: supportedColors[value.colorIndex] }} onClick={(_) => commentColorClickHandler(index)}>
                        
                        </button>
                      </div>
                      {/* Text */}
                      <div className='w-full'><Textarea
                        className="w-full pt-2 pr-2 text-gray-900 bg-gray-50 outline-none focus:ring-0 focus:shadow-none resize-none"
                        id="my-textarea"
                        maxLength={2000}
                        placeholder="Add a comment..."
                      // onFocus={(_)=>setSelectedIndex(index)}
                      />
                        <div className='flex'>
                          <div className="w-6 h-6 p-0.5">
                            <button className="w-full h-full p-0.5 rounded-md hover:bg-gray-400 bg-gray-50" onClick={(_) => setDeletePendingIndex(index)}>
                              <DeleteIcon />
                            </button>
                          </div>
                          <div className='w-6 h-6 p-0.5'>
                            <button className={`w-full h-full rounded-md ${annotationMoveIndex == index ? "bg-gray-400" : "bg-gray-50"}`} onClick={(_) => handleMoveAnnotationMarker(index)}>
                              <MoveIcon />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>);
                })}</div>
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
// const [loading, setLoading] = useState(false);import React from 'react';
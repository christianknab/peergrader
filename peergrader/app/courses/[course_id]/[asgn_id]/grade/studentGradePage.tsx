'use client';
import React, { useEffect, useRef, useState } from 'react';
import PDFView from './PdfView';
import { StudentRubric } from './studentRubricView';
import throttle from 'lodash.throttle';
import { AnnotationMarkerData } from '@/utils/types/AnnotationMarkerData';
import Textarea from 'react-expanding-textarea'
import { supportedColors } from '@/utils/constants';
import MoveIcon from '@/components/icons/Move';
import DeleteIcon from '@/components/icons/Delete';
import DownArrow from '@/components/icons/DownArrow';
import UpArrow from '@/components/icons/UpArrow';
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from 'next/navigation';
import useOwnerFromFileQuery from '@/utils/hooks/QueryOwnerFromFile';
import useCurrentUserQuery from '@/utils/hooks/QueryCurrentUser';
import SetSubmissionGrade from '@/utils/queries/SetSubmissionGrade';
import GetSubmissionGrade from '@/utils/queries/GetSubmissionGrade';

export default function StudentGradePage() {
  const [columnWidth, setColumnWidth] = useState<number>(70);
  const searchParams = useSearchParams();
  const [annotationMarkers, setAnnotationMarkers] = useState<readonly AnnotationMarkerData[]>([]);
  const [annotationMoveIndex, setAnnotationMoveIndex] = useState<number | undefined>(undefined);
  const [deletePendingIndex, setDeletePendingIndex] = useState<number | undefined>(undefined);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(undefined);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [PDFWidth, setPDFWidth] = useState<number | undefined>(undefined);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [addPointSelected, setAddPointSelected] = useState<boolean>(false);
  const [isAnnotationIncomplete, setIsAnnotationIncomplete] = useState<boolean>(false);
  const router = useRouter();

  // For rubric
  const [selectedPoints, setSelectedPoints] = useState<{ [key: string]: boolean }>({});

  const supabase = createClient();

  const commentSectionRef = useRef<HTMLDivElement>(null);
  const tabs: (readonly string[]) = ["Grade", "Comment"];
  const fileId = searchParams.get('file_id');

  if (!fileId) return (<div>Error</div>);

  const {
    data: owner,
    isLoading: isOwnerLoading,
    isError: isOwnerError
  } = useOwnerFromFileQuery(fileId);
  const {
    data: currentUser,
    isLoading: isUserLoading,
    isError: isCurrentUserError
  } = useCurrentUserQuery();

  const { data: { publicUrl } } = supabase.storage.from('files').getPublicUrl(`${owner}/${fileId}` || '');

  useEffect(() => {
    const fetchData = async () => {
      if (isOwnerLoading || isUserLoading) return;
      const { data } = await GetSubmissionGrade(supabase, currentUser?.uid, fileId)
      setAnnotationMarkers(data?.annotation_data)
    }
    fetchData();
  }, [isOwnerLoading, isUserLoading]);
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

  const pointClicked = (rubricIndex: number, categoryIndex: number) => {
    const key = `${rubricIndex}-${categoryIndex}`;
    setSelectedPoints(prev => ({
      ...prev,
      [key]: !prev[key]  // Toggle the selection state
    }));
  };

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

  const handleMoveDown = (index: number) => {
    const newStates = [...annotationMarkers];
    const temp = newStates[index];
    newStates[index] = newStates[index + 1];
    newStates[index + 1] = temp;
    setAnnotationMarkers(newStates);
    setSelectedIndex(index + 1);
  }

  const handleMoveUp = (index: number) => {
    const newStates = [...annotationMarkers];
    const temp = newStates[index];
    newStates[index] = newStates[index - 1];
    newStates[index - 1] = temp;
    setAnnotationMarkers(newStates);
    setSelectedIndex(index - 1);

  }

  const handleCommentChanged = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    const newStates = [...annotationMarkers];
    newStates[index].text = event.target.value;
    setAnnotationMarkers(newStates);
  }

  const handleSubmit = async () => {
    //check grades
    //check comments
    for (let index = 0; index < annotationMarkers.length; index++) {
      const item = annotationMarkers[index];
      if (item.text == "") {
        //set error
        setSelectedTab(1);
        setIsAnnotationIncomplete(true);
        return;
      }
    }



    const { error } = await SetSubmissionGrade(supabase, { userId: currentUser?.uid, fileId: fileId, data: eval(JSON.stringify(annotationMarkers)) });
    if (error) {
      console.error("upload Error")
      return;
    }
    router.back();
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

      handleAddAnnotationMarker({ page: pageIndex + 1, x: x, y: y, colorIndex: 0, text: "" });
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

  if (isOwnerLoading || isUserLoading) return (<div>Loading</div>);
  if (!owner || isOwnerError || !currentUser || isCurrentUserError) return (<div>Error</div>);
  return (
    <main>
      <div className="w-full flex justify-between items-center p-4 light-grey">
          <button
            className="py-2 px-4 rounded-md font-bold no-underline bg-btn-background hover:bg-btn-background-hover"
            onClick={() => router.back()}>
            Return to Assignment
          </button>
          <span className="font-bold text-lg">PeerGrader</span>
        </div>
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
        </div>}
      {isAnnotationIncomplete &&
        <div>
          <div className='fixed w-screen h-screen opacity-50 bg-black z-40'>
          </div>
          <div className='fixed z-50 flex items-center inset-0 justify-center'>
            <div className="max-w-sm h-auto bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4">
                <h2 className="text-xl font-bold mb-2">Incomplete Comments</h2>
                <p className="text-gray-700 text-base">
                  All comments must have text.
                </p>
              </div>
              <div className="px-6 py-4 bg-gray-100 flex justify-end">
                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                  onClick={(_) => {
                    setIsAnnotationIncomplete(false);
                  }}>
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>}

      <div style={{ width: `${columnWidth}%` }}>
        <div className='overflow-y-auto h-screen' ref={pdfContainerRef}>
          <PDFView fileUrl={publicUrl}
            width={PDFWidth} onPageClick={documentClickHandler}
            annotationMarkers={selectedTab == 1 ? annotationMarkers : []}
            pointSelectionEnabled={addPointSelected || annotationMoveIndex != undefined}
            excludeIndex={annotationMoveIndex}
            selectedIndex={selectedIndex} />
        </div>
      </div>
      <button type="button" onMouseDown={dragResizeHandler} className="h-screen w-1 bg-gradient-to-r from-gray-100 via-gray-500 to-gray-100 cursor-col-resize">
      </button>
      <div style={{ flex: 1, minWidth: "15%" }}>
        <div className='flex flex-col h-screen'>
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
          <div className='overflow-auto flex-grow'>
            {/* Tabs */}
            {selectedTab == 0 ?
              (<div>
                <StudentRubric pointClicked={pointClicked} selectedPoints={selectedPoints} />
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
                            {index + 1}
                          </button>
                        </div>
                        {/* Text */}
                        <div className='w-full'>
                          <Textarea
                            className="w-full pt-2 pr-2 text-gray-900 bg-gray-50 outline-none focus:ring-0 focus:shadow-none resize-none"
                            id="my-textarea"
                            maxLength={2000}
                            placeholder="Add a comment..."
                            value={annotationMarkers[index].text}
                            onChange={(event) => handleCommentChanged(event, index)}
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
                            {(index != annotationMarkers.length - 1) && (<div className='w-6 h-6 p-0.5'>
                              <button className="w-full h-full p-0.5 rounded-md hover:bg-gray-400 bg-gray-50" onClick={(e) => { e.stopPropagation(); handleMoveDown(index); }}>
                                <DownArrow />
                              </button>
                            </div>)}
                            {(index != 0) && (<div className='w-6 h-6 p-0.5'>
                              <button className="w-full h-full p-0.5 rounded-md hover:bg-gray-400 bg-gray-50" onClick={(e) => { e.stopPropagation(); handleMoveUp(index); }}>
                                <UpArrow />
                              </button>
                            </div>)}
                          </div>
                        </div>
                      </div>);
                  })}
                </div>
              </div>)}
          </div>
          <div className='p-3 w-full border-t-2 border-gray-200 h-16'>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
              onClick={handleSubmit}>
              Submit Review
            </button></div>

        </div>
      </div>
    </div>
    <footer className="w-full font-bold mt-8 light-grey p-4 bg-white text-center">
        <p>&copy;2024 PeerGrader</p>
    </footer>
  </main>
  );
}
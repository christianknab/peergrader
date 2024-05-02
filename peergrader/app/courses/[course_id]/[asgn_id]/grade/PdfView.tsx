import React, { useState, useEffect, useRef, RefObject } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import Marker from './AnnotationMarker';
import { AnnotationMarkerData } from '@/utils/types/AnnotationMarkerData';

pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';


interface PDFViewProps {
    pointSelectionEnabled: boolean
    annotationMarkers: readonly AnnotationMarkerData[];
    fileUrl: string;
    width: number | undefined;
    onPageClick?: (event: React.MouseEvent<HTMLDivElement>, pageIndex: number) => void;
}

const PDFView: React.FC<PDFViewProps> = ({ fileUrl, width, onPageClick, annotationMarkers , pointSelectionEnabled}) => {
    const [numPages, setNumPages] = useState<number>();
    const [pageLayouts, setPageLayouts] = useState<readonly ({ width: number, height: number } | undefined)[]>([]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
        const newStates = Array.from({ length: numPages }, () => undefined)
        setPageLayouts(newStates);
        setNumPages(numPages);
    }

    const handleSetState = (index: number, value: ({ width: number, height: number } | undefined)) => {
        setPageLayouts((prevStates) => {
            const newStates = [...prevStates];
            newStates[index] = value;
            return newStates;
        });
    };

    return (
        <div>
            <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(
                    new Array(numPages),
                    (_, index) => (
                        <div key={`page-container-extern${index + 1}`} className="flex justify-center mb-2 mt-2">
                            <div key={`page-container-${index + 1}`} className={`${pointSelectionEnabled && "cursor-pointer"} relative`} >
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    width={width ? width * 0.85 : undefined}
                                    onClick={(event) => onPageClick?.(event, index)}
                                    onRenderSuccess={(page) => { handleSetState(index, { width: page.width, height: page.height }); }}
                                />
                                {annotationMarkers.map((value, markIndex) => (value.page == index + 1 && <Marker radius={width ? width * 0.01 : 10} data={value} page={pageLayouts[index]} key={`marker${markIndex}`} />))}

                            </div>
                        </div>
                    ),
                )}
            </Document>
        </div>
    );
};

export default PDFView;
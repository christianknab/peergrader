import { LoadingSpinner } from '@/components/loadingSpinner';
import useAsgnDataQuery from '@/utils/hooks/QueryAsgnData';
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { AsgnData } from '@/utils/types/asgnData';
import CollapseIndicator from '@/components/icons/CollapseIndicator';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Markdown from '@/components/MarkdownDisplay';


export default function Description({ asgnData }: { asgnData: AsgnData }) {
    const [isDetailsVisible, setIsDetailsVisible] = useState(true);
    return (
        <div className="pb-5">
            <button className='flex items-center font-semibold text-xl' onClick={(_) => setIsDetailsVisible((value) => !value)}>

                <div className='pr-1.5'><CollapseIndicator isOpen={isDetailsVisible} size={11} /></div>
                Details

            </button>
            {isDetailsVisible && <Markdown className="pl-7">{asgnData.description}</Markdown>}
        </div>
    );
}
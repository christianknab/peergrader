import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface MarkdownProps {
    className?: string
    children?: string
}

export default function Markdown({ className, children }: MarkdownProps) {
    return (<ReactMarkdown className={className} remarkPlugins={[remarkGfm]} components={{
        h1: ({ node, ...props }) => { return (<h1 {...props} style={{ fontWeight: 500, lineHeight: 1, fontSize: 21 }} />) },
        h2: ({ node, ...props }) => { return (<h2 {...props} style={{ fontWeight: 500, lineHeight: 1.067, fontSize: 20 }} />) },
        h3: ({ node, ...props }) => { return (<h3 {...props} style={{ fontWeight: 500, lineHeight: 1.083, fontSize: 19 }} />) },
        h4: ({ node, ...props }) => { return (<h4 {...props} style={{ fontWeight: 500, lineHeight: 1.1, fontSize: 18 }} />) },
        h5: ({ node, ...props }) => { return (<h5 {...props} style={{ fontWeight: 500, lineHeight: 1.111, fontSize: 17 }} />) },
        h6: ({ node, ...props }) => { return (<h6 {...props} style={{ fontWeight: 500, lineHeight: 1.125, fontSize: 16 }} />) },
        p: ({ node, ...props }) => { return (<p {...props} style={{ lineHeight: 1.5, fontSize: 16 }} />) },
        a: ({ node, ...props }) => { return (<a {...props} style={{ lineHeight: 1.5, fontSize: 16, color: "blue" }} target="_blank" />) },
        ul: ({ node, ...props }) => <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }} {...props} />,
        ol: ({ node, ...props }) => <ol style={{ listStyleType: 'decimal', paddingLeft: '20px' }} {...props} />,
        li: ({ node, ...props }) => <li style={{ marginBottom: '3px' }} {...props} />,
        table: ({ node, ...props }) => <table {...props} className="table-auto" />,
        th: ({ node, ...props }) => <th {...props} className="px-4 py-2 border"/>,
        td: ({ node, ...props }) => <td {...props} className="border px-4 py-2" />,
    }}>
        {children}
    </ReactMarkdown>);
}
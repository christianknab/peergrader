const CollapseIndicator = ({isOpen, size = 10}:{isOpen: boolean, size:number}) => (isOpen ?
    (<svg name="IconArrowOpenDown" viewBox="0 0 1920 1920" rotate="0" width={size} height={size} aria-hidden="true" role="presentation" focusable="false">

        <path d="m.08 568.063 176.13-176.13 783.988 783.864 783.74-783.864 176.129 176.13-959.87 960.118z" fillRule="evenodd">

        </path>

    </svg>) : (<svg name="IconArrowOpenEnd" viewBox="0 0 1920 1920" rotate="0" width={size} height={size} aria-hidden="true" role="presentation" focusable="false">
        <path d="M568.13.012 392 176.142l783.864 783.989L392 1743.87 568.13 1920l960.118-959.87z" fillRule="evenodd">

        </path>
    </svg>)
);
export default CollapseIndicator;
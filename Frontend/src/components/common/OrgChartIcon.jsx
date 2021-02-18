export default function OrgChartIcon(props) {
    return (
        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" {...props}>
            <rect x="8" width="8" height="9" fill="#C4C4C4" />
            <rect x="16" y="16" width="8" height="9" fill="#C4C4C4" />
            <rect y="16" width="8" height="9" fill="#C4C4C4" />
            <line x1="12.5" y1="9" x2="12.5" y2="13" stroke="black" />
            <line x1="12" y1="13.5" x2="20" y2="13.5" stroke="black" />
            <line x1="20.5" y1="13" x2="20.5" y2="16" stroke="black" />
            <line x1="4" y1="13.5" x2="12" y2="13.5" stroke="black" />
            <line x1="4.5" y1="13" x2="4.5" y2="16" stroke="black" />
        </svg>
    );
}

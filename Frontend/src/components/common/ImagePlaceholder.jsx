import React from "react";

export default function ImagePlaceholder(props) {
    console.log(props.image);
    return (
        // <svg width="162" height="173" viewBox="0 0 162 173" fill="none">
        //     <rect width="162" height="173" fill="url(#pattern0)" />
        //     <defs>
        //         <pattern
        //             id="pattern0"
        //             patternContentUnits="objectBoundingBox"
        //             width="1"
        //             height="1"
        //         >
        //             <use
        //                 href="#image0"
        //                 transform="translate(-0.0339506) scale(0.016686 0.015625)"
        //             />
        //         </pattern>
        //         <image
        //             id="image0"
        //             width="64"
        //             height="64"
        //             href= {props.image}
        //         />
        //     </defs>
        // </svg>

        <img width="64" height="64" src={props.image} />
    );
}

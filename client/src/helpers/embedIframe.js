import React, { useEffect, useState } from 'react'
export default function FrameWrapper({ latest }) {
    const ref = React.useRef();
    const [height, setHeight] = React.useState("0px");
    const onLoad = () => {
        setHeight(ref.current.contentWindow.document.body.scrollHeight + "px");
    };
    return (


        <iframe
            sandbox="allow-scripts allow-same-origin"
            ref={ref}
            onLoad={onLoad}
            id="report"
            src={`http://localhost:3000/d/zZR1jUA7z/iss2save-dashboard?orgId=1&var-LATEST_EXPERIMENT=${latest}&kiosk=tv`}
            width="100%"
            height={height}
            scrolling="no"

            frameBorder="0"
            style={{
                width: "100%",
                overflow: "auto",
            }}
        ></iframe>
    );
}

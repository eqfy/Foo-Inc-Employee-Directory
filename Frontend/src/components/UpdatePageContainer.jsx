import React from "react";
import { PageContainer } from "./common/PageContainer";

export default function UpdatePageContainer(props) {

    return (
        <PageContainer>
            <div>
                <h1>Mar 14th</h1>
                <h2>Below are some visible changes since last deployment:</h2>
                <h3>Search Page:
                    <ul>
                        <li>filter area is now responsive to filter changes, though not yet connected to backend search endpoint</li>
                        <li>result area is connected to redux store, and s3 buckets has been set up for images (though not all mock data have the url)</li>
                    </ul>
                    Profile View:
                    <ul>
                        <li>Previous / Next button is connected to redux store</li>
                    </ul>
                    Org Chart:
                    <ul>
                        <li>Org chart has a better UI now. It is connected to backend, and user can rerender by clicking nodes. Grab and zoom are supported</li>
                    </ul>
                </h3>
            </div>
        </PageContainer>
    );
}


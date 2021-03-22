import React from "react";
import { PageContainer } from "./common/PageContainer";

export default function UpdatePageContainer(props) {
    return (
        <PageContainer>
            <div>
                <h1>Mar 21</h1>
                <h2>Below are some visible changes since last deployment:</h2>
                <h3>
                    Search Page:
                    <ul>
                        <li>
                            Typing in a filter/category in the apply filter area
                            will return a list of potential filters to apply. If
                            there is only one filter, pressing "Enter" selects
                            the filter.
                        </li>
                        <li>
                            All filters changes now toggle a request to the
                            backend which will update the result area with
                            workers satifying the filters.
                        </li>
                        <li>
                            Predictive search by name is the final API
                            connection that remains to be implemented.
                        </li>
                    </ul>
                    Profile View:
                    <ul>
                        <li></li>
                    </ul>
                    Org Chart:
                    <ul>
                        <li></li>
                    </ul>
                </h3>
            </div>
            <div>
                <h1>Mar 14</h1>
                <h2>Below are some visible changes since last deployment:</h2>
                <h3>
                    Search Page:
                    <ul>
                        <li>
                            filter area is now responsive to filter changes,
                            though not yet connected to backend search endpoint
                        </li>
                        <li>
                            result area is connected to redux store, and s3
                            buckets has been set up for images (though not all
                            mock data have the url)
                        </li>
                    </ul>
                    Profile View:
                    <ul>
                        <li>
                            Previous / Next button is connected to redux store
                        </li>
                    </ul>
                    Org Chart:
                    <ul>
                        <li>
                            Org chart has a better UI now. It is connected to
                            backend, and user can rerender by clicking nodes.
                            Grab and zoom are supported
                        </li>
                    </ul>
                </h3>
            </div>
        </PageContainer>
    );
}

import React from "react";
import { PageContainer } from "./common/PageContainer";

export default function UpdatePageContainer(props) {
    return (
        <PageContainer>
            <div>
                <h1>Mar 24</h1>
                <h3>
                    Note that code start time has been reduced to 4~5s after 5
                    minutes of no actions.
                </h3>
                <h2>Below are some visible changes since last deployment:</h2>
                <h3>
                    Search Page:
                    <ul>
                        <li>
                            Search by filters is almost fully connected to
                            backend, except updating it to not fetch data all at once, if there are a large amount of matching results.
                        </li>
                        <li>
                            Typing in a filter/category in the apply filter area
                            will now show the checkboxes automatically.
                        </li>
                        <li>
                            Predictive search by name is implemented. Entering
                            at least 2 characters in the search-by-name bar will
                            fetch at most 20 entries with matching names in the
                            dropdown. Choosing any option will search for that
                            employee / contractor.
                        </li>
                    </ul>
                    Profile View:
                    <ul>
                        <li>
                            Append WIP link with /profile/some_id is functioning.
                        </li>
                        <li>
                            Core information section shows more information now.
                        </li>
                        <li>
                            Skill section shows skills separated in groups.
                            Clicking on a chip or "search with these skills"
                            would now initiate a search with the skill(s).
                        </li>
                    </ul>
                    Org Chart:
                    <ul>
                        <li>
                            Append WIP link with /orgChart/some_id is functioning.
                        </li>
                        <li>
                            Org chart search by name bar now displays the name
                            when choosing an option.
                        </li>
                    </ul>
                </h3>
            </div>
            <div>
                <h1>Mar 21</h1>
                <h3>
                    Note that some of the loading takes around 15 seconds. This
                    is due to the cold start for each API endpoints if there is
                    no action in 5 minutes. This would be improved later.
                </h3>
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
                        <li>
                            Employee card has a better UI now. It would have 1
                            line for both name and title, and hides long text
                            unless hover.
                        </li>
                    </ul>
                    Profile View:
                    <ul>
                        <li>Profile view is now connected to the backend.</li>
                    </ul>
                    Org Chart:
                    <ul>
                        <li>
                            Org chart search by name bar is connected to the
                            backend. Entering at least 2 characters will fetch
                            at most 20 entries with matching names in the
                            dropdown.
                        </li>
                        <li>
                            Org chart has an updated UI. It would display long
                            text in the same place as the short one when hover,
                            if a string is too long.
                        </li>
                    </ul>
                    Add Contractor:
                    <ul>
                        <li>
                            Has basic form structure, currently hooking to
                            backend and redux store
                        </li>
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
                            though not yet connected to backend search endpoint.
                        </li>
                        <li>
                            result area is connected to redux store, and s3
                            buckets has been set up for images (though not all
                            mock data have the url).
                        </li>
                    </ul>
                    Profile View:
                    <ul>
                        <li>
                            Previous / Next button is connected to redux store.
                        </li>
                    </ul>
                    Org Chart:
                    <ul>
                        <li>
                            Org chart has a better UI now. It is connected to
                            backend, and user can rerender by clicking nodes.
                            Grab and zoom are supported.
                        </li>
                    </ul>
                </h3>
            </div>
        </PageContainer>
    );
}

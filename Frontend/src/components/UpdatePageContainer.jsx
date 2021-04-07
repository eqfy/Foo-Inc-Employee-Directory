import React from "react";
import { PageContainer } from "./common/PageContainer";

export default function UpdatePageContainer(props) {
    return (
        <PageContainer>
            <div>
                <h2>Apr 6</h2>
                <h3>
                    Please use the following credentials to login as an admin
                    user
                </h3>
                <p>user name: Foo-inc-1234, password: Foo-inc-1234</p>
                <h3>Below are some visible changes since last deployment:</h3>
                <p>
                    Search Page:
                    <ul>
                        <li>
                            Result area now uses offset based pagination for
                            improved performance. Specifically we fetch 10 pages
                            at a time instead of every page.
                        </li>
                        <li>
                            Added a hint button with hints on how to use the
                            search page.
                        </li>
                        <li>
                            Search by name bar should now properly show a
                            loading circle when typing in text
                        </li>

                        <li>Fixed issue with Ascending checkbox not working</li>
                        <li>
                            Fixed a bug where search returns duplicated results
                        </li>
                        <li>
                            Fixed a bug with loading circle for search by name
                            bar
                        </li>
                        <li>
                            Improved display of workers with the same name in
                            the "Search by name" dropdown. If the number of
                            worker with the same name is &lt;= 5, we show the
                            exact number of workers with the same name found,
                            otherwise we show 5+ found.
                        </li>
                    </ul>
                    Profile View:
                    <ul>
                        <li>
                            Prev/next buttons' text have been updated from
                            "Previous/Next" to "Previous/Next search result".
                            This update better reflects that the buttons
                            represent the previous/next worker from the Search
                            Page result area.
                        </li>
                        <li>
                            Prev/next buttons are now properly disabled if
                            worker is not (pre)loaded in the search page result
                            area (doesn't satisfy the filters applied on the
                            search page).
                        </li>
                        <li>
                            Prev/next button now does proper prefetching if the
                            prev/next worker is not already loaded in search
                            page result area.
                        </li>
                        <li>
                            Prev/next button now changes the search page result
                            area page number if the prev/next worker is on a
                            different page.
                        </li>
                    </ul>
                    Org Chart:
                    <ul>
                        <li>
                            Added a hint button with hints on how to use the
                            organization chart page.
                        </li>
                    </ul>
                    Add Contractor:
                    <ul>
                        <li>
                            Allow adding of contractors with numbers in their
                            names
                        </li>
                        <li>Allow adding of contractors with no skills</li>
                        <li>Allow adding of contractors with no photo</li>
                        <li>Fixed display bug at lower screen width</li>
                        <li>Fixed empty photo causing page to crash</li>
                    </ul>
                    General:
                    <ul>
                        <li>
                            Clicking on the current user's avatar in the header
                            tab now provides option to go to an organization
                            chart generated around the current user
                        </li>
                    </ul>
                </p>
            </div>
            <div>
                <h2>Mar 30</h2>
                <h3>Below are some visible changes since last deployment:</h3>
                <p>
                    Search Page:
                    <ul>
                        <li>
                            Search by name bar has loading indication now. If n
                            (at least 2) results with same name are found, they
                            are displayed as "n Found", and selecting an option
                            in the dropdown will add a filter tag in the filter
                            area.
                        </li>
                        <li>
                            Result area has 8 entries per page, and will not
                            overlay with other areas on smaller dimensions.
                        </li>
                        <li>
                            Employee cards now show hidden texts (if any string
                            is too long) on single click indicated by the box
                            shadow. Double click navigates to profile page (used
                            to be single click).
                        </li>
                        <li>Employee cards now show email.</li>
                        <li>Search bar has a clear all filters button</li>
                    </ul>
                    Profile View:
                    <ul>
                        <li>
                            Termination date has been removed from core
                            information area.
                        </li>
                        <li>
                            Overlay between left and right section is resolved
                            in smaller dimensions.
                        </li>
                    </ul>
                    Org Chart:
                    <ul>
                        <li>
                            Similar to employee cards, Orgchart nodes now show
                            full text on single click, and regenerate a new org
                            chart on double click (used to be single click).
                        </li>
                    </ul>
                    Add Contractor:
                    <ul>
                        <li>
                            Admin authentication has been added. User will be
                            redirected to login page first if he/she does not
                            have admin permissions.
                        </li>
                        <ul>Implement supervisor predictive search</ul>
                        <ul>Fetch office and group codes from the database</ul>
                        <ul>Display skills with categories</ul>
                    </ul>
                    General:
                    <ul>
                        <li>
                            Clicking on the current user's avatar in the header
                            tab now provides two dropdown options, to go to
                            profile for the current user or to login as admin.
                        </li>
                    </ul>
                </p>
            </div>
            <div>
                <h2>Mar 24</h2>
                <h3>
                    Note that cold start time has been reduced to 4~5s after 5
                    minutes of no actions.
                </h3>
                <h3>Below are some visible changes since last deployment:</h3>
                <p>
                    Search Page:
                    <ul>
                        <li>
                            Search by filters is almost fully connected to
                            backend, except updating it to not fetch data all at
                            once, if there are a large amount of matching
                            results.
                        </li>
                        <li>
                            Typing in a filter/category in the apply filter area
                            search bar will now expand the filters
                            automatically.
                        </li>
                        <li>
                            Clearing the input in the apply filter area search
                            bar will now collapse all filters automatically.
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
                            Append WIP link with /profile/some_id is
                            functioning.
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
                            Append WIP link with /orgChart/some_id is
                            functioning.
                        </li>
                        <li>
                            Org chart search by name bar now sets its value to
                            the worker's name selected by the user in the
                            dropdown.
                        </li>
                    </ul>
                    Add Contractor:
                    <ul>
                        <li>
                            Connected to backend. We are now able to
                            successfully add contractor to the DB.
                        </li>
                        <li>Implemented field validation (except email).</li>
                        <li>Additional page styling.</li>
                    </ul>
                    General:
                    <ul>
                        <li>
                            We now use a mock worker to simulate a logged in
                            worker (currWorker). The search page will now use
                            the currWorker's location filter to initiate a
                            search when the page loads for the first time.
                        </li>
                        <li>
                            Added an avatar as a tab entry for the currWorker on
                            the tab bar. Clicking on it navigates to the profile
                            page for the currWorker.
                        </li>
                    </ul>
                </p>
            </div>
            <div>
                <h2>Mar 21</h2>
                <h3>
                    Note that some of the loading takes around 15 seconds. This
                    is due to the cold start for each API endpoints if there is
                    no action in 5 minutes. This would be improved later.
                </h3>
                <h3>Below are some visible changes since last deployment:</h3>
                <p>
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
                </p>
            </div>
            <div>
                <h2>Mar 14</h2>
                <h3>Below are some visible changes since last deployment:</h3>
                <p>
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
                </p>
            </div>
        </PageContainer>
    );
}

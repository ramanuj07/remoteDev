import {
    BASE_API_URL,
    searchInputEl, 
    searchFormEl, 
    jobListSearchEl,
    numberEl,
    getData, 
    sortingBtnRecentEl,
    sortingBtnRelevantEl,
    state
} from '../common.js';
import renderError from './Error.js';
import renderJobList from './JobList.js';
import renderSpinner from './Spinner.js';
import renderPaginationButtons from './Pagination.js';

const submitHandler = async event => {
    // preventing default behaviour
    event.preventDefault();

    // getting search text 
    const searchText = searchInputEl.value;

    //validation (regualar expression example)
    const forbiddenPattern = /[0-9]/;
    const patternMatch = forbiddenPattern.test(searchText);
    if (patternMatch) {
        renderError('Your search is prohibited for numbers');
        return;
    }

    // blur input
    searchInputEl.blur();

    // removing previous job items
    jobListSearchEl.innerHTML = '';

    // reset sorting buttons
    sortingBtnRelevantEl.classList.add('sorting__button--active');
    sortingBtnRecentEl.classList.remove('sorting__button--active');

    // rendering spinner 
    renderSpinner('search');

    // fetching search results
    // -- USING ASYNC AWAIT -- 
    try {
        // fetch search results 
        const data = await getData(`${BASE_API_URL}/jobs?search=${searchText}`);

        // extracting job items
        const { jobItems } = data;

        // update state 
        state.searchJobItems = jobItems;
        state.currentPage = 1;

        // removing spinner
        renderSpinner('search');

        // rendering number of results
        numberEl.textContent = jobItems.length;

        // rendering pagination buttons 
        renderPaginationButtons();

        // rendering job items in search job list
        renderJobList();

    } 
    catch(error) {
        renderSpinner('search');
        renderError(error.message);
    }


    // -- USING PROMISES -- 
    // fetch(`${BASE_API_URL}/jobs?search=${searchText}`)
    //     .then(res => {
    //         if (!res.ok) {
    //             // constructor function for error || Throw keyword ignores everything after this and directly goes to catch block
    //             throw new Error('Resource issue (e.g. message doesn\'t exist) or server issue');
    //         }

    //         return res.json();
    //     })
    //     .then(data => {
    //         // extracting job items
    //         const { jobItems } = data;

    //         // removing spinner 
    //         renderSpinner('search');

    //         // rendering number of results
    //         numberEl.textContent = jobItems.length;

    //         // rendering job items in search job list 
    //         renderJobList(jobItems);
    //     })
    //     .catch(error => {
    //         renderSpinner('search');
    //         renderError(error.message);
    //     });
}

searchFormEl.addEventListener('submit', submitHandler);
import {
    BASE_API_URL,
    jobListSearchEl,
    jobDetailsContentEl,
    getData, 
    state, 
    RESULTS_PER_PAGE,
    jobListBookmarksEl
} from '../common.js';
import renderError from './Error.js';
import renderSpinner from './Spinner.js';
import renderJobDetails from './JobDetails.js';

const renderJobList = (whichJobList = 'search') => {

    // determine correct selector for job list (search / bookmarks)
    const jobListEl = whichJobList === 'search' ? jobListSearchEl : jobListBookmarksEl;

    // remove previous job items 
    jobListEl.innerHTML = '';

    // determine the job items that has to be rendered (search / bookmarks)
    let jobItems;
    if(whichJobList === 'search') {
        jobItems = state.searchJobItems.slice(state.currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE, state.currentPage * RESULTS_PER_PAGE);
    } else if (whichJobList === 'bookmarks'){
        jobItems = state.bookmarkJobItems;
    }


    // display job items 
    jobItems.forEach(jobItem => {
        const newJobItemHTML = `
            <li class="job-item ${state.activeJobItem.id === jobItem.id ? 'job-item--active' : ''}">
                <a class="job-item__link" href="${jobItem.id}">
                    <div class="job-item__badge">${jobItem.badgeLetters}</div>
                    <div class="job-item__middle">
                        <h3 class="third-heading">${jobItem.title}</h3>
                        <p class="job-item__company">${jobItem.company}</p>
                        <div class="job-item__extras">
                            <p class="job-item__extra"><i class="fa-solid fa-clock job-item__extra-icon"></i> ${jobItem.duration}</p>
                            <p class="job-item__extra"><i class="fa-solid fa-money-bill job-item__extra-icon"></i> ${jobItem.salary}</p>
                            <p class="job-item__extra"><i class="fa-solid fa-location-dot job-item__extra-icon"></i> ${jobItem.location}</p>
                        </div>
                    </div>
                    <div class="job-item__right">
                        <i class="fa-solid fa-bookmark job-item__bookmark-icon ${state.bookmarkJobItems.some(bookmarkJobItem => bookmarkJobItem.id === jobItem.id) ? 'job-item__bookmark-icon--bookmarked' : ''}"></i>
                        <time class="job-item__time">${jobItem.daysAgo}d</time>
                    </div>
                </a>
            </li>
        `;
        jobListEl.insertAdjacentHTML('beforeend', newJobItemHTML);
    });
}

const clickHandler = async event => {

    // preventing default behaviour
    event.preventDefault();

    // getting clicked job item
    const jobItemEl = event.target.closest('.job-item');

    // removing previously selected active class
    // another method ---> document.querySelector('.job-item--active') && document.querySelector('.job-item--active').classList.remove('job-item--active');

    // recent addition in javascript to use ? before class list 
    document.querySelector('.job-item--active')?.classList.remove('job-item--active');

    // empty job details section
    jobDetailsContentEl.innerHTML = '';

    // rendering spinner 
    renderSpinner('job-list');

    // getting the id of the job element 
    const id = jobItemEl.children[0].getAttribute('href');

    // update the state 
    const allJobItems = [...state.searchJobItems, ...state.bookmarkJobItems];
    state.activeJobItem = allJobItems.find(jobItem => jobItem.id === +id);

    // rendering search job list 
    renderJobList();

    // add id to url
    history.pushState(null, '', `/#${id}`);

    // FETCHING the data for job details 
    // -- USING ASYNC AWAIT -- 
    try {
        // fetch job item data 
        const data = await getData(`${BASE_API_URL}/jobs/${id}`);

        // extracting job item from data using destructuring 
        const { jobItem } = data;

        // removing the spinner (toggling it)
        renderSpinner('job-list');

        // rendering job details 
        renderJobDetails(jobItem);
    }

    catch(error) {
        renderSpinner('job-details');
        renderError(error.message);
    }


    // -- USING PROMISES --
    // fetch(`${BASE_API_URL}/jobs/${id}`)
    //     .then(res => {
    //         if (!res.ok) {
    //             // constructor function for error || Throw keyword ignores everything after this and directly goes to catch block
    //             throw new Error('Resource issue (e.g. message doesn\'t exist) or server issue');
    //         }

    //         return res.json();
    //     })
    //     .then(data => {
    //         // extracting job item from data using destructuring 
    //         const { jobItem } = data;

    //         // removing spinner 
    //         renderSpinner('job-list');

    //         // render job details
    //         renderJobDetails(jobItem);
    //     })
    //     .catch(error => {
    //         renderSpinner('job-details');
    //         renderError(error.message);
    //     });
}

jobListSearchEl.addEventListener('click', clickHandler);
jobListBookmarksEl.addEventListener('click', clickHandler);


export default renderJobList;
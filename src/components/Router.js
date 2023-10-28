import {
    BASE_API_URL, 
    jobDetailsContentEl,
    state,
    getData
} from '../common.js';
import renderSpinner from './Spinner.js';
import renderJobDetails from './JobDetails.js';
import renderError from './Error.js';
import renderJobList from './JobList.js';

const loadHashChangeHandler = async () => {
    // getting id from the url
    const id = window.location.hash.substring(1);

    if(id) {
        document.querySelector('.job-item--active')?.classList.remove('job-item--active');

        // removing previous job details content
        jobDetailsContentEl.innerHTML = '';

        // adding the spinner
        renderSpinner('job-list');

        try {
            // fetch job item data 
            const data = await getData(`${BASE_API_URL}/jobs/${id}`);

            // extracting job item from data using destructuring 
            const { jobItem } = data;

            // update the state 
            state.activeJobItem = jobItem;

            // render search job list
            renderJobList();

            // removing the spinner (toggling it)
            renderSpinner('job-list');

            // rendering job details 
            renderJobDetails(jobItem);
        }

        catch (error) {
            renderSpinner('job-details');
            renderError(error.message);
        }
    }
};

window.addEventListener('DOMContentLoaded', loadHashChangeHandler);
window.addEventListener('hashchange', loadHashChangeHandler);
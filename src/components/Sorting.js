import {
    sortingEl,
    sortingBtnRecentEl,
    sortingBtnRelevantEl,
    state
} from '../common.js';
import renderJobList from './JobList.js';
import renderPaginationButtons from './Pagination.js';

const clickHandler = event => {
    // get clicked button element 
    const clickedButtonEl = event.target.closest('.sorting__button'); 

    // stopping the function if no clicked button element 
    if(!clickedButtonEl) return;

    // update state (reset to page 1)
    state.currentPage = 1;

    // checking if intention is recent or relevant sorting 
    const recent = clickedButtonEl.className.includes('--recent') ? true : false;

    // making sorting button look active/ inactive
    if(recent) {
        sortingBtnRecentEl.classList.add('sorting__button--active');
        sortingBtnRelevantEl.classList.remove('sorting__button--active');
    } else {
        sortingBtnRelevantEl.classList.add('sorting__button--active');
        sortingBtnRecentEl.classList.remove('sorting__button--active');
    }

    // sort job items
    if(recent) {
        state.searchJobItems.sort((a,b) => {
            return a.daysAgo - b.daysAgo;
        });
    } else {
        state.searchJobItems.sort((a, b) => {
            return b.relevanceScore - a.relevanceScore;
        });
    }

    // reset pagination buttons 
    renderPaginationButtons();

    // rendering job items in list 
    renderJobList();
};

sortingEl.addEventListener('click', clickHandler);

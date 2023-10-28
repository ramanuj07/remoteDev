import {
    state,
    bookmarksBtnEl,
    jobDetailsEl,
    jobListBookmarksEl
} from '../common.js';
import renderJobList from './JobList.js';

const clickHandler = event => {
    if(!event.target.className.includes('bookmark')) return;

    // update state 
    if(state.bookmarkJobItems.some(bookmarkJobItem => bookmarkJobItem.id === state.activeJobItem.id)) {
        state.bookmarkJobItems = state.bookmarkJobItems.filter(bookmarkJobItem => bookmarkJobItem.id !== state.activeJobItem.id);
    } else {
        state.bookmarkJobItems.push(state.activeJobItem);
    }

    // persisting data with local storage 
    localStorage.setItem('bookmarkJobItems', JSON.stringify(state.bookmarkJobItems));

    // update bookmark icon
    document.querySelectorAll('.job-info__bookmark-icon').forEach(jobItemWithActiveClass => jobItemWithActiveClass.classList.toggle('job-info__bookmark-icon--bookmarked'));

    // rendering job list 
    renderJobList();
};

const mouseEnterHandler = () => {
    // make bookmarks button look active
    bookmarksBtnEl.classList.add('bookmarks-btn--active');

    // make job list in bookmarks visible
    jobListBookmarksEl.classList.add('job-list--visible');

    // rendering bookmarks job list 
    renderJobList('bookmarks');
};

const mouseLeaveHandler = () => {
    // make bookmarks button --> inactive
    bookmarksBtnEl.classList.remove('bookmarks-btn--active');

    // make job list in bookmarks invisible
    jobListBookmarksEl.classList.remove('job-list--visible');
};

jobDetailsEl.addEventListener('click', clickHandler);
bookmarksBtnEl.addEventListener('mouseenter', mouseEnterHandler);
jobListBookmarksEl.addEventListener('mouseleave', mouseLeaveHandler);
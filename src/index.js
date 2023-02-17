import { Notify } from "notiflix";
import axios from "axios";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');
let thisGallery = new SimpleLightbox('.gallery a');

const URL = 'https://pixabay.com/api/';
let url = URL;
const parameters = {
    key: '33689552-2c019ac385bff48f263084117',
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true, 
    page: 1,
    per_page: 4,
}
// const searchParameters = new URLSearchParams(parameters);
// const url = `${URL}?${searchParameters}`;


formEl.addEventListener('submit', submitForm);
loadMoreEl.addEventListener('click', loadMore);

function loadMore(e) {
    console.log(parameters.page);
    const searchParameters = new URLSearchParams(parameters);
    url = `${URL}?${searchParameters}`;
    fetchPhotos(url)
        .then(noPhotos)
        .then(drawPhotos)
        .catch(() => { })
    return url;
}

// const searchParameters = new URLSearchParams(parameters);
// url = `${URL}?${searchParameters}`;
    
function submitForm(e) {
    e.preventDefault();
    galleryEl.innerHTML = '';
    parameters.page = 1;
    parameters.q = e.currentTarget.elements.searchQuery.value.trim();
    if (parameters.q === '') {
        Notify.warning('Type some text to find some pics');
        return;
    }
    const searchParameters = new URLSearchParams(parameters);
    url = `${URL}?${searchParameters}`;
    // console.log(url);
    fetchPhotos(url)
        .then(noPhotos)
        .then(drawPhotos)
        .catch(() => { })
    return url;
};

function fetchPhotos(url) {
    return fetch(url)
        .then(response => {  
            // console.log(response.json());
    if (!response.ok) {
        throw new Error(Notify.failure('Sorry, some server error. Please try again.'));
            }
    return response.json();
});
};

function noPhotos(response) {
    if (response.totalHits === 0) {
        throw new Error(Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        )
    };
    if (parameters.page === 1) {
        Notify.info(`Hooray! We found ${response.totalHits} images.`)
    };
        return response;
};

function drawPhotos(list) {
    // galleryEl.innerHTML = '';
    console.log(list.hits);
    const markup = list.hits
        .map(({ webformatURL, largeImageURL, tags, likes, views, comments, downloads}) =>
            `<a href="${largeImageURL}">
             <img src="${webformatURL}" alt="${tags}" loading="lazy" />
             <div class="info">
               <p class="info-item">
                 <b>Likes </b><span>${likes}</span>
               </p>
               <p class="info-item">
                 <b>Views </b><span>${views}</span>
               </p>
               <p class="info-item">
                 <b>Comments </b><span>${comments}</span>
               </p>
               <p class="info-item">
                 <b>Downloads </b><span>${downloads}</span>
               </p>
             </div>
            </a>`
        )
        .join('');
    // galleryEl.innerHTML = markup;
    galleryEl.insertAdjacentHTML('beforeend', markup);
    thisGallery.refresh();
    // let thisGallery = new SimpleLightbox('.gallery a');
    parameters.page += 1;
    // listEl.removeEventListener('mouseover', cardFromList);
    // listEl.addEventListener('mouseover', cardFromList);
    throw new Error();
};

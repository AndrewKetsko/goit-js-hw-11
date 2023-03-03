import { Notify } from "notiflix";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { fetchPhotos } from "./js/fetchPhotos";

const formEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const richEndEl = document.querySelector('.rich-end');
const observer = new IntersectionObserver(observeFunc);
let thisGallery = new SimpleLightbox('.gallery a');
let totalPics = 0;

const URL = 'https://pixabay.com/api/';
const parameters = {
    key: '33689552-2c019ac385bff48f263084117',
    q: '',
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page: 1,
    per_page: 40,
};

formEl.addEventListener('submit', submitForm);

function observeFunc(e) {
    if (e[0].isIntersecting) {
        loadMore();
    }
};

function submitForm(e) {
    e.preventDefault();
    if (parameters.q !== '' && parameters.q === e.currentTarget.elements.searchQuery.value.trim()) {
        Notify.info('Type some new search query please');
        return;
    }
    richEndEl.classList.add('hidden');
    galleryEl.innerHTML = '';
    parameters.page = 1;
    parameters.q = e.currentTarget.elements.searchQuery.value.trim();
    if (parameters.q === '') {
        Notify.warning('Type some text to find some pics');
        return;
    }
    const searchParameters = new URLSearchParams(parameters);
    fetchPhotos(`${URL}?${searchParameters}`)
        .then(noPhotos)
        .then(()=>{observer.observe(richEndEl)})
        .then(drawPhotos)
        .catch(() => { })
};

function loadMore(e) {
    const searchParameters = new URLSearchParams(parameters);
    fetchPhotos(`${URL}?${searchParameters}`)
        .then(drawPhotos)
        .catch(() => { })
}

// async function fetchPhotos(url) {
//     try {
//         const response = await axios.get(url);
//         return response.data;
//     } catch (error) {
//         Notify.failure('Sorry, some server error. Please try again.')
//     };
// };

function noPhotos(response) {
    totalPics = response.totalHits;
    if (totalPics === 0) {
        throw new Error(Notify.failure('Sorry, there are no images matching your search query. Please try again.')
        )
    };
    if (parameters.page === 1) {
        Notify.info(`Hooray! We found ${totalPics} images.`)
    };
        return response;
};

function drawPhotos(list) {
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
    galleryEl.insertAdjacentHTML('beforeend', markup);
    thisGallery.refresh();
    const richEnd = totalPics - parameters.page * parameters.per_page;
    if (richEnd < 0) {
        richEndEl.classList.remove('hidden');
        observer.unobserve(richEndEl);
        return;
    }
    parameters.page += 1;
    richEndEl.classList.add('hidden');
    throw new Error();
};

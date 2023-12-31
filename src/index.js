import { PhotoAPI } from './API';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
    formEl: document.querySelector('#search-form'),
    galleryEl: document.querySelector('.gallery'),
    btnEl: document.querySelector('.load-button'),
};

refs.formEl.addEventListener('submit', onFormElSubmit);
refs.btnEl.addEventListener('click', onBtnElClick);
refs.btnEl.classList.add('visually-hidden');


let simpleLightbox = new SimpleLightbox('.gallery a');
const photoApi = new PhotoAPI();

async function onBtnElClick() {
    photoApi.page += 1;

    const res = await photoApi.fetchPhoto();
    try {
        if (res.hits.length === 0) {
            refs.btnEl.classList.add('visually-hidden');
            throw "We're sorry, but you've reached the end of search results.";
        }

        renderPics(res.hits);

        simpleLightbox.refresh();

        const { height: cardHeight } = document
            .querySelector('.gallery')
            .firstElementChild.getBoundingClientRect();

        window.scrollBy({
            top: cardHeight * 2,
            behavior: 'smooth',
        });
    } catch (err) {
        // Notiflix.Notify.warning(err);
        console.log('error')
    }
}

async function onFormElSubmit(e) {
    e.preventDefault();

    const userValue = e.target.elements.searchQuery.value;

    photoApi.q = userValue;

    photoApi.page = 1;

    const res = await photoApi.fetchPhoto();
    try {
        if (res.hits.length === 0) {
            refs.btnEl.classList.add('visually-hidden');
            throw 'Sorry, there are no images matching your search query. Please try again.';
        }
        Notiflix.Notify.success(`Hooray! We found ${res.totalHits} images.`);
        renderPics(res.hits);

        simpleLightbox.refresh();

        photoApi.totalPage = Math.ceil(res.totalHits / PhotoAPI.PER_PAGE);

        refs.btnEl.classList.remove('visually-hidden');
        // updateBtnVision()
    } catch (err) {
        // console.log('error')
        // console.log(err)
        Notiflix.Notify.failure(err);
    }
}

function updateBtnVision() {
    if (photoApi.page >= photoApi.totalPage) {
        refs.btnEl.classList.add('visually-hidden');
    } else {
        refs.btnEl.classList.remove('visually-hidden');
    }
}


function renderPics(pics) {

    const markup = pics.map(el => {
        const {
            webformatURL,
            largeImageURL,
            tags,
            likes,
            views,
            comments,
            downloads,
        } = el;
        return `<a href="${largeImageURL}"><div class="photo-card">
            <img src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item">
                <b>Likes</b>
                <span>${likes}</span>
              </p>
              <p class="info-item">
                <b>Views</b>
                <span>${views}</span>
              </p>
              <p class="info-item">
                <b>Comments</b>
                <span>${comments}</span>
              </p>
              <p class="info-item">
                <b>Downloads</b>
                <span>${downloads}</span>
              </p>
            </div>
          </div></a>`;
    }).join('')
    return refs.galleryEl.innerHTML = markup;
}
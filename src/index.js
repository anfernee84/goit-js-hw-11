import { getPictures, stopFlag } from './fetchFunction';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderGallery } from './renderFunction';

const inputForm = document.querySelector('#search-form');
const loadMoreButton = document.querySelector('#load-more-button');
const gallery = document.querySelector('.gallery');
let sumHits;
let page = 1;
let currentQuery = '';
let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

inputForm.addEventListener('submit', submitHandler);

async function submitHandler(e) {
  e.preventDefault();
  page = 1;
  currentQuery = e.currentTarget.searchQuery.value;
  if (!currentQuery) return;
  const response = await getPictures(currentQuery, 1);
  if (response.total > 0) {
    sumHits = response.hits.length;
    console.log(response);
    loadMoreButton.hidden = false;
    Notiflix.Notify.success(`Hooray! We found ${response.total} images.`);
    gallery.innerHTML = '';
    const markup = renderGallery(response.hits);
    gallery.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
  } else {
    gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    loadMoreButton.hidden = true;
  }
}

loadMoreButton.addEventListener('click', moreButtonHandler);

async function moreButtonHandler() {
  page++;
  const response = await getPictures(currentQuery, page);
  console.log(response);
  sumHits += response.hits.length;
  if (stopFlag == 400 || sumHits > response.totalHits) {
    loadMoreButton.hidden = true;
    Notiflix.Notify.info('This is the end...');
    return;
  }
  const markup = renderGallery(response.hits);
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

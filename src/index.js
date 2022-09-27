import { getPictures, stopFlag } from './fetchFunction';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// import template from './templates/template.hbs';

let inputForm = document.querySelector('#search-form');
let loadMoreButton = document.querySelector('#load-more-button');
let gallery = document.querySelector('.gallery');

let page = 1;
let currentQuery = '';
let lightbox = new SimpleLightbox('.card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

inputForm.addEventListener('submit', submitHandler);

async function submitHandler(e) {
  e.preventDefault();
  currentQuery = e.currentTarget.searchQuery.value;
  if (!currentQuery) return;
  const response = await getPictures(currentQuery, 1);
  if (response.total > 0) {
    console.log(response);
    loadMoreButton.hidden = false;
    Notiflix.Notify.success(`Hooray! We found ${response.total} images.`);
    gallery.innerHTML = '';
    renderGallery(response.hits);
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
  if (stopFlag == 400) {
    loadMoreButton.hidden = true;
    Notiflix.Notify.info('This is the end... Hold your breath and count to 10');
    return;
  }
  renderGallery(response.hits);
}

function renderGallery(elements) {
  const markup = elements
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
  <a href="${largeImageURL}">
    <img class="photo-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b>
      ${likes}
    </p>
    <p class="info-item">
      <b>Views</b>
      ${views}
    </p>
    <p class="info-item">
      <b>Comments</b>
      ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b>
      ${downloads}
    </p>
  </div>
  </div>`;
      }
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

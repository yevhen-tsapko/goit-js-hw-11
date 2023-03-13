import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const axios = require('axios/dist/browser/axios.cjs');

const refs = {
  form: document.querySelector('.search-form'),
  searchButton: document.querySelector('button[type=submit]'),
  loadMore: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};
const key = '34336743-d2a2c454c2eb7df7235afc475';
let page = 1;
let searchWord = '';
let totalPages = 0;

function onSubmit(evt) {
  page = 1;
  evt.preventDefault();
  searchWord = evt.currentTarget.elements.searchQuery.value;

  if (searchWord)
    fetchSearch(searchWord).then(({ hits, totalHits }) => {
      totalPages = Math.ceil(totalHits / 40);
      if (hits.length === 0) {
        refs.gallery.innerHTML = '';
        hideAddMoreButton();
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        refs.gallery.innerHTML = createMarkup(hits);
        refs.loadMore.classList.add('visible');
        refs.loadMore.addEventListener('click', onClickAddMore);
      }
    });
}
function onClickAddMore() {
  if (page > totalPages) {
    hideAddMoreButton();
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    console.log('totalPages', totalPages);
    fetchSearch(searchWord).then(hits => {
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits.hits));
      refs.loadMore.classList.add('visible');
      refs.loadMore.addEventListener('click', onClickAddMore);
    });
  }
}
function hideAddMoreButton() {
  console.log('HIDing');
  refs.loadMore.classList.remove('visible');
  refs.loadMore.removeEventListener('click', onClickAddMore);
}
function fetchSearch(searchWord) {
  return axios
    .get(
      `https:pixabay.com/api/?key=${key}&q=${searchWord}&image_type=photo&orientation=horizontal&safeseach=true&page=${page}&per_page=40`
    )
    .then(response => {
      console.log(response);
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
}
refs.form.addEventListener('submit', onSubmit);

function createMarkup(cards) {
  page += 1;
  return cards
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" width=100% loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes</b> ${likes}
    </p>
    <p class="info-item">
      <b>Views</b> ${views}
    </p>
    <p class="info-item">
      <b>Comments</b> ${comments}
    </p>
    <p class="info-item">
      <b>Downloads</b> ${downloads}
    </p>
  </div>
</div>`
    )
    .join('');
}

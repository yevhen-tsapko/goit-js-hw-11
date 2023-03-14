import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import ScrollWatch from 'scrollwatch';

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
let lightbox;
let swInstance;

function onSubmit(evt) {
  page = 1;
  evt.preventDefault();
  searchWord = evt.currentTarget.elements.searchQuery.value;

  if (searchWord)
    fetchSearch(searchWord).then(({ hits, totalHits }) => {
      totalPages = Math.ceil(totalHits / 40);
      if (hits.length === 0) {
        refs.gallery.innerHTML = '';
        // hideAddMoreButton();
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        Notify.success(`Hooray! We found ${totalHits} images.`);
        refs.gallery.innerHTML = createMarkup(hits);
        lightbox = new SimpleLightbox('.gallery a', {});
        // make AddMoreButton visible
        // refs.loadMore.classList.add('visible');
        // refs.loadMore.addEventListener('click', addElements);

        swInstance = new ScrollWatch({
          watch: 'a',
          infiniteScroll: true,
          infiniteOffset: 200,
          onInfiniteYInView: addElements,
        });
      }
    });
}

// function addElements() {
//   onClickAddMore();
//  }

function addElements() {
  if (page > totalPages) {
    // hideAddMoreButton();
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    fetchSearch(searchWord).then(hits => {
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits.hits));
      lightbox.refresh();
      swInstance.refresh();
      // const { height: cardHeight } =
      //   refs.gallery.firstElementChild.getBoundingClientRect();

      // window.scrollBy({
      //   top: cardHeight * 2,
      //   behavior: 'smooth',
      // });
    });
  }
}
// function hideAddMoreButton() {
//   refs.loadMore.classList.remove('visible');
//   refs.loadMore.removeEventListener('click', onClickAddMore);
// }
function fetchSearch(searchWord) {
  return axios
    .get(
      `https:pixabay.com/api/?key=${key}&q=${searchWord}&image_type=photo&orientation=horizontal&safeseach=true&page=${page}&per_page=40&min_height=100`
    )
    .then(response => response.data)
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
        `<a class="gallery__item" href="${largeImageURL}"><div class="photo-card">
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
</div></a>`
    )
    .join('');
}

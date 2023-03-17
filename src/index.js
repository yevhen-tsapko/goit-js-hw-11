import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ScrollWatch from 'scrollwatch';
import addLightBox from './simpleLightBox';
import fetchSearch from './fetchSeach';
import createMarkup from './createMarkup';

const refs = {
  form: document.querySelector('.search-form'),
  searchButton: document.querySelector('button[type=submit]'),
  loadMore: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};
const notifyOptions = {
  width: '360px',
  timeout: 2000,
  position: 'center-center',
  fontSize: '18px',
};

let page = 1;
let searchWord = '';
let totalPages = 0;
let swInstance;
let lightbox;

async function onSubmit(evt) {
  page = 1;
  evt.preventDefault();
  searchWord = evt.currentTarget.elements.searchQuery.value.trim();
  if (!searchWord) {
    return;
  }

  const { hits, totalHits } = await fetchSearch(searchWord, page);
  totalPages = Math.ceil(totalHits / 40);
  if (hits.length === 0) {
    refs.gallery.innerHTML = '';
    // hideAddMoreButton();
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.',
      notifyOptions
    );
  } else {
    Notify.success(`Hooray! We found ${totalHits} images.`, notifyOptions);
    refs.gallery.innerHTML = createMarkup(hits);
    page += 1;
    lightbox = addLightBox();

    swInstance = new ScrollWatch({
      infiniteScroll: true,
      infiniteOffset: 200,
      onInfiniteYInView: addElements,
    });
  }
}

async function addElements() {
  if (page > totalPages) {
    // hideAddMoreButton();
    Notify.failure(
      "We're sorry, but you've reached the end of search results.",
      notifyOptions
    );
  } else {
    const { hits } = await fetchSearch(searchWord, page);
    refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
    page += 1;
    lightbox.refresh();
    swInstance.refresh();
  }
}

refs.form.addEventListener('submit', onSubmit);

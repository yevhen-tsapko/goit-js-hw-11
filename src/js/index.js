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

let page = 1;
let searchWord = '';
let totalPages = 0;
let swInstance;

function onSubmit(evt) {
  page = 1;
  evt.preventDefault();
  searchWord = evt.currentTarget.elements.searchQuery.value;

  if (searchWord)
    fetchSearch(searchWord, page).then(({ hits, totalHits }) => {
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
        page += 1;
        lightbox = addLightBox();

        swInstance = new ScrollWatch({
          infiniteScroll: true,
          infiniteOffset: 200,
          onInfiniteYInView: addElements,
        });
      }
    });
}

function addElements() {
  if (page > totalPages) {
    // hideAddMoreButton();
    Notify.failure(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    fetchSearch(searchWord, page).then(({ hits }) => {
      refs.gallery.insertAdjacentHTML('beforeend', createMarkup(hits));
      page += 1;
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

refs.form.addEventListener('submit', onSubmit);

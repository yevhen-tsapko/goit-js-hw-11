const refs = {
  form: document.querySelector('.search-form'),
  searchButton: document.querySelector('button[type=submit]'),
  gallery: document.querySelector('.gallery'),
};
const key = '34336743-d2a2c454c2eb7df7235afc475';

function onSubmit(evt) {
  evt.preventDefault();
  const searchWord = evt.currentTarget.elements.searchQuery.value;
  if (searchWord)
    fetchSearch(searchWord).then(({ hits }) => {
      // console.log(cards);
      renderCards(hits);
      // return cards;
    });
}
function fetchSearch(searchWord) {
  return fetch(
    `https:pixabay.com/api/?key=${key}&q=${searchWord}&image_type=photo&orientation=horizontal&safeseach=true`
  )
    .then(response => {
      // console.log(response);
      return response.json();
    })
    .catch(error => {
      console.log(error);
    });
}
refs.form.addEventListener('submit', onSubmit);

function renderCards(cards) {
  refs.gallery.innerHTML = cards
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

function renderOneCard({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  refs.gallery.innerHTML = `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
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
</div>`;
}

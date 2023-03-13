import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
export let gallery = new SimpleLightbox('.gallery a');

export function onImgClick(evt) {
  evt.preventDefault();
  getImg(evt);
  expandImage(evt);
}
export function getImg(evt) {
  if (evt.target.nodeName !== 'IMG') return;
  evt.target.src = evt.target.dataset.source;
}
export function expandImage(evt) {
  instance = basicLightbox.create(`
  <img
    src="${evt.target.dataset.source}"
    alt="${evt.target.description}"
      />
    `);
  instance.show();
  window.addEventListener('keydown', onEscapeClick);
}
export function onEscapeClick(evt) {
  if (evt.code === 'Escape') {
    instance.close();
  }
}

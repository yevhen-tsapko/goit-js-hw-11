function sowAddMoreButton() {
  refs.loadMore.classList.add('visible');
  refs.loadMore.addEventListener('click', addElements);
}
function hideAddMoreButton() {
  refs.loadMore.classList.remove('visible');
  refs.loadMore.removeEventListener('click', addElements);
}

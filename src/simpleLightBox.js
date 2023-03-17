import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
// let lightbox;
export default function addLightBox() {
  return new SimpleLightbox('.gallery a');
}

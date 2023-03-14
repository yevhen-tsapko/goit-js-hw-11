import ScrollWatch from 'scrollwatch';
let swInstance;
export default function createInfiniteScroll() {
  return new ScrollWatch({
    infiniteScroll: true,
    infiniteOffset: 200,
    onInfiniteYInView: addElements,
  });
}

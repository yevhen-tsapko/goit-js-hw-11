import axios from 'axios';
const key = '34336743-d2a2c454c2eb7df7235afc475';

export default async function fetchSearch(searchWord, page) {
  const { data } = await axios(
    `https:pixabay.com/api/?key=${key}&q=${searchWord}&image_type=photo&orientation=horizontal&safeseach=true&page=${page}&per_page=40`
  );
  return data;
}

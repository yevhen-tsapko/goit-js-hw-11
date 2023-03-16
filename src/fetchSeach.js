const axios = require('axios/dist/browser/axios.cjs');
const key = '34336743-d2a2c454c2eb7df7235afc475';
// let page = 1;

export default function fetchSearch(searchWord, page) {
  return axios
    .get(
      `https:pixabay.com/api/?key=${key}&q=${searchWord}&image_type=photo&orientation=horizontal&safeseach=true&page=${page}&per_page=40&min_height=100`
    )
    .then(response => response.data)
    .catch(error => {
      console.log(error);
    });
}

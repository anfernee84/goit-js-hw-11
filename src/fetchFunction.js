import axios from 'axios';
let stopFlag = '';

async function getPictures(searchParams, pageNum) {
  try {
    return await axios
      .get(
        `https://pixabay.com/api/?key=30184505-7ca241c41e8b4ea4cd61cd229&q=${searchParams}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNum}&per_page=40`
      )
      .then(res => {
        // console.log(res.data.hits);
        return res.data;
      });
  } catch (error) {
    // console.error(error.response.status);
    stopFlag = error.response.status;
  }
}

export { getPictures, stopFlag };

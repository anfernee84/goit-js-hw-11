import axios from 'axios';
let stopFlag = '';

// async function getPictures(searchParams, pageNum) {
//   try {
//     return await axios
//       .get(
//         `https://pixabay.com/api/?key=30184505-7ca241c41e8b4ea4cd61cd229&q=${searchParams}&image_type=photo&orientation=horizontal&safesearch=true&page=${pageNum}&per_page=40`
//       )
//       .then(res => {
//         // console.log(res.data.hits);
//         return res.data;
//       });
//   } catch (error) {
//     // console.error(error.response.status);
//     stopFlag = error.response.status;
//   }
// }

const options = new URLSearchParams();
options.set('image_type', 'photo');
options.set('orientation', 'horizontal');
options.set('sefesearch', 'true');
options.set('per_page', 40);

function onGetCall(config) {
  return config.method === 'get';
}

function addApiKey(config) {
  config.url += '&key=30184505-7ca241c41e8b4ea4cd61cd229';
  return config;
}
axios.interceptors.request.use(addApiKey, null, { runWhen: onGetCall });
async function getPictures(searchParams, pageNum) {
  try {
    return await axios
      .get(
        `https://pixabay.com/api/?q=${searchParams}&${options}&page=${pageNum}`
      )
      .then(res => {
        return res.data;
      });
  } catch (error) {
    stopFlag = error.response.status;
  }
}

export { getPictures, stopFlag };

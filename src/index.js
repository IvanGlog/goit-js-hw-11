
import { createGallery } from './js/createGallery';
import NewsApiService from './js/fetchImages';
import LoadMoreBtn from './js/components/load-more-btn';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('#search-form'),
  articlesContainer: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
};

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

const newsApiService = new NewsApiService();
const bootstrap = require('bootstrap');

refs.form.addEventListener('submit', onFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMore);

async function onFormSubmit(e) {
  e.preventDefault();

  newsApiService.query = e.currentTarget.elements.searchQuery.value.trim();

  if (newsApiService.query === '') {
    Notify.warning('The search query is empty. Please try again.');
    return;
  }


  loadMoreBtn.disable();

  newsApiService.resetPage();

  clearArticlesContainer();

  try {
    const data = await newsApiService.fetchImages();
    const array = data.hits; //! ?? await //??
    const markup = onGalleryMarkup(array);


    if (Number(data.totalHits) === 0) {
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      loadMoreBtn.hide();
      return;
    }

  
    const numberPages = Math.ceil(data.totalHits / newsApiService.perPage);
    if (newsApiService.page <= numberPages) {
      loadMoreBtn.show();
      loadMoreBtn.enable();
    }

    Notify.success(`Hooray! We found ${data.totalHits} images.`);

    return markup;
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return error;
  }
}


async function onLoadMore() {
  loadMoreBtn.disable();

  try {
    const data = await newsApiService.fetchImages();

   
    const numberPages = Math.ceil(data.totalHits / newsApiService.perPage);
    if (newsApiService.page > numberPages) {
      loadMoreBtn.hide();
      loadMoreBtn.disable();
      Notify.info("We're sorry, but you've reached the end of search results.");
    }

    const array = data.hits;
    const markup = onGalleryMarkup(array);
    return markup;
  } catch (error) {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return error;
  }
}


function onGalleryMarkup(images) {
  const galleryMarkup = createGallery(images);

  refs.articlesContainer.insertAdjacentHTML('beforeend', galleryMarkup);

  loadMoreBtn.enable();

  gallery.refresh();
}

function clearArticlesContainer() {
  refs.articlesContainer.innerHTML = '';
}


const gallery = new SimpleLightbox('.gallery a', {
  captionDelay: 250,
  overlayOpacity: 0.8,
  closeText: '☣',
  scrollZoom: false,
});

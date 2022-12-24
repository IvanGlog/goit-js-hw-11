'use strict';

export function lazyLoading() {
  const lazyImages = document.querySelectorAll('img[data-src]');
  //?const lazyImages = Array.from(document.querySelectorAll('img[data-src]'));
  const windowHeight = document.documentElement.clientHeight; //Висота екрана без скрола

  let lazyImagesPositions = [];

  if (lazyImages === null) {
    return;
  } else if (lazyImages.length > 0) {
    lazyImages.forEach(img => {
      if (img.dataset.src) {
        lazyImagesPositions.push(img.getBoundingClientRect().top + scrollY);
      }
    });
    lazyScrollCheck();
  }

  window.addEventListener('scroll', lazyScroll);

  function lazyScroll() {
    if (document.querySelectorAll('img[data-src]').length > 0) {
      lazyScrollCheck();
    }
  }

  //   function lazyScrollCheck() {
  //     let imgIndex = lazyImagesPositions.findIndex(
  //       item => pageYOffset > item - windowHeight
  //     ); //pageYOffset ↔ scrollY

  //     if (imgIndex >= 0) {
  //       if (lazyImages[imgIndex].dataset.src) {
  //         lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
  //         lazyImages[imgIndex].removeAttribute('data-src');
  //       }
  //       delete lazyImagesPositions[imgIndex];
  //     }
  //   }

  function lazyScrollCheck() {
    let imagesIndexes = [];
    lazyImagesPositions.forEach((imagePosition, index) => {
      if (scrollY > imagePosition - windowHeight) {
        imagesIndexes.push(index);
      }
    });
    if (imagesIndexes.length > 0) {
      imagesIndexes.forEach(imgIndex => {
        if (lazyImages[imgIndex].dataset.src) {
          lazyImages[imgIndex].src = lazyImages[imgIndex].dataset.src;
          lazyImages[imgIndex].removeAttribute('data-src');
        }
        delete lazyImagesPositions[imgIndex];
      });
    }
  }
}

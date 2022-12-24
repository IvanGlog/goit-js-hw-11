export function makeTitle(pageURL) {
  //! Фукнкція із pageURL робить Title для зображення !!

  const string = pageURL
    .replace('https://pixabay.com/photos/', '')
    .slice(0, pageURL.length - 35)
    .replaceAll('-', ' ')
    .trim()
    .split(' ');

  const withoutDuplicates = [...new Set(string)].join(' ');
  // const array = withoutDuplicates.split(''); //! Два варіанта перевести строку в масив
  const array = [...withoutDuplicates];
  const firstLetterInUpperCase = array.shift().toUpperCase();
  const withOutFirstLetter = array.slice(0, array.length).join('');
  const title = firstLetterInUpperCase + withOutFirstLetter;

  return title;
}

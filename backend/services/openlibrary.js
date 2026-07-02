import apiFetch from './api.js';

export async function searchBook(query) {
  const response = await apiFetch(
    `https://openlibrary.org/search.json?q=${query}&limit=10`,
  );
  const data = response.docs;
  const result = data.map((book) => ({
    title: book.title,
    author: book.author_name,
    image: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
    first_publish_year: book.first_publish_year,
  }));
  return result;
}

export async function getBookDetails(id) {
  const details = await apiFetch(`https://openlibrary.org/works/${id}.json`);
  const authorKey = details.authors[0].author.key;
  const author = await apiFetch(
    `https://openlibrary.org/authors${authorKey}.json`,
  );

  return {
    title: details.title,
    author_name: author.name,
    description:
      typeof details.description === 'string'
        ? details.description
        : details.description?.value,
    image: `https://covers.openlibrary.org/b/id/${details.covers?.[0]}-L.jpg`,
    genre: details.subjects,
    series: details.series?.[0]?.series?.key,
  };
}

import React, { useEffect, useState } from 'react';
import { hasuraSearchArticles } from '../../lib/articles.js';

export default function ModalArticleSearch(props) {
  const [isLoading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  function selectArticle(article) {
    props.setFeaturedArticle(article);
    props.setModal(false);
  }

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);

    const { errors, data } = await hasuraSearchArticles({
      url: props.apiUrl,
      site: props.site,
      localeCode: props.locale,
      term: searchTerm,
    });

    if (errors && !data) {
      console.error(errors);
    }
    console.log('data:', data);
    setLoading(false);
    setSearchResults(data.articles);
  }

  return (
    <div className={`modal ${props.isActive ? 'is-active' : ''}`}>
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Find a new featured article</p>
          <button
            className="delete"
            aria-label="close"
            onClick={() => props.setModal(false)}
          ></button>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSearch}>
            <div className={`control ${isLoading ? 'is-loading' : ''}`}>
              <input
                className="input"
                type="text"
                placeholder="Search by headline"
                onChange={(ev) => setSearchTerm(ev.target.value)}
              />
            </div>
          </form>
          <ul>
            {searchResults.map((result) => (
              <li key={result.id} onClick={() => selectArticle(result)}>
                {result.article_translations[0].headline}
              </li>
            ))}
          </ul>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success">Save changes</button>
          <button className="button" onClick={() => props.setModal(false)}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
}

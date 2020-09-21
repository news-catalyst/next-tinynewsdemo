import React, { useState } from 'react';
import { searchArticles } from '../../lib/articles.js';

export default function ModalArticleSearch(props) {
  const [isLoading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  console.log('ModalArticleSearch props:', props);

  function selectArticle(article) {
    console.log(
      'changing featured article from:',
      props.featuredArticle,
      'to:',
      article
    );
    props.setFeaturedArticle(article);
    props.setModal(false);
  }

  async function handleSearch(event) {
    event.preventDefault();
    setLoading(true);

    console.log('handling search...', event);
    const results = await searchArticles(
      props.apiUrl,
      props.apiToken,
      searchTerm
    );
    console.log('results: ', results);
    setLoading(false);
    setSearchResults(results);
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
                {result.headline}
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
// <article className="message">
//   <div className="message-header">
//     <p>Feature an Article</p>
//     <button
//       className="delete"
//       onClick={() => setEditing(false)}
//     ></button>
//   </div>
//   <div className="message-body">
//     {isSaving ? (
//       <>
//         <h2 className="subtitle">
//           Saving and publishing new homepage data...
//         </h2>
//         <progress
//           className="progress is-medium is-dark"
//           max="100"
//         >
//           45%
//         </progress>
//       </>
//     ) : (
//       <>
//       </>
//     )}
//   </div>
// </article>

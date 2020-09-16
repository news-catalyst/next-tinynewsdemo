import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useAmp } from 'next/amp';
import { siteMetadata } from '../../lib/siteMetadata.js';
import Layout from '../Layout.js';
import FeaturedArticleLink from './FeaturedArticleLink.js';
import ArticleLink from './ArticleLink.js';
import GlobalNav from '../nav/GlobalNav.js';
import GlobalFooter from '../nav/GlobalFooter.js';
import FeaturedSidebar from './FeaturedSidebar.js';
import { searchArticles } from '../../lib/articles.js';

export default function BigFeaturedStory(props) {
  const [isEditing, setEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const [featuredArticle, setFeaturedArticle] = useState(
    props.articles['featured']
  );
  const [streamArticles, setStreamArticles] = useState(
    props.articles['stream']
  );

  const isAmp = useAmp();

  async function handleSearch(event) {
    event.preventDefault();
    console.log('handling search...', event);
    const results = await searchArticles(
      props.apiUrl,
      props.apiToken,
      searchTerm
    );
    console.log('results: ', results);
    setSearchResults(results);
  }

  // I noticed that `streamArticles` were null or undefined on occasional page loads
  // using this hook seems to fix the load order issue; the useState calls could probably
  // default to `useState(null)` but I figured I'd leave them as-is.
  useEffect(() => {
    setFeaturedArticle(props.articles['featured']);
    setStreamArticles(props.articles['stream']);
  }, [props.articles]);

  const tagLinks = props.tags.map((tag) => (
    <Link key={tag.title} href={`/tags/${tag.slug}`}>
      <a className="panel-block is-active">{tag.title}</a>
    </Link>
  ));

  return (
    <div className="homepage">
      <Layout meta={siteMetadata}>
        <GlobalNav
          metadata={siteMetadata}
          tags={props.tags}
          sections={props.sections}
        />
        <div className="featured-article">
          <div className="columns">
            <div className="column is-two-thirds">
              {isEditing ? (
                <article className="message">
                  <div className="message-header">
                    <p>Feature an Article</p>
                    <button
                      className="delete"
                      onClick={() => setEditing(false)}
                    ></button>
                  </div>
                  <div className="message-body">
                    <form onSubmit={handleSearch}>
                      <input
                        className="input"
                        type="text"
                        placeholder="Search by headline"
                        onChange={(ev) => setSearchTerm(ev.target.value)}
                      />
                    </form>
                    <ul>
                      {searchResults.map((result) => (
                        <li key={result.id}>{result.headline.value}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ) : (
                <div onClick={() => setEditing(true)}>
                  <div id="featuredArticle">
                    {featuredArticle && (
                      <FeaturedArticleLink
                        key={featuredArticle.id}
                        article={featuredArticle}
                        amp={isAmp}
                      />
                    )}
                  </div>
                </div>
              )}
              {!props.editable && featuredArticle && (
                <FeaturedArticleLink
                  key={featuredArticle.id}
                  article={featuredArticle}
                  amp={isAmp}
                />
              )}
            </div>
            <div className="column is-one-third">
              <FeaturedSidebar />
            </div>
          </div>
        </div>
        <section className="section">
          <div className="columns">
            <div className="column is-three-quarters">
              {streamArticles &&
                streamArticles.map((streamArticle) => (
                  <ArticleLink
                    key={streamArticle.id}
                    article={streamArticle}
                    amp={isAmp}
                  />
                ))}
            </div>
            <div className="column">
              <nav className="panel">
                <p className="panel-heading">{siteMetadata.labels.topics}</p>
                {tagLinks}
              </nav>
            </div>
          </div>
        </section>
      </Layout>
      <GlobalFooter post_type="home" />
    </div>
  );
}

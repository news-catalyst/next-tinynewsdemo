import css from 'styled-jsx/css';

export default css.global`
  @import url('https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.css');

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'Libre Franklin', sans-serif;
  }
  p,
  ul,
  ol,
  table,
  figure {
    font-family: 'Libre Baskerville', georgia, serif;
  }

  #article-container .hero-body {
    padding-bottom: 0;
  }

  article p,
  article ul,
  article ol,
  article li,
  article span {
    line-height: 1.65em;
  }

  article .content {
    max-width: 768px;
    margin: 0 auto;
    font-size: 125%;
  }

  .head-margin {
    margin-bottom: 50px;
  }

  .nav-border {
    border-bottom: 1px solid lightgray;
  }

  .align-content {
    max-width: 768px;
    margin: 0 auto;
    font-size: 125%;
  }

  .featured {
    font-size: 150%;
    margin: 0 auto;
  }

  .featured-img {
    width: 100%;
    height: auto;
    padding-bottom: 3rem;
  }

  .article-link-img {
    max-width: 400px;
    max-height: 400px;
  }

  .featured-article {
    padding-top: 3rem;
  }

  .article-list-margin {
    margin-bottom: 1.5rem;
  }

  .medium-margin-top {
    margin-top: 3rem;
  }

  .small-margin-left {
    margin-left: 1rem;
  }

  .ad-container {
    margin: 30px auto;
    max-width: 600px;
  }

  .text-ad-container {
    margin: 30px auto;
    border-bottom: 1px solid lightgray;
    border-top: 1px solid lightgray;
  }

  .ad-brand {
    text-align: center;
    padding-bottom: 20px;
    font-size: 85%;
  }

  .ad-banner {
    max-width: 100%;
  }

  .ad-img-container {
    max-width: 35%;
  }

  .ad-img {
    max-width: 95%;
  }

  .ad-text-container {
    max-width: 65%;
  }
`;

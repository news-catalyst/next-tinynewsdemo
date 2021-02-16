import css from 'styled-jsx/css';

export default css.global`
  .landing-page-container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    min-height: 100vh;
    max-width: 768px;
    margin: 0 auto;
    padding: 1.5rem clamp(1rem, 5%, 3rem);
  }

  .landing-page-container h1 {
    font-size: 2.25rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .landing-page-container p {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
  }

  .landing-page-container .block {
    margin: 0 auto;
  }
`;

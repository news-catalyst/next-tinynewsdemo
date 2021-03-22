import css from 'styled-jsx/css';

export default css.global`
  .newsletter {
    background-color: #f7f5f4;
    margin-bottom: 2rem;
    padding: 1.85rem 1rem 2rem;
  }
  .newsletter .group {
    position: relative;
  }
  .newsletter h4 {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.3125rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    text-transform: none;
    margin-bottom: 0.5rem;
    margin-top: 0;
  }
  .newsletter p {
    margin-bottom: 1.5rem;
  }
  .newsletter input {
    background-color: transparent;
  }
  .newsletter .submit {
    background-color: #000000;
    bottom: 0.3125rem;
    color: #ffffff;
    cursor: pointer;
    border: none;
    border-radius: 100%;
    font-weight: 700;
    line-height: 1;
    height: 2rem;
    padding-left: 0.5rem;
    padding-top: 0.375rem;
    position: absolute;
    right: 0.5rem;
    width: 2rem;
    z-index: 1;
  }

  .colorone .newsletter input {
    background-color: rgba(0, 0, 0, 0.15);
    border-bottom-color: rgba(255, 255, 255, 0.5);
    color: #ffffff;
  }

  .colorone .newsletter label {
    color: rgba(255, 255, 255, 0.85);
    padding-left: 0.5rem;
  }

  .colorone .newsletter .submit {
    background-color: #ffffff;
    color: #3666d1;
  }

  .colortwo .section-layout__2,
  .colortwo .newsletter {
    background-color: #d1dbbd;
  }

  .colortwo .newsletter input {
    background-color: rgba(0, 0, 0, 0.12);
    border-bottom-color: rgba(0, 0, 0, 0.5);
    color: #000000;
  }

  .colortwo .newsletter label {
    color: rgba(0, 0, 0, 0.85);
    padding-left: 0.5rem;
  }

  .colortwo .newsletter .submit {
    background-color: #193441;
    color: #ffffff;
  }

  .colorthree .newsletter {
    background-color: #000000;
    color: #ffffff;
  }

  .colorthree .newsletter input {
    background-color: rgba(255, 255, 255, 0.12);
    border-bottom-color: rgba(255, 255, 255, 0.5);
    color: #ffffff;
  }

  .colorthree .newsletter label {
    color: rgba(255, 255, 255, 0.85);
    padding-left: 0.5rem;
  }

  .colorthree .newsletter .submit {
    background-color: #ffffff;
    color: #bf0413;
  }

  /* form starting stylings ------------------------------- */
  .newsletter .group {
    position: relative;
  }

  .newsletter input {
    font-size: 18px;
    padding: 10px 10px 10px 5px;
    display: block;
    width: 100%;
    border: none;
    border-bottom: 1px solid #9c9c9c;
  }

  input:focus {
    outline: none;
  }

  /* BOTTOM BARS ================================= */
  .bar {
    position: relative;
    display: block;
    width: 100%;
  }

  .bar:before,
  .bar:after {
    content: '';
    height: 2px;
    width: 0;
    bottom: 1px;
    position: absolute;
    background: #000000;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
  }

  .bar:before {
    left: 50%;
  }

  .bar:after {
    right: 50%;
  }

  /* active state */
  input:focus ~ .bar:before,
  input:focus ~ .bar:after {
    width: 50%;
  }
`;

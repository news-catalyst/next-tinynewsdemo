import css from 'styled-jsx/css';

export default css.global`
  ul.pagination {
    display: inline-flex;
  }
  ul.pagination li {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    position: relative;
  }
  ul.pagination li.disabled {
    display: none;
  }
  ul.pagination li.active {
    font-weight: bold;
  }
`;

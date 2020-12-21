import css from 'styled-jsx/css';

export default css.global`
  html,
  body,
  div,
  span,
  applet,
  object,
  iframe,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  p,
  blockquote,
  pre,
  a,
  abbr,
  acronym,
  address,
  big,
  cite,
  code,
  del,
  dfn,
  em,
  img,
  ins,
  kbd,
  q,
  s,
  samp,
  small,
  strike,
  strong,
  sub,
  sup,
  tt,
  var,
  b,
  u,
  i,
  center,
  dl,
  dt,
  dd,
  ol,
  ul,
  li,
  fieldset,
  form,
  label,
  legend,
  table,
  caption,
  tbody,
  tfoot,
  thead,
  tr,
  th,
  td,
  article,
  aside,
  canvas,
  details,
  embed,
  figure,
  figcaption,
  footer,
  header,
  hgroup,
  menu,
  nav,
  output,
  ruby,
  section,
  summary,
  time,
  mark,
  audio,
  video {
    margin: 0;
    padding: 0;
    border: 0;
    box-sizing: border-box;
    font-size: 100%;
    font: inherit;
    vertical-align: baseline;
  }

  /* HTML5 display-role reset for older browsers */
  article,
  aside,
  details,
  figcaption,
  figure,
  footer,
  header,
  hgroup,
  menu,
  nav,
  section {
    display: block;
  }

  html {
    background-color: white;
  }

  body {
    line-height: 1;
  }

  ol,
  ul {
    list-style: none;
    width: 100%;
  }

  blockquote,
  q {
    quotes: none;
  }

  blockquote:before,
  blockquote:after,
  q:before,
  q:after {
    content: '';
    content: none;
  }

  table {
    border-collapse: collapse;
    border-spacing: 0;
  }

  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: inherit;
    padding: 0;
  }
  button:focus {
    outline: none;
  }

  a {
    text-decoration: none;
  }

  strong {
    font-weight: bold;
  }

  .cta {
    color: #d1232a;
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.01em;
    text-transform: uppercase;
  }
  .cta__w-icon svg {
    fill: #d1232a;
    height: 0.9375rem;
    left: 0.3125rem;
    position: relative;
    top: 0.1875rem;
  }

  hr {
    border: none;
    border-top: 0.0625rem solid #e7e5e4;
    height: 0.0625rem;
    margin-bottom: 2rem;
    width: 100%;
  }
  hr.bold {
    border-top: 0.1875rem solid #e7e5e4;
  }

  .section__container {
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    max-width: 1366px;
    padding: 0 0.9375rem;
    width: 100%;
  }
  @media (min-width: 48rem) {
    .section__container {
      padding: 0 1.25rem;
    }
  }

  .asset {
    display: flex;
    flex-flow: column nowrap;
  }
  .asset__thumbnail {
    background-color: #f7f5f4;
    overflow: hidden;
    position: relative;
    width: 100%;
    margin-bottom: 0.625rem;
  }
  .asset__thumbnail .content,
  .asset__thumbnail > a {
    bottom: 0;
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  }
  .asset__thumbnail img {
    height: 100%;
    left: 100%;
    margin-left: -200%;
    max-width: none;
    position: relative;
    width: auto;
  }
  .asset__thumbnail a {
    display: block;
  }
  .asset__thumbnail img {
    width: 100%;
  }
  .asset__meta-container {
    position: relative;
    width: 100%;
  }
  .asset__title {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.28;
    text-transform: none;
  }
  .asset__related-links .asset__title {
    font-size: 0.875rem;
    margin-bottom: 0;
  }
  .asset__excerpt {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.35;
    color: #263238;
    font-weight: 400;
    margin-top: 0.625rem;
  }
  .asset__byline {
    align-items: baseline;
    display: flex;
    flex-flow: row wrap;
    font-size: 0.8125rem;
    margin-top: 0.75rem;
  }
  .asset__byline > a {
    padding: 0 0.25rem;
  }
  .asset__byline > a:last-of-type {
    margin-right: 0.75rem;
  }
  .asset__byline a {
    display: inline-block;
  }
  .asset__time,
  .asset__flag {
    display: inline-block;
    margin-top: 0.5625rem;
  }
  .asset__descriptor {
    display: block;
    line-height: 1;
    margin-bottom: 0.5rem;
  }
  .asset__descriptor a {
    color: #000000;
    font-size: 0.75rem;
    font-weight: 400;
    letter-spacing: 0.005em;
    text-transform: none;
  }
  .asset__descriptor a:hover {
    border-bottom-style: solid;
  }
  .asset__descriptor.sponsor a {
    background-color: #fff5ba;
    border-bottom: none;
    color: #000000;
    font-size: 0.625rem;
    letter-spacing: 0.07em;
    padding: 2px 3px 2px 4px;
  }
  .asset time {
    color: #565454;
    display: block;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  .asset time > *:not(:first-of-type)::before {
    content: '— ';
  }
  .asset__flag {
    background-color: #6c6c6c;
    font-size: 0.75rem;
    line-height: 0.03em;
    text-transform: uppercase;
    font-size: 0.6875rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  .asset__related-links {
    margin-top: 0.625rem;
    width: 100%;
  }
  @media (min-width: 62.5rem) {
    .asset__related-links {
      margin-top: 1.0625rem;
    }
  }
  .asset__related-links__title {
    font-size: 0.75rem;
    margin-bottom: 0.625rem;
  }
  .asset__related-links ul {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
  }
  @media (min-width: 48rem) {
    .asset__related-links ul {
      flex-flow: row wrap;
    }
  }
  .asset__related-links li {
    flex: 1;
  }
  @media (max-width: 47.9375rem) {
    .asset__related-links li:not(:last-of-type) {
      border-bottom: 0.0625rem solid #e7e5e4;
      margin-bottom: 0.625rem;
      padding-bottom: 0.625rem;
    }
  }
  @media (min-width: 48rem) {
    .asset__related-links li:not(:last-of-type) {
      border-right: 0.0625rem solid #e7e5e4;
      margin-right: 1.25rem;
      padding-right: 1.25rem;
    }
  }
  .asset .playback {
    background-color: rgba(0, 23, 83, 0.85);
    background-image: url("data:image/svg+xml,%3Csvg focusable='false' xmlns='http://www.w3.org/2000/svg' fill='%23ffffff' viewBox='0 0 32 32' aria-hidden='true'%3E%3Cpath d='M7,28a1,1,0,0,1-1-1V5a1,1,0,0,1,1.501-.8652l19,11a1,1,0,0,1,0,1.73l-19,11A.9975.9975,0,0,1,7,28Z'%3E%3C/path%3E%3Ctitle%3EPlay filled alt%3C/title%3E%3C/svg%3E");
    background-size: 45% 45%;
    background-position: 1rem 0.9375rem;
    background-repeat: no-repeat;
    border-radius: 100%;
    box-shadow: -2px 1px 9px rgba(0, 0, 0, 0.12);
    display: block;
    height: 52px;
    width: 52px;
    left: calc(50% - 25px);
    position: absolute;
    top: calc(50% - 25px);
    z-index: 1;
  }

  .panel {
    display: none;
    overflow: hidden;
  }

  .btn-group {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
  }
  .btn-group > *:not(:last-of-type) {
    margin-right: 0.9375rem;
  }
  .btn-group .btn {
    margin-bottom: 1.25rem;
  }

  .rich-text {
    /*cite:before {
    content: "- ";
  } */
  }
  .rich-text sub,
  .rich-text sup {
    position: relative;
    font-size: 75%;
    line-height: 0;
    vertical-align: baseline;
  }
  .rich-text sup {
    top: -0.5em;
  }
  .rich-text sub {
    bottom: -0.25em;
  }
  .rich-text p {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.125rem;
    letter-spacing: -0.003em;
    line-height: 1.55;
    margin: 0 0 1.25em;
  }
  .rich-text a,
  .rich-text p a {
    color: #000000;
    text-decoration: none;
    cursor: pointer;
    font-weight: 400;
    border-bottom: 1px solid #2594e3;
  }
  .rich-text a:hover,
  .rich-text p a:hover {
    color: #2594e3;
    text-decoration: none;
    border-bottom-style: solid;
  }
  .rich-text small {
    font-size: 85%;
  }
  .rich-text strong {
    font-weight: 700;
  }
  .rich-text em {
    font-style: italic;
  }
  .rich-text .muted {
    color: #565454;
  }
  .rich-text .text-left {
    text-align: left;
  }
  .rich-text .text-right {
    text-align: right;
  }
  .rich-text .text-center {
    text-align: center;
  }
  .rich-text h1,
  .rich-text h2,
  .rich-text h3,
  .rich-text h4,
  .rich-text h5,
  .rich-text h6 {
    margin: 2.5rem 0 1rem;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    text-rendering: optimizelegibility;
    font-weight: 700;
  }
  .rich-text h1 {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    text-transform: none;
  }
  .rich-text h2 {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.028em;
    line-height: 1.15;
    text-transform: none;
  }
  .rich-text h3 {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.3125rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    text-transform: none;
  }
  .rich-text h4 {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.005em;
    line-height: 1.38;
    text-transform: none;
  }
  .rich-text h5 {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.35;
  }
  .rich-text h6 {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.35;
  }
  .rich-text h1 small,
  .rich-text h2 small,
  .rich-text h3 small,
  .rich-text h4 small,
  .rich-text h5 small,
  .rich-text h6 small {
    font-weight: normal;
    line-height: 1;
    font-size: 85%;
  }
  .rich-text ul,
  .rich-text ol {
    padding: 0;
    margin: 0 0 15px 0;
  }
  .rich-text ul ul,
  .rich-text ul ol,
  .rich-text ol ol,
  .rich-text ol ul {
    margin-bottom: 0;
  }
  .rich-text li {
    line-height: normal;
  }
  .rich-text ul.unstyled,
  .rich-text ol.unstyled {
    margin-left: 0;
    list-style: none;
  }
  .rich-text ul.inline,
  .rich-text ol.inline {
    margin-left: 0;
    list-style: none;
  }
  .rich-text ul.inline > li,
  .rich-text ol.inline > li {
    margin-top: 0;
    display: inline-block;
  }
  .rich-text .post-text ul,
  .rich-text .post-text ol {
    margin-bottom: 15px;
  }
  .rich-text .post-text ul li,
  .rich-text .post-text ol li {
    margin-bottom: 7.5px;
    padding-left: 20px;
    margin-left: 20px;
  }
  .rich-text .post-text ul ul,
  .rich-text .post-text ol ol {
    margin-top: 7.5px;
  }
  .rich-text .post-text ul li {
    list-style: circle;
  }
  .rich-text .post-text ol li {
    list-style: decimal;
  }
  .rich-text dl {
    margin-bottom: 20px;
  }
  .rich-text dt,
  .rich-text dd {
    line-height: 1.25;
  }
  .rich-text dt {
    font-weight: bold;
    margin-bottom: 4px;
    font-size: 17px;
  }
  .rich-text dd {
    margin: 0 0 15px;
    padding-left: 15px;
    border-left: 3px solid rgba(37, 148, 227, 0.65);
    color: #263238;
    font-size: 15px;
    line-height: 1.5;
  }
  .rich-text blockquote {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.3125rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    text-transform: none;
    border: 0.3125rem solid rgba(37, 148, 227, 0.65);
    font-weight: 500;
    line-height: 1.28;
    margin: 0 0 20px;
    position: relative;
    padding: 1.25rem 1.5625rem;
    text-align: center;
  }
  @media (min-width: 48rem) {
    .rich-text blockquote {
      font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
        '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.028em;
      line-height: 1.15;
      text-transform: none;
      font-weight: 500;
      line-height: 1.32;
    }
  }
  @media (min-width: 62.5rem) {
    .rich-text blockquote {
      padding: 1.875rem 8%;
    }
  }
  .rich-text q:before,
  .rich-text q:after,
  .rich-text blockquote:after {
    content: '';
  }
  .rich-text blockquote:before {
    background-color: #ffffff;
    content: '“';
    color: #001d68;
    font-family: Georgia, Constantina, 'Nimbus Roman No9 L', serif;
    font-size: 4.5rem;
    font-weight: 400;
    height: 20px;
    left: 50%;
    line-height: 1;
    margin: 0 auto;
    position: absolute;
    top: 0;
    transform: translateX(-36px);
    transform: translateY(-20px);
    width: 4rem;
    z-index: 1;
  }
  .rich-text cite {
    display: block;
    width: 100%;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 400;
    letter-spacing: 0;
    color: #7c7c7c;
    margin-top: 1rem;
    letter-spacing: 0.01em;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
  }
  .rich-text table {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    border-left: 1px solid #eceff1;
    /* ui-02 */
    border-top: 1px solid #eceff1;
    /* ui-02 */
    border-spacing: 0;
    margin-bottom: 30px;
    font-size: 14px;
  }
  .rich-text tr > * {
    padding: 13px 15px;
    border-bottom: 1px solid #eceff1;
    /* ui-02 */
    border-right: 1px solid #eceff1;
  }
  .rich-text th {
    border-bottom: 3px solid #eceff1;
    /* ui-02 */
    border-right: 1px solid #eceff1;
    /* ui-02 */
    background-color: #fafafa;
  }
  .rich-text address {
    display: block;
    margin-bottom: 30px;
    font-style: normal;
    line-height: 1.2;
    color: #5c5c5c;
    /* text-02 */
  }
  .rich-text big {
    font-size: 24px;
  }
  .rich-text abbr[title],
  .rich-text acronym[title] {
    color: #000000;
    text-decoration: none;
    cursor: pointer;
    font-weight: 400;
    border-bottom: 1px solid #2594e3;
  }
  .rich-text code,
  .rich-text pre {
    background-color: #fafafa;
    border: 1px solid #eceff1;
  }
  .rich-text code {
    padding: 0 5px;
  }
  .rich-text pre {
    padding: 7.5px 10px;
  }
  .rich-text .inline-img img {
    width: 100%;
  }
  .rich-text .inline-img.fullscreen {
    width: 100%;
    display: block;
  }
  .rich-text .inline-img.large.right {
    width: 50%;
    display: block;
    float: right;
    margin: 0.375rem 0 0.625rem 1.25rem;
  }
  .rich-text .inline-img.large.left {
    width: 50%;
    display: block;
    float: left;
    margin: 0.375rem 1.25rem 0.625rem 0;
  }
  .rich-text .inline-img.small.right {
    width: 33.33%;
    display: block;
    float: right;
    margin: 0.375rem 0 0.625rem 1.25rem;
  }
  .rich-text .inline-img.small.left {
    width: 33.33%;
    display: block;
    float: left;
    margin: 0.375rem 1.25rem 0.625rem 0;
  }

  table {
    width: 100%;
  }
  table tr {
    display: flex;
    flex-flow: row nowrap;
  }
  table th,
  table td {
    flex: auto;
    padding: 0.3125rem 0.4375rem;
  }

  figcaption,
  .media-caption,
  .media-credit {
    color: #263238;
    font-size: 0.8125rem;
    padding-top: 0.3125rem;
  }

  img {
    width: 100%;
  }

  /* form starting stylings ------------------------------- */
  .group {
    position: relative;
  }

  input {
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

  /* LABEL ======================================= */
  label {
    color: #999;
    font-size: 18px;
    font-weight: normal;
    position: absolute;
    pointer-events: none;
    left: 0.125rem;
    top: 10px;
    transition: 0.2s ease all;
    -moz-transition: 0.2s ease all;
    -webkit-transition: 0.2s ease all;
  }

  /* active state */
  input:focus ~ label,
  input:valid ~ label {
    top: -20px;
    font-size: 14px;
    color: #565454;
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

  /* HIGHLIGHTER ================================== */
  .highlight {
    position: absolute;
    height: 60%;
    width: 0;
    top: 25%;
    left: 0;
    pointer-events: none;
    opacity: 0.5;
  }

  /* active state */
  input:focus ~ .highlight {
    -webkit-animation: inputHighlighter 0.3s ease;
    -moz-animation: inputHighlighter 0.3s ease;
    animation: inputHighlighter 0.3s ease;
  }

  /* ANIMATIONS ================ */
  @-webkit-keyframes inputHighlighter {
    from {
      background: #5264ae;
    }
    to {
      width: 0;
      background: transparent;
    }
  }

  @-moz-keyframes inputHighlighter {
    from {
      background: #5264ae;
    }
    to {
      width: 0;
      background: transparent;
    }
  }

  @keyframes inputHighlighter {
    from {
      background: #5264ae;
    }
    to {
      width: 0;
      background: transparent;
    }
  }

  .section {
    /**  Featured Stories: Everyday layout
***
**/
    /**  Marketing
***
**/
    /**  Featured Stories: Everyday layout
***
**/
  }
  .section-layout__1 {
    display: flex;
    margin: 0 0 1.875rem 0;
  }
  @media only screen and (min-width: 768px) {
    .section-layout__1 .section__container {
      display: grid;
      flex: 1;
      margin-bottom: 2rem;
      width: 100%;
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 959px) {
    .section-layout__1 .section__container {
      grid-template-columns: 50% 50%;
      grid-template-rows: auto;
      grid-template-areas: 'col-1 col-1' 'col-2 col-3';
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__1 .section__container {
      grid-template-columns: calc(100% / 12 * 8) calc(100% / 12 * 4);
      grid-template-rows: auto;
      grid-template-areas: 'col-1 col-2' 'col-1 col-3';
    }
  }
  @media only screen and (min-width: 768px) {
    .section-layout__1 .block:nth-child(1) {
      grid-area: col-1;
    }
  }
  @media only screen and (max-width: 767px) {
    .section-layout__1 .block:nth-child(1) .asset {
      border-bottom: 0.0625rem solid #e7e5e4;
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 959px) {
    .section-layout__1 .block:nth-child(1) .asset {
      border-bottom: 0.0625rem solid #e7e5e4;
      margin-bottom: 1.25rem;
      padding-bottom: 1.25rem;
    }
  }
  @media only screen and (max-width: 767px) {
    .section-layout__1 .block:nth-child(1) .asset__thumbnail {
      order: 1;
    }
  }
  @media only screen and (min-width: 768px) {
    .section-layout__1 .block:nth-child(1) .asset__thumbnail {
      max-width: 50%;
      width: 100%;
    }
  }
  @media only screen and (max-width: 767px) {
    .section-layout__1 .block:nth-child(1) .asset__meta-container {
      order: 2;
    }
  }
  @media only screen and (min-width: 768px) {
    .section-layout__1 .block:nth-child(2) {
      grid-area: col-2;
    }
  }
  @media only screen and (max-width: 767px) {
    .section-layout__1 .block:nth-child(2) .asset {
      border-bottom: 0.0625rem solid #e7e5e4;
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 959px) {
    .section-layout__1 .block:nth-child(2) .asset {
      border-right: 0.0625rem solid #e7e5e4;
      padding-right: 1rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__1 .block:nth-child(2) .asset {
      border-bottom: 0.0625rem solid #e7e5e4;
    }
  }
  @media only screen and (min-width: 768px) {
    .section-layout__1 .block:nth-child(3) {
      grid-area: col-3;
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 959px) {
    .section-layout__1 .block:nth-child(3) .asset {
      padding-left: 1rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__1 .block:nth-child(3) .asset {
      padding-top: 1rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__1 .block:nth-child(2),
    .section-layout__1 .block:nth-child(3) {
      display: flex;
      height: 100%;
      padding-left: 2rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__1 .block:nth-child(2) .asset,
    .section-layout__1 .block:nth-child(3) .asset {
      border-left: 0.0625rem solid #e7e5e4;
      padding-left: 2rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__1 .block:nth-child(2) .asset__title,
    .section-layout__1 .block:nth-child(3) .asset__title {
      font-size: 1rem;
    }
  }
  .section-layout__1 .block:nth-child(2) .asset__thumbnail,
  .section-layout__1 .block:nth-child(3) .asset__thumbnail {
    display: none;
  }
  @media only screen and (max-width: 767px) {
    .section-layout__1 .block .asset {
      margin-bottom: 1rem;
    }
  }
  @media only screen and (min-width: 768px) {
    .section-layout__1 .block .asset {
      align-content: flex-start;
      align-items: flex-start;
      flex-flow: row nowrap;
    }
    .section-layout__1 .block .asset__thumbnail {
      margin-bottom: 0;
      margin-left: 1.25rem;
      max-width: 8.75rem;
      order: 2;
      width: calc(100% / 3);
    }
  }
  @media only screen and (min-width: 768px) and (max-width: 39.9375rem) {
    .section-layout__1 .block .asset__thumbnail {
      max-width: 6.875rem;
    }
  }
  @media only screen and (min-width: 768px) {
    .section-layout__1 .block .asset__meta-container {
      flex: 1;
    }
  }
  .styleone .section-layout__1 .block:nth-child(1) .asset__title {
    font-weight: 900;
  }
  @media only screen and (max-width: 639px) {
    .styleone .section-layout__1 .block:nth-child(1) .asset__title {
      font-size: 1.4375rem;
      line-height: 1.24;
    }
  }
  @media only screen and (min-width: 640px) {
    .styleone .section-layout__1 .block:nth-child(1) .asset__title {
      font-size: 1.75rem;
      line-height: 1.18;
    }
  }
  .styleone .section-layout__1 .block:nth-child(2) .asset__title,
  .styleone .section-layout__1 .block:nth-child(3) .asset__title {
    font-size: 1.0625rem;
    line-height: 1.25;
  }
  @media only screen and (max-width: 639px) {
    .styletwo .section-layout__1 .block:nth-child(1) .asset__title {
      font-size: 1.5625rem;
      line-height: 1.2;
    }
  }
  @media only screen and (min-width: 640px) {
    .styletwo .section-layout__1 .block:nth-child(1) .asset__title {
      font-size: 1.875rem;
      line-height: 1.12;
    }
  }
  .styletwo .section-layout__1 .block:nth-child(2) .asset__title,
  .styletwo .section-layout__1 .block:nth-child(3) .asset__title {
    font-size: 1.0625rem;
    letter-spacing: 0;
    line-height: 1.3;
  }
  .styletwo .section-layout__1 .asset__excerpt {
    line-height: 1.35;
  }
  @media only screen and (max-width: 639px) {
    .stylethree .section-layout__1 .block:nth-child(1) .asset__title {
      font-size: 1.6875rem;
      letter-spacing: -0.008em;
      line-height: 1.08;
    }
  }
  @media only screen and (min-width: 640px) {
    .stylethree .section-layout__1 .block:nth-child(1) .asset__title {
      font-size: 1.9375rem;
      letter-spacing: -0.01em;
      line-height: 1.1;
    }
  }
  .stylethree .section-layout__1 .block:nth-child(2) .asset__title,
  .stylethree .section-layout__1 .block:nth-child(3) .asset__title {
    font-size: 1.1875rem;
    line-height: 1.25;
    letter-spacing: -0.005em;
  }
  .stylethree .section-layout__1 .asset__excerpt {
    line-height: 1.35;
  }
  .stylefour .section-layout__1 .block:nth-child(1) .asset__title {
    font-family: 'Arbutus Slab', serif;
    font-weight: 400;
  }
  @media only screen and (max-width: 639px) {
    .stylefour .section-layout__1 .block:nth-child(1) .asset__title {
      font-size: 1.75rem;
      line-height: 1.1;
      letter-spacing: -0.03em;
    }
  }
  @media only screen and (min-width: 640px) {
    .stylefour .section-layout__1 .block:nth-child(1) .asset__title {
      font-size: 2rem;
      letter-spacing: -0.01em;
      line-height: 1.12;
    }
  }
  .stylefour .section-layout__1 .block:nth-child(2) .asset__title,
  .stylefour .section-layout__1 .block:nth-child(3) .asset__title {
    font-size: 1.0625rem;
    letter-spacing: 0;
    line-height: 1.25;
  }
  .stylefour .section-layout__1 .asset__excerpt {
    line-height: 1.35;
  }
  .section-layout__2 {
    background-color: #f7f5f4;
    margin-bottom: 3.75rem;
    padding: 2rem 1.25rem 0;
  }
  .section-layout__2 .block {
    margin-bottom: 2rem;
  }
  @media only screen and (min-width: 960px) {
    .section-layout__2 .block {
      padding: 0 calc(100% / 6 * 0.25);
      width: 50%;
    }
  }
  @media only screen and (max-width: 959px) {
    .section-layout__2 .block:nth-child(1) {
      border-bottom: 0.0625rem solid #e7e5e4;
      border-bottom-color: rgba(0, 0, 0, 0.1);
      padding-bottom: 2rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__2 .block:nth-child(1) {
      border-right: 0.0625rem solid #e7e5e4;
      border-right-color: rgba(0, 0, 0, 0.1);
    }
  }
  .section-layout__2 .block__cta {
    font-weight: 700;
  }
  .section-layout__2 .block:nth-child(2) .block__cta {
    align-items: center;
    background-color: #000000;
    color: #ffffff;
    display: inline-flex;
    font-weight: 700;
    line-height: 1;
    min-height: 2.375rem;
    padding: 0 1.25rem 0;
  }
  .section-layout__2 h2 {
    font-weight: 700;
    margin-bottom: 1.25rem;
  }
  .section-layout__2 p {
    margin-bottom: 0.75rem;
  }
  .styleone .section-layout__2 h2 {
    font-size: 1.1875rem;
    font-weight: 900;
  }
  .styleone .section-layout__2 p {
    font-size: 0.9375rem;
    line-height: 1.55;
  }
  .styleone .section-layout__2 .block__cta {
    font-size: 0.875rem;
    letter-spacing: 0;
  }
  .styletwo .section-layout__2 h2 {
    font-size: 1.25rem;
    font-weight: 700;
  }
  .styletwo .section-layout__2 p {
    font-size: 1rem;
    line-height: 1.55;
  }
  .styletwo .section-layout__2 .block__cta {
    font-size: 1rem;
    letter-spacing: 0;
  }
  .stylethree .section-layout__2 h2 {
    font-size: 1.3125rem;
    font-weight: 700;
  }
  .stylethree .section-layout__2 p {
    font-size: 0.9375rem;
    line-height: 1.55;
  }
  .stylethree .section-layout__2 .block__cta {
    font-size: 0.875rem;
    letter-spacing: 0;
  }
  .stylefour .section-layout__2 h2 {
    font-size: 1.1875rem;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: uppercase;
  }
  .stylefour .section-layout__2 p {
    font-size: 0.9375rem;
    line-height: 1.55;
  }
  .stylefour .section-layout__2 .block__cta {
    font-size: 0.875rem;
    letter-spacing: 0;
  }
  .section-layout__3 {
    display: flex;
    margin: 0 0 1.875rem 0;
  }
  @media only screen and (max-width: 959px) {
    .section-layout__3 .section__container {
      padding-left: 0;
      padding-right: 0;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__3 .section__container {
      display: grid;
      flex: 1;
      grid-template-columns: calc(100% / 12 * 8) calc(100% / 12 * 4 - 2rem);
      grid-template-rows: auto;
      grid-template-rows: auto 1fr;
      grid-template-areas: 'col-1 col-2' 'col-1 col-3';
      width: 100%;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__3 .block:nth-child(1) {
      padding-bottom: 2rem;
      grid-area: col-2;
    }
  }
  .section-layout__3 .block:nth-child(1) a {
    display: block;
    padding: 1rem;
  }
  @media only screen and (max-width: 959px) {
    .section-layout__3 .block:nth-child(1) h3 {
      padding-left: 1.25rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__3 .block:nth-child(1) h3 {
      padding-left: 1rem;
    }
  }
  @media only screen and (max-width: 959px) {
    .section-layout__3 .block:nth-child(1) ul {
      align-items: stretch;
      display: flex;
      flex-flow: row nowrap;
      flex-grow: 1;
      margin-top: 1.25rem;
      order: 3;
      overflow-y: hidden;
      overflow-x: scroll;
      padding-left: 0.25rem;
      transform: translateX(0);
      width: 100%;
      -ms-overflow-style: none;
      /* IE and Edge */
      scrollbar-width: none;
      /* Firefox */
    }
    .section-layout__3 .block:nth-child(1) ul::-webkit-scrollbar {
      display: none;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__3 .block:nth-child(2) {
      grid-area: col-1;
    }
  }
  @media only screen and (max-width: 959px) {
    .section-layout__3 .block:nth-child(2) .asset {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__3 .block:nth-child(2) .asset {
      border-bottom: 0.0625rem solid #e7e5e4;
    }
  }
  @media only screen and (max-width: 959px) {
    .section-layout__3 .block:nth-child(2) .section__title {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
  }
  @media only screen and (max-width: 959px) {
    .section-layout__3 .block:nth-child(3) {
      padding-left: 1.25rem;
      padding-right: 1.25rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__3 .block:nth-child(3) {
      grid-area: col-3;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__3 .block:nth-child(1),
    .section-layout__3 .block:nth-child(3) {
      border-left: 0.0625rem solid #e7e5e4;
      margin-left: 2rem;
      padding-left: 2rem;
    }
  }
  @media only screen and (max-width: 959px) {
    .section-layout__3 .block__cta {
      display: block;
      margin: 0 1.25rem 3rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__3 .block .asset {
      align-content: flex-start;
      align-items: flex-start;
      flex-flow: row nowrap;
    }
    .section-layout__3 .block .asset__thumbnail {
      margin-bottom: 0;
      margin-left: 1.25rem;
      max-width: 8.75rem;
      order: 2;
      width: calc(100% / 3);
    }
  }
  @media only screen and (min-width: 960px) and (max-width: 39.9375rem) {
    .section-layout__3 .block .asset__thumbnail {
      max-width: 6.875rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .section-layout__3 .block .asset__meta-container {
      flex: 1;
    }
  }
  .section-layout__3 .block .text-ad-container {
    border-top: none;
    border-bottom: none;
    margin: 0;
  }
  .section-layout__3 .block .text-ad-container .media.ad-img-container {
    max-width: 11.25rem;
  }
  .section-layout__3 .block .text-ad-container .button {
    margin-top: 1rem;
  }
  .styleone .section-layout__3 .block:nth-child(1) .section__title {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
  @media only screen and (min-width: 960px) {
    .styleone .section-layout__3 .block:nth-child(1) .section__title {
      padding-top: 0.5rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .styleone .section-layout__3 .newsletter h4 {
      font-size: 1.5rem;
    }
  }
  .styletwo .section-layout__3 .block:nth-child(1) .section__title {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
  @media only screen and (min-width: 960px) {
    .styletwo .section-layout__3 .block:nth-child(1) .section__title {
      padding-top: 0.5rem;
    }
  }
  .styletwo .section-layout__3 .block:nth-child(1) a {
    font-family: 'Source Sans Pro', sans-serif;
  }
  @media only screen and (min-width: 960px) {
    .styletwo .section-layout__3 .newsletter h4 {
      font-size: 1.5rem;
    }
  }
  .stylethree .section-layout__3 .block:nth-child(1) .section__title {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
  @media only screen and (min-width: 960px) {
    .stylethree .section-layout__3 .block:nth-child(1) .section__title {
      padding-top: 0.5rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .stylethree .section-layout__3 .newsletter h4 {
      font-size: 1.75rem;
    }
  }
  .stylefour .section-layout__3 .block:nth-child(1) .section__title {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
  @media only screen and (min-width: 960px) {
    .stylefour .section-layout__3 .block:nth-child(1) .section__title {
      padding-top: 0.5rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .stylefour .section-layout__3 .newsletter h4 {
      font-size: 1.5rem;
    }
  }
  .section__title {
    font-size: 1.3125rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
    width: 100%;
  }
  .section__w-border {
    border-bottom: 0.0625rem solid #e7e5e4;
    margin-bottom: 1.875rem;
    padding-bottom: 1.875rem;
  }
  .section__w-background {
    background-color: #f7f5f4;
    margin-bottom: 3.125rem;
    padding: 1.875rem 0 2.1875rem;
  }
  .section-ad {
    border-bottom: 0.0625rem solid #e7e5e4;
    border-top: 0.0625rem solid #e7e5e4;
    padding: 0.9375rem 0;
    margin-bottom: 3rem;
  }
  .section-ad .block {
    margin-bottom: 0;
  }

  [class*='block-'] {
    display: flex;
    flex-flow: column nowrap;
    margin-bottom: 2rem;
    width: 100%;
  }

  .site__header {
    border-bottom: 0.0625rem solid #e7e5e4;
    display: flex;
    width: 100%;
  }
  .site__header + main .section-ad.top {
    margin-top: -2rem;
  }
  @media only screen and (max-width: 959px) {
    .site__header .section__container {
      padding: 1.25rem 0 0;
    }
  }
  @media only screen and (min-width: 960px) {
    .site__header .section__container {
      padding: 1.25rem;
    }
  }
  @media only screen and (max-width: 959px) {
    .site__header nav {
      align-items: stretch;
      border-top: 0.0625rem solid #e7e5e4;
      display: flex;
      flex-flow: row nowrap;
      flex-grow: 1;
      margin-top: 1.25rem;
      order: 3;
      overflow-y: hidden;
      overflow-x: scroll;
      transform: translateX(0);
      width: 100%;
      -ms-overflow-style: none;
      /* IE and Edge */
      scrollbar-width: none;
      /* Firefox */
    }
    .site__header nav::-webkit-scrollbar {
      display: none;
    }
  }
  @media only screen and (min-width: 960px) {
    .site__header nav {
      flex: 1;
      text-align: right;
    }
  }
  .site__header nav a {
    align-items: flex-end;
    display: inline-flex;
    height: 100%;
  }
  @media only screen and (max-width: 959px) {
    .site__header nav a {
      padding: 0.625rem 1.25rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .site__header nav a {
      align-items: center;
      margin-right: 2rem;
      padding-top: 0.25rem;
    }
  }
  .site__header nav a:hover {
    text-decoration: underline;
  }

  .site__logo {
    line-height: 1;
  }
  @media only screen and (max-width: 959px) {
    .site__logo {
      flex: 1;
      font-size: 2.25rem;
      order: 1;
      margin-left: 1rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .site__logo {
      font-size: 2.625rem;
    }
  }

  .site__cta {
    align-items: center;
    background-color: #000000;
    color: #ffffff;
    display: flex;
    font-weight: 700;
    line-height: 1;
    min-height: 2.375rem;
    padding: 0.125rem 1.25rem 0;
  }
  @media only screen and (max-width: 959px) {
    .site__cta {
      margin-right: 1.25rem;
      order: 2;
    }
  }

  .block {
    width: 100%;
  }
  .block__head {
    align-items: flex-end;
    display: flex;
    flex: 1;
    flex-flow: row nowrap;
    margin-bottom: 0.9375rem;
  }
  .block__head .section__title {
    margin-bottom: 0;
  }
  .block__head .sponsor-attr {
    align-items: flex-end;
    display: flex;
    flex-flow: row nowrap;
    padding-left: 0.4375rem;
  }
  .block__head .sponsor-attr p {
    color: #7c7c7c;
    font-size: 0.75rem;
    line-height: 1;
    margin: 0 0.625rem 0 0;
    text-align: right;
  }
  .block__head .sponsor-attr figure {
    background-color: #e7e5e4;
    height: 1.875rem;
    max-width: 4.0625rem;
    width: 4.0625rem;
  }
  .block__head .sponsor-attr a {
    display: flex;
    height: 100%;
  }
  .block__list .asset {
    align-content: flex-start;
    align-items: flex-start;
    flex-flow: row nowrap;
    border-bottom: 0.0625rem solid #e7e5e4;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
  }
  .block__list .asset__thumbnail {
    margin-bottom: 0;
    margin-left: 1.25rem;
    max-width: 8.75rem;
    order: 2;
    width: calc(100% / 3);
  }
  @media (max-width: 39.9375rem) {
    .block__list .asset__thumbnail {
      max-width: 6.875rem;
    }
  }
  .block__list .asset__meta-container {
    flex: 1;
  }

  .page__head {
    background-color: #00144a;
    color: #ffffff;
    margin-bottom: 1.875rem;
    padding: 1.875rem 0 2.0625rem;
    position: relative;
  }

  .page__container {
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    max-width: 1366px;
    padding: 0 0.9375rem;
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
  }
  @media (min-width: 48rem) {
    .page__container {
      padding: 0 1.25rem;
    }
  }

  .page__title {
    line-height: 1;
  }
  @media (max-width: 47.9375rem) {
    .page__title {
      font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
        '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      line-height: 1.15;
    }
  }
  @media (min-width: 48rem) {
    .page__title {
      font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
        '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
      font-size: 2.875rem;
      font-weight: 700;
      letter-spacing: -0.035em;
      font-weight: 500;
    }
  }

  .page__description {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.35;
    font-weight: 400;
    margin: 0.5rem 0 0 0;
  }

  .page__navigation {
    display: flex;
    flex-flow: row wrap;
    height: 3.125rem;
    margin: 0 auto 0;
    max-width: 1366px;
  }
  .page__navigation::before {
    border-top: 0.0625rem solid rgba(255, 255, 255, 0.2);
    bottom: 3.1875rem;
    content: '';
    left: 0;
    position: absolute;
    width: 100%;
  }
  .page__navigation nav {
    -ms-overflow-style: none;
    align-items: stretch;
    display: flex;
    flex-flow: row nowrap;
    flex-grow: 1;
    overflow-y: hidden;
    overflow-x: scroll;
    padding-left: 0.9375rem;
    /*transform: translateX(0);*/
    padding: 0;
    transform: translateY(34px);
  }
  .page__navigation nav::-webkit-scrollbar {
    display: none;
  }
  .page__navigation nav > * {
    flex-shrink: 0;
    margin-right: 0.9375rem;
  }
  .page__navigation nav > * {
    padding: 0.9375rem 0.625rem 0.625rem;
  }
  .page__navigation a {
    color: #ffffff;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    height: 100%;
    text-transform: uppercase;
  }
  .page__navigation span {
    color: #ffffff;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 0.875rem;
    text-transform: uppercase;
  }
  @media (max-width: 47.9375rem) {
    .page__navigation span {
      padding-left: 0.9375rem;
    }
  }
  @media (min-width: 48rem) {
    .page__navigation span {
      padding-left: 1.25rem;
    }
  }
  .page__navigation span a {
    border-bottom: 1px solid #ff2b32;
    color: #ffffff;
    font-weight: 700;
    margin-left: 0.3125rem;
  }
  .page__navigation i {
    align-items: center;
    background-color: #ff2b32;
    border-radius: 100%;
    display: inline-flex;
    font-size: 0.6875rem;
    justify-content: center;
    height: 1.25rem;
    line-height: 1;
    margin-left: 0.3125rem;
    padding-top: 0.0625rem;
    position: relative;
    top: -1px;
    width: 1.25rem;
  }

  .post__header .section__container {
    align-items: center;
    flex-flow: column nowrap;
  }
  .post__header .section__container > *:not(.post__featured-media) {
    max-width: 60rem;
    width: 100%;
  }

  .post__descriptor {
    font-size: 0.85rem;
    letter-spacing: 0.005em;
    margin-bottom: 0.5em;
  }
  .post__descriptor a:not(:last-of-type) {
    margin-right: 1em;
  }

  .post__flag-opinion {
    color: #6c6c6c;
  }

  .post__title {
    font-size: 2.8rem;
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -0.024em;
    margin-bottom: 0.15em;
  }

  .post__dek {
    font-size: 1.5rem;
    font-weight: 400;
    line-height: 1.35;
    letter-spacing: -0.01em;
    margin-bottom: 0.85em;
  }

  .post__meta--top {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  @media only screen and (min-width: 960px) {
    .post__meta--top {
      flex-wrap: nowrap;
      max-width: 44.375rem;
      width: 100%;
    }
  }

  .post__meta--bottom {
    display: flex;
    flex-flow: column nowrap;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .post__meta--bottom a {
    border-bottom: none;
  }

  .post__byline {
    display: flex;
    flex-flow: row wrap;
  }
  @media only screen and (max-width: 959px) {
    .post__meta--top .post__byline {
      border-bottom: 0.0625rem solid #e7e5e4;
      margin-bottom: 0.28rem;
      padding-bottom: 1.15rem;
      width: 100%;
    }
  }
  .post__meta--bottom .post__byline {
    display: flex;
    flex-flow: column nowrap;
    border-bottom: 0.0625rem solid #e7e5e4;
    border-top: 0.0625rem solid #e7e5e4;
    margin-bottom: 1rem;
    padding: 1.5rem 0 0;
  }
  .post__meta--bottom .post__byline .section__container {
    align-self: center;
    flex-flow: column nowrap;
    max-width: 1024px;
  }

  .post__author {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    flex-wrap: nowrap;
  }
  .post__meta--bottom .post__author {
    margin-bottom: 1.25rem;
  }
  .post__author-avatar {
    background-color: #f7f5f4;
    overflow: hidden;
    position: relative;
    width: 100%;
    border: 0.1875rem solid #ffffff;
    border-radius: 100%;
    height: 2.9375rem;
    width: 2.9375rem;
  }
  .post__author-avatar::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  .post__author-avatar .content,
  .post__author-avatar > a {
    bottom: 0;
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  }
  .post__author-avatar img {
    height: 100%;
    left: 100%;
    margin-left: -200%;
    max-width: none;
    position: relative;
    width: auto;
  }
  @media only screen and (max-width: 959px) {
    .post__meta--top .post__author-avatar {
      display: none;
    }
  }
  .post__meta--top .post__author-avatar:not(:first-of-type) {
    transform: translateX(-10px);
  }
  .post__meta--bottom .post__author-avatar {
    margin-bottom: 1.25rem;
  }
  @media only screen and (min-width: 900px) {
    .post__meta--bottom .post__author-avatar {
      height: 4rem;
      width: 4rem;
    }
  }
  .post__author-meta {
    font-size: 0.85rem;
  }
  .post__meta--bottom .post__author-meta {
    display: flex;
    flex-flow: column nowrap;
    flex-grow: 1;
    margin-left: 0.75rem;
    padding-bottom: 1.25rem;
  }
  .post__author-meta a {
    font-weight: 700;
  }
  .post__author-meta .name a {
    font-size: 1rem;
  }
  .post__author-meta p {
    font-size: 0.875rem;
    margin-bottom: 0;
    margin-top: 0.25rem;
  }
  .post__author-meta .contact {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 17 14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.725 4.111v.402c0 4.32-3.28 9.242-9.143 9.242-1.888 0-3.578-.502-4.97-1.507h.796c1.49 0 2.981-.502 4.074-1.406-1.39 0-2.583-1.005-3.08-2.31.198 0 .397.1.596.1.298 0 .596 0 .894-.1C2.402 8.23 1.31 6.923 1.31 5.316c.397.2.894.402 1.49.402-.894-.603-1.49-1.608-1.49-2.713 0-.603.198-1.205.397-1.708a8.943 8.943 0 0 0 6.758 3.416c-.1-.2-.1-.502-.1-.703 0-1.808 1.491-3.315 3.28-3.315.894 0 1.789.401 2.385 1.004.696-.1 1.49-.402 2.087-.803-.199.803-.795 1.406-1.391 1.808.695-.1 1.292-.302 1.888-.502-.696.904-1.292 1.506-1.888 1.908' fill='%234099FF' fill-rule='nonzero'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: left center;
    background-size: auto 0.75rem;
    margin-left: 0.5rem;
    padding-left: 1.125rem;
  }
  .post__author-meta .contact a {
    font-weight: 400;
  }
  .post__author:not(:last-of-type) {
    margin-right: 1.5rem;
  }
  .post__meta--bottom .post__author:not(:last-of-type) .post__author-meta {
    border-bottom: 0.0625rem solid #e7e5e4;
  }

  .post__share {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    flex-wrap: nowrap;
  }
  .post__share-label {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 12px;
    font-weight: 500;
    color: #6c6c6c;
    font-weight: 400;
    letter-spacing: 0.05em;
    margin-right: 0.5rem;
    text-transform: uppercase;
  }
  .post__share-button {
    text-transform: none;
    font-size: 0.8125rem;
  }
  .post__share-button i {
    align-items: center;
    border: 0.0625rem solid #000000;
    border-radius: 100%;
    display: inline-flex;
    justify-content: center;
    height: 1.75rem;
    margin-left: 0.3125rem;
    width: 1.75rem;
  }
  .post__share-button svg {
    height: 0.6875rem;
    width: auto;
  }

  .post__featured-media {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    max-width: 80rem;
    width: 100%;
  }
  .post__featured-media figure {
    display: flex;
    flex-flow: row wrap;
    border-bottom: 0.0625rem solid #e7e5e4;
    margin-bottom: 1.15rem;
    max-width: 60rem;
    padding-bottom: 0.625rem;
    width: 100%;
  }
  .post__featured-media .media {
    width: 100%;
  }
  .post__featured-media .media-credit,
  .post__featured-media .media-caption {
    color: #263238;
    font-size: 0.8125rem;
    padding-top: 0.3125rem;
    display: inline-block;
  }
  .post__featured-media .media-credit {
    font-weight: 700;
    margin-right: 0.5rem;
  }

  .post__body {
    margin-bottom: 1rem;
  }
  .post__body .section__container {
    align-items: center;
    flex-flow: column nowrap;
    width: 100%;
  }
  .post__body .post-text {
    border-bottom: none;
    display: flex;
    margin-top: 0.25rem;
    padding-top: 2rem;
  }

  .post time {
    color: #565454;
    display: block;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  .post time > *:not(:first-of-type)::before {
    content: '— ';
  }

  .post__tags {
    display: flex;
    flex-flow: row wrap;
    flex-wrap: nowrap;
    margin-bottom: 2rem;
  }
  @media (min-width: 48rem) {
    .post__tags .post__meta--top {
      order: 1;
    }
  }
  .post__tags .subtitle {
    flex-shrink: 0;
    margin-bottom: 1rem;
    padding: 0.5rem 0;
  }
  .post__tags .tags {
    display: flex;
    flex-flow: row wrap;
    padding-bottom: 1.5rem;
  }
  .post__tags .tags li {
    margin-bottom: 1rem;
    margin-left: 1rem;
  }
  .post__tags .tags a {
    align-items: center;
    background-color: #e7e5e4;
    border-radius: 0.1875rem;
    color: #000000;
    display: flex;
    font-size: 0.75rem;
    justify-content: center;
    letter-spacing: 0.04em;
    min-height: 2.375rem;
    padding: 0 0.875rem;
  }
  .post__tags .tags a:hover {
    border-bottom: none;
    text-decoration: none;
  }

  .post__recirculation {
    border-top: 0.0625rem solid #e7e5e4;
    padding-top: 3rem;
  }
  .post__recirculation .section__container {
    align-self: center;
    flex-flow: column nowrap;
    max-width: 1024px;
    width: 100%;
  }
  .post__recirculation .section__container > * {
    align-self: flex-end;
    width: 100%;
  }

  .post__comment-counter {
    background-repeat: no-repeat;
    display: block;
    font-size: 0.875rem;
    line-height: 1;
  }
  @media only screen and (max-width: 959px) {
    .post__comment-counter {
      align-items: center;
      background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M3.83333 15.4373V14.9373H3.33333H0.5V0.5H19.5V14.9373H9.16667H8.99435L8.85862 15.0434L3.83333 18.9741V15.4373Z' fill='black' stroke='black'/%3E%3C/svg%3E%0A");
      background-position: left 1rem;
      background-size: 0.9375rem 0.9375rem;
      display: inline-flex;
      height: 2.75rem;
      padding-left: 1.375rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .post__comment-counter {
      background-image: url("data:image/svg+xml,%3Csvg width='80' height='74' viewBox='0 0 80 74' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M13.8333 56.9367V56.4367H13.3333H0.5V0.833374H79.5V56.4367H36.6667H36.5059L36.3753 56.5304L13.8333 72.693V56.9367Z' stroke='%23D8D8D8'/%3E%3C/svg%3E%0A");
      background-position: center center;
      background-size: 5rem 5rem;
      height: 5rem;
      left: 1.25rem;
      padding-top: 0.9375rem;
      position: absolute;
      text-align: center;
      margin-top: 5.375rem;
      width: 5rem;
    }
  }
  @media only screen and (min-width: 1140px) {
    .post__comment-counter {
      left: calc(100% / 12);
    }
  }
  .post__comment-counter .count {
    font-weight: 700;
  }
  @media only screen and (min-width: 960px) {
    .post__comment-counter .count {
      display: block;
      font-size: 1.125rem;
      margin-bottom: 0.125rem;
    }
  }
  @media only screen and (max-width: 959px) {
    .post__comment-counter .label {
      margin-left: 0.1875rem;
    }
  }
  @media only screen and (min-width: 960px) {
    .post__comment-counter .label {
      font-size: 0.75rem;
    }
  }

  .block__list .asset {
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .block__list .asset__descriptor a {
    font-size: 0.8125rem;
  }

  .block__list .asset__thumbnail {
    max-width: 12.8125rem;
  }

  .block__list .asset__title {
    font-size: 1.3125rem;
  }

  .comments {
    margin-bottom: 2.5rem;
  }
  .comments .section__container {
    align-items: center;
    flex-flow: column nowrap;
  }
  .comments img {
    max-width: 710px;
  }

  .share__list {
    margin-bottom: 0;
  }
  .share__list li:not(:last-of-type) {
    margin-right: 0.5rem;
  }

  .share__button {
    align-items: center;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    height: 2.75rem;
    overflow: hidden;
    width: 2.75rem;
  }
  @media only screen and (min-width: 900px) {
    .share__button {
      border: 0.0625rem solid #e7e5e4;
    }
  }
  .share__button * {
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }
  .share__button.facebook {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 8 17' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7.688 5.82l-.384 2.713H5.196v7.75H2.033v-7.75H.5V5.82h1.533V4.076c0-1.259.575-3.293 3.259-3.293h2.396v2.615H5.962c-.287 0-.67.097-.67.775V5.82h2.396' fill='%233B5998' fill-rule='nonzero'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: auto 1.0625rem;
  }
  .share__button.twitter {
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 17 14' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M14.725 4.111v.402c0 4.32-3.28 9.242-9.143 9.242-1.888 0-3.578-.502-4.97-1.507h.796c1.49 0 2.981-.502 4.074-1.406-1.39 0-2.583-1.005-3.08-2.31.198 0 .397.1.596.1.298 0 .596 0 .894-.1C2.402 8.23 1.31 6.923 1.31 5.316c.397.2.894.402 1.49.402-.894-.603-1.49-1.608-1.49-2.713 0-.603.198-1.205.397-1.708a8.943 8.943 0 0 0 6.758 3.416c-.1-.2-.1-.502-.1-.703 0-1.808 1.491-3.315 3.28-3.315.894 0 1.789.401 2.385 1.004.696-.1 1.49-.402 2.087-.803-.199.803-.795 1.406-1.391 1.808.695-.1 1.292-.302 1.888-.502-.696.904-1.292 1.506-1.888 1.908' fill='%234099FF' fill-rule='nonzero'%3E%3C/path%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: auto 0.9375rem;
  }
  .share__button.more {
    background-image: url("data:image/svg+xml,%3Csvg width='16' height='4' viewBox='0 0 16 4' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M4 2C4 3.10467 3.10467 4 2 4C0.895333 4 0 3.10467 0 2C0 0.895333 0.895333 0 2 0C3.10467 0 4 0.895333 4 2ZM10 2C10 3.10467 9.10467 4 8 4C6.89533 4 6 3.10467 6 2C6 0.895333 6.89533 0 8 0C9.10467 0 10 0.895333 10 2ZM16 2C16 3.10467 15.1047 4 14 4C12.8953 4 12 3.10467 12 2C12 0.895333 12.8953 0 14 0C15.1047 0 16 0.895333 16 2Z' fill='black'/%3E%3C/svg%3E%0A");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 0.9375rem auto;
  }

  .text-ad-container,
  .rich-text .text-ad-container {
    border-bottom: 0.0625rem solid #e7e5e4;
    border-top: 0.0625rem solid #e7e5e4;
    display: block;
    margin: 2em 0;
    padding: 0.5rem 0 1.5rem;
  }
  @media (min-width: 48rem) {
    .text-ad-container,
    .rich-text .text-ad-container {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }
  .text-ad-container .media,
  .rich-text .text-ad-container .media {
    background-color: #f7f5f4;
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  .text-ad-container .media .content,
  .text-ad-container .media > a,
  .rich-text .text-ad-container .media .content,
  .rich-text .text-ad-container .media > a {
    bottom: 0;
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  }
  .text-ad-container .media img,
  .rich-text .text-ad-container .media img {
    height: 100%;
    left: 100%;
    margin-left: -200%;
    max-width: none;
    position: relative;
    width: auto;
  }
  .text-ad-container .media-left,
  .rich-text .text-ad-container .media-left {
    display: flex;
    flex-flow: row wrap;
  }
  @media (max-width: 47.9375rem) {
    .text-ad-container .media-left,
    .rich-text .text-ad-container .media-left {
      align-items: flex-start;
    }
  }
  @media (min-width: 48rem) {
    .text-ad-container .media-left,
    .rich-text .text-ad-container .media-left {
      align-items: center;
    }
  }
  .text-ad-container .media.ad-img-container,
  .rich-text .text-ad-container .media.ad-img-container {
    max-width: 18.75rem;
    width: calc(100% / 3);
  }
  .text-ad-container .media-content,
  .rich-text .text-ad-container .media-content {
    padding-left: 1.5rem;
    flex: 1;
  }
  .text-ad-container .media-content > *:not(:last-of-type),
  .rich-text .text-ad-container .media-content > *:not(:last-of-type) {
    margin-bottom: 0;
  }
  .text-ad-container .media-content p,
  .rich-text .text-ad-container .media-content p {
    font-size: 0.875rem;
  }
  .text-ad-container h3,
  .rich-text .text-ad-container h3 {
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
  .text-ad-container .ad-brand p,
  .rich-text .text-ad-container .ad-brand p {
    color: #263238;
    font-size: 0.8125rem;
    padding-top: 0.3125rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  .text-ad-container .button,
  .rich-text .text-ad-container .button {
    align-items: center;
    background-color: #e7e5e4;
    border-bottom: none;
    border-radius: 0.1875rem;
    color: #000000;
    display: inline-flex;
    font-size: 0.875rem;
    justify-content: center;
    letter-spacing: 0.04em;
    min-height: 2.375rem;
    padding: 0 0.875rem;
  }

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

  .post-text > div,
  .post .newsletter,
  .post__meta--bottom .post__byline,
  .post__tags {
    max-width: 710px;
    width: 100%;
  }

  .block-ad {
    margin: 0 auto;
  }

  main {
    padding: 2rem 0 6rem;
  }

  .tbd {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f7f5f4;
    border-bottom: 2px solid white;
    min-height: 9.375rem;
    font-size: 0.75rem;
    text-transform: uppercase;
    flex-flow: column nowrap;
  }
  .tbd > * {
    margin-bottom: 0.5rem;
  }

  *,
  *:before,
  *:after {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
  }

  body {
    font-family: sans-serif;
    font-size: 1rem;
    line-height: 1.4;
    margin: 0;
    padding: 0;
    position: relative;
    word-spacing: 0.01em;
  }

  body,
  html {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  img {
    height: auto;
  }

  a {
    color: #000000;
    cursor: pointer;
  }

  .screenreader {
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .screensize {
    align-items: center;
    background-color: #000000;
    color: #ffffff;
    display: none;
    font-size: 0.75rem;
    height: 1.5rem;
    padding: 0 1rem;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 10;
  }
  .screensize > * {
    display: none;
  }
  @media (min-width: 62.5rem) {
    .screensize__xl {
      display: block;
    }
  }
  @media (min-width: 71.25rem) {
    .screensize__xl-feature {
      display: block;
    }
  }
  @media (min-width: 48rem) and (max-width: 62.4375rem) {
    .screensize__l {
      display: block;
    }
  }
  @media (min-width: 40rem) and (max-width: 47.9375rem) {
    .screensize__m {
      display: block;
    }
  }
  @media (min-width: 20rem) and (max-width: 39.9375rem) {
    .screensize__s {
      display: block;
    }
  }

  .desktop {
    display: block;
  }
  @media (max-width: 47.9375rem) {
    .desktop {
      display: none;
    }
  }

  .mobile {
    display: block;
  }
  @media (min-width: 48rem) {
    .mobile {
      display: none;
    }
  }

  .block-ad {
    line-height: 0;
    margin-bottom: 2.5rem;
    text-align: center;
  }
  .block-ad img {
    margin: 0 auto;
  }

  .block__cta {
    font-weight: 700;
  }

  .section-ad.top {
    border-top: none;
  }
`;

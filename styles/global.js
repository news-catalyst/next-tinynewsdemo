import css from 'styled-jsx/css';

export default css.global`
  @charset "UTF-8";
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

  .dropdown {
    border-bottom: 0.0625rem solid #d1232a;
    padding-bottom: 0.0625rem;
  }
  .dropdown svg {
    position: relative;
    top: 0.125rem;
    width: 0.875rem;
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
  .asset .time-status {
    background-color: rgba(0, 0, 0, 0.82);
    border-radius: 0rem;
    bottom: 0.3125rem;
    color: #ffffff;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 0.75rem;
    font-weight: 400;
    left: 0.3125rem;
    letter-spacing: 0.05em;
    line-height: 1;
    overflow-y: hidden;
    padding: 0.25rem;
    position: relative;
    text-transform: uppercase;
    z-index: 1;
  }
  .asset .time-status::before {
    content: '\2023';
    font-size: 1.875rem;
    line-height: 0;
    margin-right: 0.1875rem;
    position: relative;
    top: 0.25rem;
  }
  .asset .time-status.live {
    background-color: #d1232a;
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    padding: 0.25rem 0.25rem 0.1875rem 0.25rem;
  }
  .asset .time-status.live::before {
    display: none;
  }
  .asset .time-status {
    position: absolute;
  }
  .asset__no-img .time-status {
    background-color: transparent;
    color: #000000;
    font-size: 0.95em;
    font-weight: 400;
    left: 0;
    letter-spacing: 0.05em;
    margin-right: 0.35em;
    position: relative;
    padding: 0;
    top: 0;
  }
  .asset__no-img .time-status::before {
    content: '\2023';
    font-size: 2em;
    line-height: 0;
    margin-right: 0.125rem;
    position: relative;
    top: 0.1em;
  }
  .asset__no-img .time-status.live {
    background-color: transparent;
    color: #d1232a;
    font-size: 0.92em;
    font-weight: 500;
    letter-spacing: 0.05em;
    margin-right: 0;
    padding-left: 0;
  }
  .asset__no-img .time-status.live .pulse {
    margin-right: 0.375rem;
  }
  .asset__no-img .time-status.upcoming {
    background-color: #000000;
    color: #ffffff;
    font-size: 0.85em;
    height: 1.4em;
    margin-right: 0.5rem;
    padding: 0.125rem 0.25rem;
    line-height: 1;
  }
  .asset__no-img .time-status.upcoming::before {
    display: none;
  }
  .asset .pulse {
    display: inline-block;
    width: 0.4375rem;
    height: 0.4375rem;
    border-radius: 50%;
    background: #d1232a;
    cursor: pointer;
    box-shadow: 0 0 0 rgba(209, 35, 42, 0.4);
    animation: pulse 2s infinite;
    margin-right: 0.25rem;
    position: relative;
    top: -0.15em;
  }
  .asset:hover {
    animation: none;
  }

  @-webkit-keyframes pulse {
    0% {
      -webkit-box-shadow: 0 0 0 0 rgba(209, 35, 42, 0.4);
    }
    70% {
      -webkit-box-shadow: 0 0 0 10px rgba(209, 35, 42, 0);
    }
    100% {
      -webkit-box-shadow: 0 0 0 0 rgba(209, 35, 42, 0);
    }
  }

  @keyframes pulse {
    0% {
      -moz-box-shadow: 0 0 0 0 rgba(209, 35, 42, 0.4);
      box-shadow: 0 0 0 0 rgba(209, 35, 42, 0.4);
    }
    70% {
      -moz-box-shadow: 0 0 0 10px rgba(209, 35, 42, 0);
      box-shadow: 0 0 0 10px rgba(209, 35, 42, 0);
    }
    100% {
      -moz-box-shadow: 0 0 0 0 rgba(209, 35, 42, 0);
      box-shadow: 0 0 0 0 rgba(209, 35, 42, 0);
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
  .asset__promo {
    background-color: #ffffff;
    border: 0.1875rem solid #e7e5e4;
    height: 7.5rem;
    padding: 0.625rem;
    width: 100%;
  }
  .asset__promo-utility {
    border-color: #001d68;
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    margin-bottom: 0;
  }
  .asset__promo-utility figure {
    background-color: #f7f5f4;
    overflow: hidden;
    position: relative;
    width: 100%;
    width: 3.125rem;
  }
  .asset__promo-utility figure::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  .asset__promo-utility figure .content,
  .asset__promo-utility figure > a {
    bottom: 0;
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  }
  .asset__promo-utility figure img {
    height: 100%;
    left: 100%;
    margin-left: -200%;
    max-width: none;
    position: relative;
    width: auto;
  }
  .asset__promo-utility .asset {
    justify-content: center;
  }
  .asset__promo-utility .asset__meta-container {
    align-self: center;
    display: flex;
    flex-flow: column;
    padding-right: 3.125rem;
    position: relative;
  }
  .asset__promo-utility .asset__title {
    color: #001d68;
  }
  .asset__promo-utility .asset__excerpt {
    color: #263238;
  }
  .asset__promo-utility .arrow-right {
    bottom: -3px;
    color: #001d68;
    font-size: 1.25rem;
    line-height: 1;
    position: absolute;
    right: 0;
    width: 1.25rem;
  }
  .asset__promo-house {
    justify-content: flex-start;
  }
  .asset__promo-house.list .asset {
    background-color: #ffffff;
  }

  .accordion {
    cursor: pointer;
  }
  .accordion__icon svg {
    height: 1em;
    position: relative;
    top: 0.125rem;
  }
  .accordion__horizontal {
    overflow: visible !important;
  }
  .accordion__horizontal li {
    display: flex;
    height: 17.5rem;
  }
  .accordion__horizontal .panel {
    background-color: #e7e5e4;
    margin: 0 !important;
    width: 0% !important;
  }
  .accordion__horizontal .panel__wrapper {
    border-left: 0.0625rem solid #e7e5e4;
    display: flex;
    flex-flow: column;
    font-size: 0.875rem;
    line-height: 1.55;
    justify-content: center;
    height: 100%;
    padding: 0.9375rem 1.25rem;
  }
  .accordion__horizontal .panel h5 {
    font-weight: 700;
    margin-bottom: 0.25rem;
  }
  .accordion__horizontal .panel p:not(:last-of-type) {
    margin-bottom: 1em;
  }
  .accordion__horizontal .active + .panel {
    background-color: #ffffff;
    border-bottom: 0.1875rem solid #e7e5e4;
    border-bottom-width: 0.125rem;
    border-top: 0.1875rem solid #e7e5e4;
    border-top-width: 0.125rem;
    border-right: 0.0625rem solid #e7e5e4;
    border-right-width: 0.125rem;
    width: 28% !important;
  }
  .accordion__horizontal .active {
    border-bottom: 0.1875rem solid #e7e5e4;
    border-bottom-width: 0.125rem;
    border-left: 0.0625rem solid #e7e5e4;
    border-left-width: 0.125rem;
    border-top: 0.1875rem solid #e7e5e4;
    border-top-width: 0.125rem;
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
      max-width: 44.375rem !important;
      width: 100% !important;
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
    margin: 0 auto !important;
  }

  main {
    padding: 2rem 0 6rem;
  }

  .site-header {
    border-bottom: 0.0625rem solid #e7e5e4;
    box-shadow: 0rem 0.0625rem 0.4375rem rgba(0, 0, 0, 0.12);
    overflow: hidden;
    width: 100%;
  }
  @media (max-width: 62.4375rem) {
    .site-header::before {
      background-color: #ffffff;
      border-bottom: 0.0625rem solid #e7e5e4;
      content: '';
      height: 3.125rem;
      left: 0;
      position: absolute;
      position: fixed;
      right: 0;
      top: 0;
      width: 100%;
      z-index: 3;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header {
      background-color: #ffffff;
      position: fixed;
      height: 7.75rem;
      top: 0;
      transform: translateY(0);
      transition: transform 0.24s ease;
      z-index: 3;
    }
    .site-header::before {
      background-color: #001d68;
      content: '';
      height: 0.1875rem;
      left: 0;
      position: absolute;
      right: 0;
      top: 5rem;
      transform: translateY(0);
      transition: transform 0.24s ease;
      width: 100%;
      z-index: 3;
    }
  }
  .site-header__container {
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    max-width: 1366px;
    padding: 0 0.9375rem;
    width: 100%;
    flex-flow: row wrap;
    height: 100%;
    position: relative;
  }
  @media (min-width: 48rem) {
    .site-header__container {
      padding: 0 1.25rem;
    }
  }
  @media (max-width: 62.4375rem) {
    .site-header__container {
      padding: 3.125rem 0 0 0;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__container {
      padding-right: 0;
    }
  }
  .site-header__container > * {
    align-items: center;
    display: flex;
  }
  .site-header__logo {
    align-items: center;
    height: 3rem;
    order: 1;
  }
  @media (max-width: 62.4375rem) {
    .site-header__logo {
      flex: 1;
      margin-left: 3.75rem;
      position: fixed;
      top: 0.125rem;
      width: 100%;
      z-index: 3;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__logo {
      /*border-right: $border-thin;*/
      height: 5rem;
      order: 1;
      padding-right: 0.9375rem;
    }
  }
  .site-header__logo a {
    display: block;
    height: 1.625rem;
  }
  @media (min-width: 62.5rem) {
    .site-header__logo a {
      height: 2.25rem;
    }
  }
  .site-header__logo svg {
    height: 100%;
  }
  .site-header__secondary-links {
    height: 3rem;
  }
  @media (max-width: 62.4375rem) {
    .site-header__secondary-links {
      display: none;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__secondary-links {
      flex: 1;
      font-size: 0.6875rem;
      height: 5rem;
      order: 2;
      padding-right: 0.625rem;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__secondary-links {
      font-size: 0.75rem;
    }
  }
  .site-header__secondary-links nav {
    width: 100%;
  }
  .site-header__secondary-links ul {
    display: flex;
    flex-flow: row nowrap;
  }
  .site-header__secondary-links ul li {
    flex-shrink: 0;
  }
  @media (max-width: 47.9375rem) {
    .site-header__secondary-links ul li {
      padding: 0.9375rem;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__secondary-links ul {
      justify-content: space-around;
    }
  }
  @media (min-width: 71.25rem) {
    .site-header__secondary-links ul {
      justify-content: flex-start;
    }
  }
  @media (min-width: 71.25rem) {
    .site-header__secondary-links a {
      padding: 0 0.75rem;
    }
  }
  .site-header__alert {
    order: 4;
    width: 100%;
  }
  @media (max-width: 62.4375rem) {
    .site-header__alert {
      background-color: #f7f5f4;
      border-bottom: 0.0625rem solid #e7e5e4;
      border-top: 0.1875rem solid #001d68;
      padding: 0.625rem 0.9375rem;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__alert {
      border-left: 0.0625rem solid #e7e5e4;
      height: 5rem;
      padding-right: 1.25rem;
      order: 3;
      overflow-y: hidden;
      width: calc(100% / 8 * 3);
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__alert {
      width: calc(100% / 12 * 5);
    }
  }
  .site-header__alert .asset {
    align-content: flex-start;
    align-items: flex-start;
    flex-flow: row nowrap;
    align-items: center;
  }
  @media (max-width: 62.4375rem) {
    .site-header__alert .asset {
      display: none;
    }
  }
  .site-header__alert .asset__thumbnail {
    margin-bottom: 0;
    margin-left: 1.25rem;
    max-width: 8.75rem;
    order: 2;
    width: calc(100% / 3);
  }
  @media (max-width: 39.9375rem) {
    .site-header__alert .asset__thumbnail {
      max-width: 6.875rem;
    }
  }
  .site-header__alert .asset__meta-container {
    flex: 1;
  }
  .site-header__alert .asset__thumbnail {
    margin-left: 0;
    order: 1;
    width: 8.875rem;
  }
  .site-header__alert .asset__meta-container {
    height: 100%;
    order: 2;
  }
  @media (min-width: 62.5rem) {
    .site-header__alert .asset__meta-container {
      padding-left: 0.9375rem;
    }
  }
  .site-header__alert .asset__title {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.005em;
    line-height: 1.38;
    text-transform: none;
    font-weight: 500;
  }
  @media (min-width: 62.5rem) {
    .site-header__alert .asset__no-img {
      display: none;
    }
  }
  .site-header__nav {
    flex-flow: row nowrap;
    height: 2.375rem;
    order: 5;
    width: calc(100% - 152px);
  }
  @media (max-width: 62.4375rem) {
    .site-header__nav {
      -ms-overflow-style: none;
      align-items: stretch;
      flex-flow: row nowrap;
      flex-grow: 1;
      overflow-y: hidden;
      overflow-x: scroll;
      padding-left: 0.9375rem;
      /*transform: translateX(0);*/
    }
    .site-header__nav::-webkit-scrollbar {
      display: none;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__nav {
      flex: 1;
      height: 2.75rem;
      order: 4;
      width: auto;
    }
  }
  .site-header__nav .block {
    display: flex;
    flex-flow: row nowrap;
    height: 100%;
    width: 100%;
  }
  @media (max-width: 62.4375rem) {
    .site-header__nav nav {
      order: 2;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__nav nav {
      flex: 1;
    }
  }
  .site-header__nav ul {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    height: 100%;
  }
  .site-header__nav ul li {
    flex-shrink: 0;
  }
  @media (max-width: 47.9375rem) {
    .site-header__nav ul li {
      padding: 0.9375rem;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__nav ul {
      justify-content: space-around;
      padding-top: 0.125rem;
    }
  }
  @media (max-width: 62.4375rem) {
    .site-header__nav li {
      padding: 0.9375rem;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__nav li {
      display: flex;
      height: 100%;
      padding: 0.625rem;
    }
  }
  .site-header__nav a {
    align-items: center;
    color: #00144a;
    display: flex;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 0.875rem;
    font-weight: 500;
    height: 100%;
    text-transform: uppercase;
  }
  .site-header__nav .icon-menu {
    align-items: center;
    display: flex;
    height: 100%;
    width: 3rem;
  }
  @media (max-width: 62.4375rem) {
    .site-header__nav .icon-menu {
      height: auto;
      position: fixed;
      top: 1.0625rem;
      z-index: 3;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__nav .icon-menu {
      border-right: 0.0625rem solid #e7e5e4;
      height: 2.75rem;
    }
  }
  .site-header__nav .icon-menu svg {
    height: 0.9375rem;
    margin-top: 0.0625rem;
  }
  .site-header__nav .icon-menu svg path {
    fill: #001d68;
  }
  .site-header__search {
    cursor: pointer;
    height: 3rem;
    order: 3;
    width: 3rem;
  }
  @media (max-width: 62.4375rem) {
    .site-header__search {
      justify-content: flex-end;
      padding-top: 0.1875rem;
      position: fixed;
      right: 5.0625rem;
      top: 0.0625rem;
      z-index: 3;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__search {
      border-left: 0.0625rem solid #e7e5e4;
      justify-content: center;
      height: 2.75rem;
      order: 5;
      padding-top: 0.1875rem;
    }
  }
  .site-header__search .icon-search svg {
    height: 1.375rem;
    margin-top: 0.125rem;
  }
  .site-header__weather {
    align-items: center;
    display: flex;
    flex-flow: row nowrap;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1rem;
    height: 2.375rem;
    order: 1;
    padding-top: 0.25rem;
    width: 6.25rem;
  }
  @media (max-width: 62.4375rem) {
    .site-header__weather {
      border-right: 0.0625rem solid #e7e5e4;
      padding-right: 0.9375rem;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__weather {
      border-left: 0.0625rem solid #e7e5e4;
      justify-content: center;
      height: 2.75rem;
      order: 6;
    }
  }
  .site-header__weather svg {
    height: 1.625rem;
  }
  .site-header__weather .temp {
    margin-left: 0.4375rem;
  }
  .site-header__auth {
    align-items: center;
    border-left: 0.0625rem solid #e7e5e4;
    cursor: pointer;
    flex-flow: row nowrap;
    height: 3.125rem;
    justify-content: flex-end;
    order: 3;
    width: 3.5rem;
  }
  @media (max-width: 62.4375rem) {
    .site-header__auth {
      padding-top: 0.1875rem;
      position: fixed;
      right: 0.9375rem;
      top: 0;
      z-index: 3;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header__auth {
      margin-right: 1.25rem;
      order: 7;
    }
  }
  .site-header__auth svg {
    height: 1.25rem;
  }
  .site-header__auth svg g {
    fill: #fd6047;
  }
  .site-header__auth .icon-dropdown {
    margin-left: 0.3125rem;
    padding-top: 0.1875rem;
  }
  .site-header__auth .icon-dropdown svg {
    fill: #7c7c7c;
    height: 1.0625rem;
  }
  .site-header__sidebar {
    bottom: 0;
    font-size: 0.875rem;
    height: 100%;
    left: -240px;
    -ms-overflow-style: none;
    overflow: -moz-scrollbars-none;
    overflow-y: scroll;
    position: fixed;
    top: 0;
    transition: all 0.18s linear;
    width: 15rem;
    z-index: 4;
  }
  .site-header__sidebar::-webkit-scrollbar {
    width: 0 !important;
  }
  .site-header__sidebar::before {
    background-color: #00144a;
    border-right: 0.0625rem solid #e7e5e4;
    content: '';
    height: 100%;
    position: absolute;
    width: 15rem;
    z-index: -1;
  }
  .site-header__sidebar.open {
    left: 0;
    width: 100%;
  }
  .site-header__sidebar .site-header__container {
    background-color: #00144a;
    display: flex;
    flex-flow: column nowrap;
    height: auto;
    margin: 0;
    padding: 0.5rem 0 1rem;
    position: relative;
    width: 15rem;
  }
  .site-header__sidebar .top {
    display: flex;
    flex-flow: column;
    width: 100%;
  }
  .site-header__sidebar #btn-close {
    width: 1.5rem;
  }
  .site-header__sidebar #btn-close svg {
    fill: #ffffff;
    height: auto;
    width: 100%;
  }
  .site-header__sidebar ul {
    width: 100%;
  }
  .site-header__sidebar li {
    padding: 0 1.25rem;
  }
  .site-header__sidebar li:hover .panel {
    display: block;
  }
  .site-header__sidebar nav {
    display: flex;
    flex-flow: column nowrap;
    width: 15rem;
  }
  .site-header__sidebar a {
    color: #ffffff;
  }
  .site-header__sidebar a:hover {
    text-decoration: underline;
  }
  .site-header__sidebar .link,
  .site-header__sidebar .accordion {
    font-weight: 700;
    line-height: 2.25rem;
  }
  .site-header__sidebar .link {
    align-items: center;
    display: flex;
    padding-top: 0.125rem;
    width: 100%;
  }
  .site-header__sidebar .link-home {
    border-bottom: 0.1875rem solid rgba(255, 255, 255, 0.2);
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    padding: 0 0.95rem 0.3rem 1.15rem;
    width: 100%;
  }
  .site-header__sidebar .accordion {
    cursor: pointer;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    text-align: left;
    width: 100%;
  }
  .active .site-header__sidebar .accordion__icon {
    background-color: red;
  }
  @media (min-width: 48rem) {
    .site-header__sidebar .accordion__icon {
      transform: rotate(135deg);
      -webkit-transform: rotate(135deg);
      -moz-transform: rotate(135deg);
      -o-transform: rotate(135deg);
      -ms-transform: rotate(134deg);
    }
  }
  .site-header__sidebar .accordion__icon svg {
    fill: #ffffff;
    height: 1em;
    position: relative;
    top: 0.125rem;
  }
  .site-header__sidebar .accordion__title a:not(:first-of-type) {
    font-weight: 400;
    margin-left: 0.7rem;
  }
  .site-header__sidebar .panel {
    background-color: #00144a;
    display: none;
  }
  @media (min-width: 48rem) {
    .site-header__sidebar .panel {
      background-color: #ffffff;
      border: 0.0625rem solid #e7e5e4;
      padding: 0.5rem 0;
      position: absolute;
      transform: translate(185px, -45px);
      z-index: 1;
    }
    .site-header__sidebar .panel::before {
      background-color: #ffffff;
      border-bottom: 0.0625rem solid #e7e5e4;
      border-right: 0.0625rem solid #e7e5e4;
      content: '';
      height: 1rem;
      left: -0.5625rem;
      position: absolute;
      top: 0.9375rem;
      transform: rotate(135deg);
      -webkit-transform: rotate(135deg);
      -moz-transform: rotate(135deg);
      -o-transform: rotate(135deg);
      -ms-transform: rotate(134deg);
      width: 1rem;
      z-index: -1;
    }
  }
  .site-header__sidebar .panel a {
    color: #ffffff;
    line-height: 2;
  }
  @media (min-width: 48rem) {
    .site-header__sidebar .panel a {
      color: #000000;
      line-height: 2.25;
    }
  }
  @media (max-width: 47.9375rem) {
    .site-header__sidebar .panel li {
      padding-left: 0;
    }
  }
  @media (min-width: 48rem) {
    .site-header__sidebar .panel li {
      padding-left: 1rem;
    }
  }
  .site-header__sidebar .menu__nav-secondary {
    border-top: 0.0625rem solid rgba(255, 255, 255, 0.25);
    font-size: 0.85rem;
    margin-top: 0.5rem;
    padding-top: 0.55rem;
  }
  .site-header__sidebar .menu__nav-secondary a {
    font-weight: 400;
    line-height: 2;
  }
  .site-header::before,
  .site-header .site-header__auth,
  .site-header .site-header__logo,
  .site-header .site-header__search,
  .site-header .site-header__nav .icon-menu {
    transition: transform 0.24s ease;
    transform: translateY(0);
  }
  @media (min-width: 62.5rem) {
    .site-header.headroom--not-top.headroom--pinned {
      height: 2.75rem;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header.headroom--not-top.headroom--pinned
      .site-header__secondary-links,
    .site-header.headroom--not-top.headroom--pinned .site-header__alert {
      display: none;
    }
  }
  .site-header.headroom--not-top.headroom--pinned .site-header__nav .icon-menu {
    padding-left: 0.1875rem;
  }
  @media (max-width: 71.1875rem) {
    .site-header.headroom--not-top.headroom--pinned
      .site-header__nav
      ul
      li:last-of-type {
      display: none;
    }
  }
  .site-header.headroom--not-top.headroom--pinned .site-header__logo {
    height: 2.75rem;
  }
  @media (max-width: 62.4375rem) {
    .site-header.headroom--not-top.headroom--pinned .site-header__logo {
      height: 3rem;
    }
  }
  @media (min-width: 48rem) {
    .site-header.headroom--not-top.headroom--pinned .site-header__logo a {
      height: 1.75rem;
    }
  }
  @media (min-width: 62.5rem) {
    .site-header.headroom--not-top.headroom--pinned .site-header__auth {
      height: 2.75rem;
    }
  }
  @media (max-width: 62.4375rem) {
    .site-header.headroom--pinned::before,
    .site-header.headroom--pinned .site-header__auth,
    .site-header.headroom--pinned .site-header__logo,
    .site-header.headroom--pinned .site-header__search,
    .site-header.headroom--pinned .site-header__nav .icon-menu {
      transform: translateY(0);
    }
  }
  @media (min-width: 62.5rem) {
    .site-header.headroom--pinned {
      transform: translateY(0);
    }
  }
  @media (max-width: 62.4375rem) {
    .site-header.headroom--unpinned::before,
    .site-header.headroom--unpinned .site-header__auth,
    .site-header.headroom--unpinned .site-header__logo,
    .site-header.headroom--unpinned .site-header__search,
    .site-header.headroom--unpinned .site-header__nav .icon-menu {
      transform: translateY(-50px);
    }
  }
  @media (min-width: 62.5rem) {
    .site-header.headroom--unpinned {
      transform: translateY(-140px);
    }
  }

  .site-footer {
    border-top: 0.1875rem solid #001d68;
    padding: 0.75rem 0;
    width: 100%;
  }
  .site-footer a:hover {
    text-decoration: underline;
  }
  .site-footer__container {
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    max-width: 1366px;
    padding: 0 0.9375rem;
    width: 100%;
  }
  @media (min-width: 48rem) {
    .site-footer__container {
      padding: 0 1.25rem;
    }
  }
  .site-footer .block-top,
  .site-footer .block-bottom {
    width: 100%;
  }
  .site-footer .block-1,
  .site-footer .block-2,
  .site-footer .block-3,
  .site-footer .block-4 {
    display: flex;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 0.875rem;
    flex-flow: column nowrap;
  }
  @media (max-width: 39.9375rem) {
    .site-footer .block-1,
    .site-footer .block-2,
    .site-footer .block-3,
    .site-footer .block-4 {
      margin-bottom: 0.9375rem;
      width: 100%;
    }
  }
  @media (min-width: 40rem) {
    .site-footer .block-1,
    .site-footer .block-2,
    .site-footer .block-3,
    .site-footer .block-4 {
      width: calc(100% / 4);
    }
    .site-footer .block-1:not(:last-of-type),
    .site-footer .block-2:not(:last-of-type),
    .site-footer .block-3:not(:last-of-type),
    .site-footer .block-4:not(:last-of-type) {
      padding-right: 1.875rem;
    }
  }
  @media (min-width: 62.5rem) {
    .site-footer .block-1,
    .site-footer .block-2,
    .site-footer .block-3,
    .site-footer .block-4 {
      width: calc(100% / 4);
    }
    .site-footer .block-1:not(:last-of-type),
    .site-footer .block-2:not(:last-of-type),
    .site-footer .block-3:not(:last-of-type),
    .site-footer .block-4:not(:last-of-type) {
      padding-right: 1.875rem;
    }
  }
  @media (min-width: 71.25rem) {
    .site-footer .block-1,
    .site-footer .block-2,
    .site-footer .block-3,
    .site-footer .block-4 {
      width: calc(100% / 4);
    }
  }
  .site-footer .block-1 a,
  .site-footer .block-2 a,
  .site-footer .block-3 a,
  .site-footer .block-4 a {
    color: #001d68;
    display: block;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 0.875rem;
    line-height: 1.4;
    padding: 0.3125rem 0;
  }
  @media (max-width: 39.9375rem) {
    .site-footer .block-1 ul,
    .site-footer .block-2 ul,
    .site-footer .block-3 ul,
    .site-footer .block-4 ul {
      border-bottom: 0.0625rem solid #e7e5e4;
      display: flex;
      flex-flow: row wrap;
      padding-bottom: 0.625rem;
      margin-bottom: 0;
    }
  }
  .site-footer .block-1 li:not(:last-of-type),
  .site-footer .block-2 li:not(:last-of-type),
  .site-footer .block-3 li:not(:last-of-type),
  .site-footer .block-4 li:not(:last-of-type) {
    padding-right: 1.25rem;
  }
  .site-footer .block-top {
    border-bottom: 0.0625rem solid #e7e5e4;
    display: flex;
    flex-flow: row nowrap;
    padding-bottom: 0.625rem;
  }
  @media (max-width: 39.9375rem) {
    .site-footer .block-top {
      margin-bottom: 0.9375rem;
    }
  }
  .site-footer .block-top ul {
    align-items: center;
    display: flex;
    flex-flow: row wrap;
    width: auto;
  }
  .site-footer .block-top li {
    color: #00144a;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 0.6875rem;
    letter-spacing: 0.05em;
    line-height: 1;
    margin-left: 0.625rem;
    padding-bottom: 0.1875rem;
    text-transform: uppercase;
  }
  .site-footer .block-top li::after {
    content: '·';
    color: #d1232a;
    display: inline-block;
    font-size: 1.6875rem;
    height: 0.6875rem;
    line-height: 0.37;
    margin-left: 0.625rem;
    overflow: hidden;
  }
  .site-footer .block-top li:last-of-type::after {
    color: #ffffff;
  }
  .site-footer .block-bottom {
    border-top: 0.0625rem solid #e7e5e4;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 0.75rem;
    padding-top: 0.625rem;
  }
  @media (min-width: 40rem) {
    .site-footer .block-bottom {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
    }
  }
  .site-footer .block-bottom ul {
    display: flex;
    flex-flow: row wrap;
    width: auto;
  }
  .site-footer .block-bottom ul a {
    display: block;
    padding: 0.3125rem 0.625rem;
  }
  .site-footer .block__copyright {
    color: #565454;
  }
  @media (max-width: 39.9375rem) {
    .site-footer .block__copyright {
      margin-top: 0.625rem;
      padding: 0 0.625rem;
    }
  }
  @media (min-width: 40rem) {
    .site-footer .block__copyright {
      padding: 0.3125rem 0.625rem 0;
    }
  }
  .site-footer .block-social {
    flex-direction: row;
    margin-bottom: 0;
  }
  .site-footer .block-social__btn {
    align-items: center;
    border: 0.0625rem solid #e7e5e4;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    height: 2.375rem;
    width: 2.375rem;
    margin-bottom: 0;
  }
  .site-footer .block-social__btn:not(:last-of-type) {
    margin-right: 0.625rem;
  }
  .site-footer .block-social__btn svg {
    height: 0.8125rem;
  }
  .site-footer .block-social .facebook svg {
    height: 0.9375rem;
  }
  .site-footer__logo {
    width: 7.5rem;
  }
  @media (min-width: 62.5rem) {
    .site-footer__logo {
      margin-right: 0.625rem;
    }
  }
  .site-footer h3 {
    color: #001d68;
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    margin-bottom: 0.3125rem;
    text-transform: uppercase;
  }

  /*
** template 1: two column (300px column)
**
*/
  .template-1 {
    margin-bottom: 2.5rem;
  }
  .template-1 .section__container {
    display: flex;
    flex-flow: row wrap;
    margin: 0 auto;
    max-width: 1366px;
    padding: 0 0.9375rem;
    width: 100%;
  }
  @media (min-width: 48rem) {
    .template-1 .section__container {
      padding: 0 1.25rem;
    }
  }
  @media (min-width: 48rem) {
    .template-1 .col-1 {
      border-right: 0.0625rem solid #e7e5e4;
      order: 1;
      padding-right: 1.25rem;
      width: calc(100% - 320px);
    }
  }
  @media (min-width: 62.5rem) {
    .template-1 .col-1 {
      padding-right: 1.875rem;
      width: calc(100% - 330px);
    }
  }
  .template-1 .col-2 {
    display: flex;
    flex-flow: column nowrap;
    width: 100%;
  }
  @media (max-width: 47.9375rem) {
    .template-1 .col-2 {
      border-top: 0.0625rem solid #e7e5e4;
      margin-bottom: 0;
      padding-top: 0.75rem;
    }
  }
  @media (min-width: 48rem) {
    .template-1 .col-2 {
      align-self: stretch;
      flex: 1;
      order: 2;
      width: 20rem;
      padding-left: 1.25rem;
    }
  }
  @media (min-width: 62.5rem) {
    .template-1 .col-2 {
      width: 20.625rem;
      padding-left: 1.875rem;
    }
  }
  .template-1 .block-ad {
    padding-top: 0.9375rem;
  }
  @media (min-width: 48rem) {
    .template-1 .block-ad {
      position: sticky;
      top: 0;
    }
  }
  @media (max-width: 47.9375rem) {
    .template-1 .block-ad {
      margin-bottom: 0;
    }
  }
  @media (min-width: 48rem) {
    .template-1 .block-ad {
      margin-bottom: 0.625rem;
    }
  }
  .template-1 .block-ad__wrapper {
    height: 100%;
  }

  /*
** template 2: full width
**
*/
  .template-2 {
    background-color: transparent;
  }

  .styleguide {
    background-color: #ffffff;
  }
  .styleguide-header {
    background-color: #ffffff;
    border-bottom: 0.0625rem solid #e7e5e4;
    box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.08);
    height: 3rem;
    left: 0;
    position: fixed;
    width: 100%;
    z-index: 3;
  }
  @media (min-width: 62.5rem) {
    .styleguide-header {
      grid-template-columns: auto;
      transform: translateY(-124px);
    }
  }
  .styleguide-header__wrapper {
    display: grid;
    grid-template-columns: 3.25rem auto;
    height: 100%;
    width: 100%;
  }
  @media (min-width: 71.25rem) {
    .styleguide-header__wrapper {
      grid-template-columns: auto;
    }
  }
  .styleguide-header__logo {
    align-items: center;
    border-left: 0.0625rem solid #e7e5e4;
    display: flex;
    flex-flow: row nowrap;
    height: 100%;
    padding-left: 1.25rem;
    width: 100%;
  }
  @media (min-width: 71.25rem) {
    .styleguide-header__menu-btn {
      display: none;
    }
  }
  .styleguide-header__menu-btn svg {
    fill: #000000;
    height: 1.5rem;
    position: relative;
    top: 0.125rem;
  }
  .styleguide #btn-close {
    position: absolute;
    top: 0;
    right: 1rem;
    transform: translateY(-67px);
    width: 1.5rem;
  }
  .styleguide #btn-close svg {
    fill: #000000;
    height: auto;
    width: 100%;
  }
  .styleguide-page__wrapper {
    display: grid;
    position: relative;
    width: 100%;
  }
  @media (min-width: 71.25rem) {
    .styleguide-page__wrapper {
      grid-template-columns: 15rem auto;
    }
  }
  .styleguide-page__sidebar {
    background-color: #ffffff;
    bottom: 0;
    border-right: 0.0625rem solid #e7e5e4;
    font-size: 0.875rem;
    height: 100%;
    left: 0;
    padding: 5rem 0;
    position: fixed;
    top: 0;
    transition: transform 0.18s linear;
    width: 15rem;
  }
  @media (max-width: 71.1875rem) {
    .styleguide-page__sidebar {
      transform: translateX(-240px);
    }
    .styleguide-page__sidebar.open {
      border-bottom: 0.0625rem solid #e7e5e4;
      box-shadow: 0 0.0625rem 0.125rem rgba(0, 0, 0, 0.08);
      display: block;
      transform: translateX(0);
      z-index: 3;
    }
  }
  @media (min-width: 71.25rem) {
    .styleguide-page__sidebar {
      bottom: 0;
      border: 0.0625rem solid #e7e5e4;
      font-size: 0.875rem;
      height: 100%;
      left: 0;
      padding: 5rem 0;
      position: fixed;
      top: 0;
    }
  }
  .styleguide-page__sidebar-container {
    display: flex;
    flex-flow: column nowrap;
    padding: 0 1.25rem;
  }
  .styleguide-page__sidebar ul {
    width: 100%;
  }
  .styleguide-page__sidebar .link,
  .styleguide-page__sidebar .accordion {
    font-weight: 700;
    line-height: 2.25rem;
  }
  .styleguide-page__sidebar .link {
    align-items: center;
    display: flex;
    padding-top: 0.125rem;
    width: 100%;
  }
  .styleguide-page__sidebar .accordion {
    cursor: pointer;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    text-align: left;
    width: 100%;
  }
  .styleguide-page__sidebar .accordion__icon svg {
    height: 1em;
    position: relative;
    top: 0.125rem;
  }
  .styleguide-page__sidebar .panel {
    display: none;
    overflow: hidden;
  }
  .styleguide-page__sidebar .panel a {
    line-height: 2;
  }
  .styleguide-page__main {
    padding: 0;
    width: 100%;
  }
  @media (min-width: 71.25rem) {
    .styleguide-page__main {
      grid-column-start: 2;
    }
  }
  .styleguide-page__main__inner {
    padding-bottom: 5rem;
    width: 100%;
  }
  @media (min-width: 71.25rem) {
    .styleguide-page__main__inner {
      margin: 0 auto;
      min-width: 900px;
      max-width: 1126px;
    }
  }
  .styleguide-page__main__section {
    display: block;
    padding: 5rem 1.25rem 0;
  }
  .styleguide-page__main__section .inner {
    padding-top: 5rem;
  }
  .styleguide-page__main h1,
  .styleguide-page__main h2,
  .styleguide-page__main h3,
  .styleguide-page__main h4,
  .styleguide-page__main h5,
  .styleguide-page__main h6 {
    margin-bottom: 1.15rem;
  }
  .styleguide-page__main h2 {
    font-size: 2.25rem;
    letter-spacing: -0.02em;
  }
  .styleguide-page__main h3 {
    font-size: 1.5rem;
    letter-spacing: -0.014em;
  }
  .styleguide-page__main h4 {
    font-size: 1.125rem;
    letter-spacing: -0.006em;
  }
  .styleguide-page__main h5 {
    font-weight: 700;
  }
  .styleguide-page__main p {
    font-size: 0.875rem;
    line-height: 1.55;
    margin: 0 0 1em 0;
    max-width: 40rem;
  }
  .styleguide-page__main b {
    font-weight: 700;
  }
  .styleguide-page__main .inner-block {
    margin-bottom: 3rem;
    display: flex;
    flex-flow: row wrap;
    width: 100%;
  }
  .styleguide-page__main .inner-block__color li {
    background-color: #000000;
    color: #ffffff;
    display: flex;
    flex-flow: column nowrap;
    font-size: 0.75rem;
    justify-content: space-between;
    padding: 1rem;
  }
  .styleguide-page__main .inner-block__color li:not(:last-of-type) {
    height: 3.125rem;
    margin-bottom: 0.0625rem;
  }
  .styleguide-page__main .inner-block__color li:first-of-type {
    height: 6.25rem;
  }
  .styleguide-page__main .inner-block__color.primary li:nth-child(1) {
    background-color: #001d68;
  }
  .styleguide-page__main .inner-block__color.primary li:nth-child(2) {
    background-color: #193377;
  }
  .styleguide-page__main .inner-block__color.primary li:nth-child(3) {
    background-color: #001d68;
  }
  .styleguide-page__main .inner-block__color.primary li:nth-child(4) {
    background-color: #00144a;
  }
  .styleguide-page__main .inner-block__color.secondary li:nth-child(1) {
    background-color: #2594e3;
  }
  .styleguide-page__main .inner-block__color.secondary li:nth-child(2) {
    background-color: #50a9e8;
  }
  .styleguide-page__main .inner-block__color.secondary li:nth-child(3) {
    background-color: #2594e3;
  }
  .styleguide-page__main .inner-block__color.secondary li:nth-child(4) {
    background-color: #1d76b5;
  }
  .styleguide-page__main .inner-block__color.red-1 li:nth-child(1) {
    background-color: #d1232a;
  }
  .styleguide-page__main .inner-block__color.red-1 li:nth-child(2) {
    background-color: #ff2b32;
  }
  .styleguide-page__main .inner-block__color.yellow li {
    color: #000000;
  }
  .styleguide-page__main .inner-block__color.yellow li:nth-child(1) {
    background-color: #ffec19;
  }
  .styleguide-page__main .inner-block__color.yellow li:nth-child(2) {
    background-color: #fff15e;
  }
  .styleguide-page__main .inner-block__color.yellow li:nth-child(3) {
    background-color: #ffec19;
  }
  .styleguide-page__main .inner-block__color.yellow li:nth-child(4) {
    background-color: #e5d416;
  }
  .styleguide-page__main .inner-block__color.green li:nth-child(1) {
    background-color: #72b509;
  }
  .styleguide-page__main .inner-block__color.green li:nth-child(2) {
    background-color: #8ec33a;
  }
  .styleguide-page__main .inner-block__color.green li:nth-child(3) {
    background-color: #72b509;
  }
  .styleguide-page__main .inner-block__color.green li:nth-child(4) {
    background-color: #66a208;
  }
  .styleguide-page__main .inner-block__color.purple li:nth-child(1) {
    background-color: #33109c;
  }
  .styleguide-page__main .inner-block__color.purple li:nth-child(2) {
    background-color: #4727a5;
  }
  .styleguide-page__main .inner-block__color.purple li:nth-child(3) {
    background-color: #33109c;
  }
  .styleguide-page__main .inner-block__color.purple li:nth-child(4) {
    background-color: #280c7c;
  }
  .styleguide-page__main .inner-block__color.grayscale {
    display: flex;
    flex-flow: row nowrap;
    width: 100%;
  }
  .styleguide-page__main .inner-block__color.grayscale li {
    background-color: #f7f5f4;
    overflow: hidden;
    position: relative;
    width: 100%;
    background-color: gray;
    height: auto;
  }
  .styleguide-page__main .inner-block__color.grayscale li::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  .styleguide-page__main .inner-block__color.grayscale li .content,
  .styleguide-page__main .inner-block__color.grayscale li > a {
    bottom: 0;
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  }
  .styleguide-page__main .inner-block__color.grayscale li img {
    height: 100%;
    left: 100%;
    margin-left: -200%;
    max-width: none;
    position: relative;
    width: auto;
  }
  .styleguide-page__main .inner-block__color.grayscale li:first-of-type {
    font-weight: 700;
  }
  .styleguide-page__main .inner-block__color.grayscale li:not(:last-of-type) {
    margin-bottom: 0;
    margin-right: 0.0625rem;
  }
  .styleguide-page__main .inner-block__color.grayscale li:nth-child(1) {
    background-color: #000000;
  }
  .styleguide-page__main .inner-block__color.grayscale li:nth-child(2) {
    background-color: #263238;
  }
  .styleguide-page__main .inner-block__color.grayscale li:nth-child(3) {
    background-color: #565454;
  }
  .styleguide-page__main .inner-block__color.grayscale li:nth-child(4) {
    background-color: #6c6c6c;
  }
  .styleguide-page__main .inner-block__color.grayscale li:nth-child(5) {
    background-color: #7c7c7c;
  }
  .styleguide-page__main .inner-block__color.grayscale li:nth-child(6) {
    background-color: #9c9c9c;
  }
  .styleguide-page__main .inner-block__color.grayscale li:nth-child(7) {
    background-color: #d7d4d2;
  }
  .styleguide-page__main .inner-block__color.grayscale li:nth-child(8) {
    background-color: #e7e5e4;
  }
  .styleguide-page__main .inner-block__color.grayscale li:nth-child(9) {
    background-color: #f7f5f4;
  }
  .styleguide-page__main .inner-block__color.grayscale li:nth-child(10) {
    background-color: #ffffff;
  }
  .styleguide-page__main .inner-block__color.grayscale .content > * {
    align-items: flex-start;
    display: flex;
    padding: 1rem;
  }
  .styleguide-page__main .inner-block__breakpoints {
    border: 1px solid #d1232a;
    color: #ffffff;
    display: flex;
    flex-flow: row nowrap;
    font-size: 0.75rem;
    overflow-x: hidden;
    padding: 0 0.625rem;
    width: 100%;
  }
  .styleguide-page__main .inner-block__breakpoints li {
    background-color: #f7f5f4;
    overflow: hidden;
    position: relative;
    width: 100%;
    background-color: transparent;
    border-left: 1px solid #d1232a;
    border-right: 1px solid #d1232a;
    margin: 0 0.625rem;
  }
  .styleguide-page__main .inner-block__breakpoints li::before {
    content: '';
    display: block;
    padding-top: 100%;
  }
  .styleguide-page__main .inner-block__breakpoints li .content,
  .styleguide-page__main .inner-block__breakpoints li > a {
    bottom: 0;
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  }
  .styleguide-page__main .inner-block__breakpoints li img {
    height: 100%;
    left: 100%;
    margin-left: -200%;
    max-width: none;
    position: relative;
    width: auto;
  }
  .styleguide-page__main .inner-block__breakpoints span {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 100%;
    width: 100%;
  }
  .styleguide-page__main .inner-block__breakpoints.xs {
    max-width: 37.4375rem;
  }
  .styleguide-page__main .inner-block__breakpoints.s {
    max-width: 47.9375rem;
  }
  .styleguide-page__main .inner-block__breakpoints.m {
    max-width: 62.4375rem;
  }
  .styleguide-page__main .inner-block__breakpoints.m li {
    margin: 0 0.9375rem;
  }
  .styleguide-page__main .inner-block__breakpoints.l li {
    margin: 0 0.9375rem;
  }
  .styleguide-page__main .inner-block__breakpoints.l-feature li {
    margin: 0 0.9375rem;
    width: calc(100% / 16);
  }
  .styleguide-page__main .inner-block__typescale {
    width: 100%;
  }
  .styleguide-page__main .inner-block__typescale .col-3,
  .styleguide-page__main .inner-block__typescale li {
    border-top: 0.0625rem solid #e7e5e4;
    display: flex;
    flex-flow: column nowrap;
  }
  .styleguide-page__main .inner-block__typescale .col-3 label,
  .styleguide-page__main .inner-block__typescale label {
    color: #7c7c7c;
    font-size: 0.75rem;
    letter-spacing: 0.01em;
    margin-bottom: 1.25rem;
    padding-top: 0.5rem;
  }
  .styleguide-page__main .inner-block__typescale span {
    padding-bottom: 1.25rem;
  }
  .styleguide-page__main .inner-block__typescale .font-1-1 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1rem;
    font-weight: 700;
    letter-spacing: -0.005em;
    line-height: 1.38;
    text-transform: none;
  }
  .styleguide-page__main .inner-block__typescale .font-1-2 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.01em;
    line-height: 1.28;
    text-transform: none;
  }
  .styleguide-page__main .inner-block__typescale .font-1-3 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.3125rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.2;
    text-transform: none;
  }
  .styleguide-page__main .inner-block__typescale .font-1-4 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: -0.028em;
    line-height: 1.15;
    text-transform: none;
  }
  .styleguide-page__main .inner-block__typescale .font-1-5 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    text-transform: none;
  }
  .styleguide-page__main .inner-block__typescale .font-1-6 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 2rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }
  .styleguide-page__main .inner-block__typescale .font-1-7 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.14;
  }
  .styleguide-page__main .inner-block__typescale .font-1-8 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 2.875rem;
    font-weight: 700;
    letter-spacing: -0.035em;
  }
  .styleguide-page__main .inner-block__typescale .font-2-1 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 12px;
    font-weight: 500;
  }
  .styleguide-page__main .inner-block__typescale .font-2-2 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 15px;
    font-weight: 700;
    line-height: 1.35;
  }
  .styleguide-page__main .inner-block__typescale .font-2-3 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 18px;
    font-weight: 400;
    line-height: 1.35;
  }
  .styleguide-page__main .inner-block__typescale .font-2-4 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 21px;
    font-weight: 400;
    line-height: 1.3;
  }
  .styleguide-page__main .inner-block__typescale .font-2-5 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 24px;
    font-weight: 400;
    letter-spacing: -0.005em;
  }
  .styleguide-page__main .inner-block__typescale .font-2-6 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 27px;
    font-weight: 700;
    letter-spacing: -0.018em;
  }
  .styleguide-page__main .inner-block__typescale .font-2-7 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 32px;
    font-weight: 400;
  }
  .styleguide-page__main .inner-block__typescale .font-2-8 span {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
    font-size: 40px;
    font-weight: 400;
    line-height: 1.2;
  }
  .styleguide .edit {
    background-color: #fff100;
  }
  .styleguide .col-3 {
    margin-top: 1.875rem;
    width: 100%;
  }
  @media (min-width: 48rem) {
    .styleguide .col-3 {
      width: calc(100% / 3 - 18px);
    }
  }
  @media (min-width: 48rem) {
    .styleguide .col-3:not(:nth-child(3n + 1)) {
      margin-left: 1.6875rem;
    }
  }
  @media (min-width: 48rem) {
    .styleguide .col-3:nth-child(1),
    .styleguide .col-3:nth-child(2),
    .styleguide .col-3:nth-child(3) {
      margin-top: 0;
    }
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

  .glide {
    position: relative;
    width: 100%;
    box-sizing: border-box;
  }

  .glide * {
    box-sizing: inherit;
  }

  .glide__track {
    overflow: hidden;
  }

  .glide__slides {
    position: relative;
    width: 100%;
    list-style: none;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    touch-action: pan-Y;
    overflow: hidden;
    padding: 0;
    white-space: nowrap;
    display: flex;
    flex-wrap: nowrap;
    will-change: transform;
  }

  .glide__slides--dragging {
    user-select: none;
  }

  .glide__slide {
    width: 100%;
    height: 100%;
    flex-shrink: 0;
    white-space: normal;
    user-select: none;
    -webkit-touch-callout: none;
    -webkit-tap-highlight-color: transparent;
  }

  .glide__slide a {
    user-select: none;
    -webkit-user-drag: none;
    -moz-user-select: none;
    -ms-user-select: none;
  }

  .glide__arrows {
    -webkit-touch-callout: none;
    user-select: none;
  }

  .glide__bullets {
    -webkit-touch-callout: none;
    user-select: none;
  }

  .glide--rtl {
    direction: rtl;
  }

  .glide__arrow:focus {
    outline: none;
  }

  .glide__arrow:hover {
    border-color: white;
  }

  .glide__arrow--disabled {
    opacity: 0.33;
  }

  .glide__bullets {
    position: absolute;
    z-index: 2;
    bottom: 2em;
    left: 50%;
    display: inline-flex;
    list-style: none;
    transform: translateX(-50%);
  }

  .glide__bullet {
    background-color: rgba(255, 255, 255, 0.5);
    width: 9px;
    height: 9px;
    padding: 0;
    border-radius: 50%;
    border: 2px solid transparent;
    transition: all 300ms ease-in-out;
    cursor: pointer;
    line-height: 0;
    box-shadow: 0 0.25em 0.5em 0 rgba(0, 0, 0, 0.1);
    margin: 0 0.25em;
  }

  .glide__bullet:focus {
    outline: none;
  }

  .glide__bullet:hover,
  .glide__bullet:focus {
    border: 2px solid white;
    background-color: rgba(255, 255, 255, 0.5);
  }

  .glide__bullet--active {
    background-color: white;
  }

  .glide--swipeable {
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
  }

  .glide--dragging {
    cursor: grabbing;
    cursor: -moz-grabbing;
    cursor: -webkit-grabbing;
  }

  .glide {
    border-right: 0.0625rem solid #e7e5e4;
    border-left: 0.0625rem solid #e7e5e4;
    margin: 0 auto;
    width: calc(100% - 48px);
  }
  .glide__arrow {
    position: absolute;
    display: block;
    top: 50%;
    z-index: 2;
    color: #001d68;
    background-color: transparent;
    opacity: 1;
    cursor: pointer;
    transition: opacity 150ms ease, border 300ms ease-in-out;
    transform: translateY(-50%);
    line-height: 1;
  }
  .glide__arrow--left {
    left: -34px;
    transform: rotate(90deg);
  }
  .glide__arrow--right {
    right: -34px;
    transform: rotate(-90deg);
  }
  .glide__arrow svg {
    width: 1.75rem;
    fill: #001d68;
  }

  .styleswitcher {
    background: #e7e5e4;
    color: #000000;
    padding: 0.625rem 0.9375rem;
    position: relative;
    z-index: 3;
  }
  .styleswitcher button {
    color: black;
    font-size: 0.875rem;
    text-transform: uppercase;
    font-weight: 700;
    margin-right: 20px;
  }

  .block__cta {
    font-weight: 700;
  }

  .section-ad.top {
    border-top: none;
  }

  /* COLORS */
  .colorone .post__descriptor a,
  .colorone .section-layout__3 .block:nth-child(1) a,
  .colorone .section-layout__2 .block__cta {
    color: #3666d1;
  }

  .colorone .rich-text a,
  .colorone .rich-text p a {
    border-bottom-color: #3666d1;
  }

  .colorone .section-layout__2 .block:nth-child(2) .block__cta,
  .colorone .site__cta,
  .colorone .newsletter,
  .colorone .bar:before,
  .colorone .bar:after,
  .colorone .text-ad-container .button {
    background-color: #3666d1;
    color: #fff;
  }

  .colorone .text-ad-container .button {
    font-weight: 700;
  }

  .colorone .section-layout__2,
  .colorone .rich-text th {
    background-color: rgba(209, 131, 65, 0.12);
  }

  .colorone .rich-text th {
    border-bottom-color: rgba(209, 131, 65, 0.1);
  }

  @media only screen and (max-width: 959px) {
    .colorone .section-layout__3 .block:nth-child(1) {
      margin-bottom: 2rem;
    }
    .colorone .section-layout__3 .block:nth-child(1) .block__head {
      margin-bottom: 0;
    }
    .colorone .section-layout__3 .block:nth-child(1) ul {
      border-bottom: 0.0625rem solid #e7e5e4;
      border-top: 0.0625rem solid #e7e5e4;
      margin-top: 0.625rem;
    }
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

  .colortwo .post__descriptor a,
  .colortwo .site__logo,
  .colortwo .section-layout__3 .block:nth-child(1) a,
  .colortwo .section-layout__2 .block__cta {
    color: #193441;
  }

  .colortwo .section-layout__2 .block:nth-child(2) .block__cta,
  .colortwo .site__cta,
  .colortwo .bar:before,
  .colortwo .bar:after,
  .colortwo .text-ad-container .button {
    background-color: #193441;
    color: #fff;
  }

  .colortwo .text-ad-container .button {
    font-weight: 700;
  }

  @media only screen and (max-width: 959px) {
    .colortwo .section-layout__3 .block:nth-child(1) {
      margin-bottom: 2rem;
    }
    .colortwo .section-layout__3 .block:nth-child(1) .block__head {
      margin-bottom: 0;
    }
    .colortwo .section-layout__3 .block:nth-child(1) ul {
      border-bottom: 0.0625rem solid #e7e5e4;
      border-top: 0.0625rem solid #e7e5e4;
      margin-top: 0.625rem;
    }
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

  .colorthree .post__descriptor a,
  .colorthree .section-layout__2 .block__cta,
  .colorthree .text-ad-container .button {
    color: #bf0413;
  }

  .colorthree .text-ad-container .button {
    background-color: #ffffff;
    border: 0.0625rem solid #e7e5e4;
    font-weight: 700;
  }

  .colorthree .site__header {
    background-color: #000000;
    color: #ffffff;
  }
  .colorthree .site__header a {
    color: #ffffff;
  }

  .colorthree .section-layout__2 .block:nth-child(2) .block__cta,
  .colorthree .site__cta,
  .colorthree .bar:before,
  .colorthree .bar:after {
    background-color: #ffffff;
    color: #bf0413;
  }

  .colorthree .section-layout__2 {
    background-color: #ffffff;
    border-top: 0.0625rem solid #e7e5e4;
    border-bottom: 0.0625rem solid #e7e5e4;
    border-top-width: 0.25rem;
    border-bottom-width: 0.25rem;
  }
  @media only screen and (max-width: 959px) {
    .colorthree .section-layout__2 {
      margin-bottom: 0;
    }
  }

  .colorthree .section-layout__2 .block:nth-child(2) .block__cta {
    border: 0.0625rem solid #e7e5e4;
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

  .colorthree .section-layout__2 p,
  .colorthree .asset__excerpt {
    color: #565454;
  }

  @media only screen and (max-width: 959px) {
    .colorthree .site__header nav {
      border-top-color: rgba(255, 255, 255, 0.25);
    }
  }

  @media only screen and (max-width: 959px) {
    .colorthree .section-layout__3 .block:nth-child(1) {
      background-color: #000000;
      color: #ffffff;
      margin-bottom: 2rem;
      padding-top: 1.5rem;
    }
    .colorthree .section-layout__3 .block:nth-child(1) a {
      color: #ffffff;
    }
    .colorthree .section-layout__3 .block:nth-child(1) ul {
      border-top: 0.0625rem solid rgba(255, 255, 255, 0.25);
    }
  }

  /* FONT */
  .styleone {
    font-family: 'Libre Franklin', sans-serif;
  }
  .styleone .asset__title,
  .styleone .newsletter *,
  .styleone .post__meta--bottom .post__author-meta p,
  .styleone .text-ad-container .ad-brand p,
  .styleone .rich-text .text-ad-container .ad-brand p,
  .styleone .text-ad-container .media-content p,
  .styleone .rich-text .text-ad-container .media-content p,
  .styleone .site__logo,
  .styleone .rich-text h1,
  .styleone .rich-text h3,
  .styleone .rich-text h3,
  .styleone .post__tags .tags a {
    font-family: 'Libre Franklin', sans-serif !important;
  }
  .styleone .rich-text a:hover,
  .styleone .rich-text p a:hover {
    border-bottom: none;
    color: #000000;
  }
  .styleone .site__logo {
    font-weight: 900;
  }
  .styleone .post__descriptor {
    font-size: 0.9375rem;
    letter-spacing: 0.005em;
    margin-bottom: 0.5em;
  }
  .styleone .post__title {
    font-weight: 900;
  }
  @media (max-width: 47.9375rem) {
    .styleone .post__title {
      font-size: 2.125rem;
      line-height: 1.06;
      letter-spacing: 0;
      margin-bottom: 0.25em;
    }
  }
  @media (min-width: 48rem) {
    .styleone .post__title {
      font-size: 2.75rem;
      line-height: 1.1;
      letter-spacing: -0.015em;
      margin-bottom: 0.625rem;
    }
  }
  @media (max-width: 47.9375rem) {
    .styleone .post__dek {
      font-size: 1.25rem;
      line-height: 1.35;
      letter-spacing: -0.005em;
      margin-bottom: 0.85em;
    }
  }
  @media (min-width: 48rem) {
    .styleone .post__dek {
      font-size: 1.5rem;
      line-height: 1.3;
      letter-spacing: -0.01em;
      margin-bottom: 0.85em;
    }
  }
  .styleone time,
  .styleone .post__featured-media .media-credit,
  .styleone .post__featured-media .media-caption,
  .styleone .post__author-meta .contact,
  .styleone .post__tags .tags a,
  .styleone .text-ad-container .ad-brand p,
  .styleone .rich-text .text-ad-container .ad-brand p {
    font-size: 0.8125rem;
  }
  .styleone .post__author-meta,
  .styleone .post__meta--bottom .post__author-meta p {
    font-size: 0.9375rem;
  }
  @media only screen and (min-width: 900px) {
    .styleone .post__comment-counter .label {
      font-size: 0.8125rem;
    }
  }
  .styleone .rich-text p {
    font-family: 'Domine', serif;
    font-size: 1.125rem;
    line-height: 1.6;
  }
  .styleone .rich-text li {
    font-family: 'Domine', serif;
  }
  .styleone .asset__descriptor a,
  .styleone .post__descriptor a {
    font-weight: 700;
  }
  .styleone .asset__excerpt,
  .styleone .section-layout__2 p {
    font-family: 'Domine', serif;
    font-size: 0.875rem;
    line-height: 1.6;
  }
  @media (max-width: 47.9375rem) {
    .styleone .block__list .asset__title {
      font-size: 1.1875rem;
      line-height: 1.25;
      letter-spacing: -0.005em;
    }
  }
  @media (min-width: 48rem) {
    .styleone .block__list .asset__title {
      font-size: 1.375rem;
      line-height: 1.3;
      letter-spacing: -0.01em;
    }
  }
  .styleone .post__tags .tags a {
    color: #263238;
    text-transform: uppercase;
  }
  .styleone .section__title {
    font-weight: 900;
  }
  @media (max-width: 47.9375rem) {
    .styleone .section__title {
      font-size: 1.5rem;
      letter-spacing: 0;
    }
  }
  @media (min-width: 48rem) {
    .styleone .section__title {
      font-size: 1.75rem;
      letter-spacing: -0.005em;
      margin-bottom: 1.5rem;
    }
  }
  .styleone .newsletter h4 {
    font-size: 1.5rem;
  }

  .styletwo {
    font-family: 'Source Serif Pro', sans-serif;
  }
  .styletwo .asset__descriptor,
  .styletwo .asset__byline,
  .styletwo .newsletter *,
  .styletwo .post__descriptor,
  .styletwo time,
  .styletwo .post__dek,
  .styletwo .rich-text p,
  .styletwo .post__meta--bottom .post__author-meta p,
  .styletwo .text-ad-container .ad-brand p,
  .styletwo .rich-text .text-ad-container .ad-brand p,
  .styletwo .text-ad-container .media-content p,
  .styletwo .rich-text .text-ad-container .media-content p,
  .styletwo .block__cta,
  .styletwo .post__author-meta .contact,
  .styletwo .post__tags .tags a,
  .styletwo .post__tags .subtitle,
  .styletwo figcaption,
  .styletwo .media-caption,
  .styletwo .media-credit,
  .styletwo .post__comment-counter .label,
  .styletwo .text-ad-container .button,
  .styletwo .rich-text .text-ad-container .button,
  .styletwo .site__header nav a,
  .styletwo .rich-text li,
  .styletwo .post__tags .tags a {
    font-family: 'Source Sans Pro', sans-serif !important;
  }
  .styletwo .asset__title,
  .styletwo .site__logo,
  .styletwo .rich-text h1,
  .styletwo .rich-text h2,
  .styletwo .rich-text h3 {
    font-family: 'Source Serif Pro', sans-serif;
  }
  .styletwo .site__logo {
    font-weight: 700;
  }
  .styletwo time,
  .styletwo .post__featured-media .media-credit,
  .styletwo .post__featured-media .media-caption,
  .styletwo .post__author-meta .contact,
  .styletwo .post__tags .tags a,
  .styletwo .text-ad-container .ad-brand p,
  .styletwo .rich-text .text-ad-container .ad-brand p,
  .styletwo .block__list .asset__descriptor a {
    font-size: 0.875rem;
  }
  .styletwo .post__author-meta,
  .styletwo .post__meta--bottom .post__author-meta p,
  .styletwo .post__author-meta,
  .styletwo .text-ad-container .media-content p,
  .styletwo .text-ad-container .button,
  .styletwo .rich-text .text-ad-container .button {
    font-size: 1rem;
  }
  .styletwo .rich-text a:hover,
  .styletwo .rich-text p a:hover {
    border-bottom: none;
    color: #000000;
  }
  .styletwo .post__descriptor {
    font-size: 0.9375rem;
    letter-spacing: 0.005em;
    margin-bottom: 0.5em;
  }
  .styletwo .post__title {
    font-weight: 700;
  }
  @media (max-width: 47.9375rem) {
    .styletwo .post__title {
      font-size: 2.375rem;
      line-height: 1.04;
      letter-spacing: -0.005em;
      margin-bottom: 0.25em;
    }
  }
  @media (min-width: 48rem) {
    .styletwo .post__title {
      font-size: 2.9375rem;
      line-height: 1.05;
      letter-spacing: -0.02em;
      margin-bottom: 0.25rem;
    }
  }
  @media (max-width: 47.9375rem) {
    .styletwo .post__dek {
      font-size: 1.25rem;
      line-height: 1.35;
      letter-spacing: -0.005em;
      margin-bottom: 0.85em;
    }
  }
  @media (min-width: 48rem) {
    .styletwo .post__dek {
      font-size: 1.5rem;
      line-height: 1.3;
      letter-spacing: -0.01em;
      margin-bottom: 0.85em;
    }
  }
  @media only screen and (min-width: 900px) {
    .styletwo .post__comment-counter .label {
      font-size: 0.875rem;
    }
  }
  .styletwo .rich-text p {
    font-size: 1.125rem;
    line-height: 1.6;
  }
  @media (max-width: 47.9375rem) {
    .styletwo .block__list .asset__title {
      font-size: 1.1875rem;
      line-height: 1.25;
      letter-spacing: -0.005em;
    }
  }
  @media (min-width: 48rem) {
    .styletwo .block__list .asset__title {
      font-size: 1.4375rem;
      line-height: 1.3;
      letter-spacing: -0.01em;
    }
  }
  .styletwo .post__tags .tags a {
    color: #263238;
    text-transform: uppercase;
  }
  .styletwo .section__title {
    font-weight: 800;
  }
  @media (max-width: 47.9375rem) {
    .styletwo .section__title {
      font-size: 1.5625rem;
      letter-spacing: 0;
    }
  }
  @media (min-width: 48rem) {
    .styletwo .section__title {
      font-size: 1.875rem;
      letter-spacing: -0.005em;
      margin-bottom: 1.75rem;
    }
  }
  .styletwo .newsletter h4 {
    font-size: 1.5rem;
  }
  .styletwo .text-ad-container .button,
  .styletwo .rich-text .text-ad-container .button {
    font-weight: 600;
    letter-spacing: -0.005em;
  }

  .stylethree {
    font-family: 'Roboto';
  }
  .stylethree .asset__descriptor,
  .stylethree .asset__byline,
  .stylethree .newsletter *,
  .stylethree .post__descriptor,
  .stylethree time,
  .stylethree .post__dek,
  .stylethree .rich-text p,
  .stylethree .post__meta--bottom .post__author-meta p,
  .stylethree .text-ad-container .ad-brand p,
  .stylethree .rich-text .text-ad-container .ad-brand p,
  .stylethree .text-ad-container .media-content p,
  .stylethree .rich-text .text-ad-container .media-content p,
  .stylethree .block-list .block__cta,
  .stylethree .post__author-meta .contact,
  .stylethree .post__tags .tags a,
  .stylethree .post__tags .subtitle,
  .stylethree figcaption,
  .stylethree .media-caption,
  .stylethree .media-credit,
  .stylethree .post__comment-counter .label,
  .stylethree .text-ad-container .button,
  .stylethree .rich-text .text-ad-container .button,
  .stylethree .site__header nav a,
  .stylethree .rich-text > *,
  .stylethree .post__tags .tags a {
    font-family: 'Roboto', sans-serif;
  }
  .stylethree .asset__title,
  .stylethree .post__title,
  .stylethree .newsletter h4,
  .stylethree .site__logo {
    font-family: 'Roboto Condensed', sans-serif;
  }
  .stylethree .site__logo {
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .stylethree time,
  .stylethree .post__featured-media .media-credit,
  .stylethree .post__featured-media .media-caption,
  .stylethree .post__author-meta .contact,
  .stylethree .post__tags .tags a,
  .stylethree .text-ad-container .ad-brand p,
  .stylethree .rich-text .text-ad-container .ad-brand p,
  .stylethree .asset .asset__descriptor a {
    font-size: 0.875rem;
  }
  .stylethree .post__author-meta,
  .stylethree .post__meta--bottom .post__author-meta p,
  .stylethree .post__author-meta,
  .stylethree .text-ad-container .media-content p,
  .stylethree .text-ad-container .button,
  .stylethree .rich-text .text-ad-container .button {
    font-size: 1rem;
  }
  .stylethree .rich-text a:hover,
  .stylethree .rich-text p a:hover {
    border-bottom: none;
    color: #000000;
  }
  .stylethree .post__descriptor {
    font-size: 0.9375rem;
    letter-spacing: 0.005em;
    margin-bottom: 0.5em;
  }
  .stylethree .asset__descriptor a {
    font-weight: 700;
  }
  .stylethree .post__title {
    font-weight: 700;
  }
  @media (max-width: 47.9375rem) {
    .stylethree .post__title {
      font-size: 2.375rem;
      line-height: 1.04;
      letter-spacing: -0.005em;
      margin-bottom: 0.25em;
    }
  }
  @media (min-width: 48rem) {
    .stylethree .post__title {
      font-size: 2.9375rem;
      line-height: 1.05;
      letter-spacing: -0.02em;
      margin-bottom: 0.25rem;
    }
  }
  @media (max-width: 47.9375rem) {
    .stylethree .post__dek {
      font-size: 1.25rem;
      line-height: 1.35;
      letter-spacing: -0.005em;
      margin-bottom: 0.85em;
    }
  }
  @media (min-width: 48rem) {
    .stylethree .post__dek {
      font-size: 1.5rem;
      line-height: 1.3;
      letter-spacing: -0.02em;
      margin-bottom: 0.85em;
    }
  }
  @media only screen and (min-width: 900px) {
    .stylethree .post__comment-counter .label {
      font-size: 0.875rem;
    }
  }
  .stylethree .rich-text p {
    font-size: 1.125rem;
    line-height: 1.6;
  }
  @media (max-width: 47.9375rem) {
    .stylethree .block__list .asset__title {
      font-size: 1.1875rem;
      line-height: 1.25;
      letter-spacing: -0.005em;
    }
  }
  @media (min-width: 48rem) {
    .stylethree .block__list .asset__title {
      font-size: 1.4375rem;
      line-height: 1.3;
      letter-spacing: -0.01em;
    }
  }
  .stylethree .post__tags .tags a {
    color: #263238;
    text-transform: uppercase;
  }
  .stylethree .section__title {
    font-weight: 700;
  }
  @media (max-width: 47.9375rem) {
    .stylethree .section__title {
      font-size: 1.5625rem;
      letter-spacing: 0;
    }
  }
  @media (min-width: 48rem) {
    .stylethree .section__title {
      font-size: 1.875rem;
      letter-spacing: -0.005em;
      margin-bottom: 1.75rem;
    }
  }
  .stylethree .newsletter h4 {
    font-size: 1.6875rem;
  }

  .stylefour {
    font-family: 'Mulish';
  }
  .stylefour .asset__descriptor,
  .stylefour .asset__byline,
  .stylefour .newsletter *,
  .stylefour .post__descriptor,
  .stylefour time,
  .stylefour .rich-text p,
  .stylefour .post__meta--bottom .post__author-meta p,
  .stylefour .text-ad-container .ad-brand p,
  .stylefour .rich-text .text-ad-container .ad-brand p,
  .stylefour .text-ad-container .media-content p,
  .stylefour .rich-text .text-ad-container .media-content p,
  .stylefour .block__cta,
  .stylefour .post__author-meta .contact,
  .stylefour .post__tags .tags a,
  .stylefour .post__tags .subtitle,
  .stylefour figcaption,
  .stylefour .media-caption,
  .stylefour .media-credit,
  .stylefour .post__comment-counter .label,
  .stylefour .text-ad-container .button,
  .stylefour .rich-text .text-ad-container .button,
  .stylefour .post__dek,
  .stylefour .asset__title,
  .stylefour .site__header nav a,
  .stylefour .site__logo,
  .stylefour .post__tags .tags a {
    font-family: 'Mulish', sans-serif;
  }
  .stylefour .site__logo {
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .stylefour .rich-text p,
  .stylefour .post__meta--bottom .post__author-meta p,
  .stylefour .text-ad-container .media-content p,
  .stylefour .text-ad-container .button,
  .stylefour .rich-text .text-ad-container .button {
    font-family: 'San Francisco', -apple-system, BlinkMacSystemFont,
      '.SFNSText-Regular', 'Helvetica Neue', Helvetica, sans-serif;
  }
  .stylefour .post__title,
  .stylefour .newsletter h4,
  .stylefour .section__title {
    font-family: 'Arbutus Slab', serif;
  }
  .stylefour time,
  .stylefour .post__featured-media .media-credit,
  .stylefour .post__featured-media .media-caption,
  .stylefour .post__author-meta .contact,
  .stylefour .post__tags .tags a,
  .stylefour .text-ad-container .ad-brand p,
  .stylefour .rich-text .text-ad-container .ad-brand p,
  .stylefour .asset .asset__descriptor a {
    font-size: 0.8125rem;
  }
  .stylefour .post__author-meta,
  .stylefour .post__meta--bottom .post__author-meta p,
  .stylefour .post__author-meta,
  .stylefour .rich-text .newsletter p,
  .stylefour .text-ad-container .media-content p,
  .stylefour .text-ad-container .button,
  .stylefour .rich-text .text-ad-container .button {
    font-size: 1rem;
  }
  .stylefour .rich-text a:hover,
  .stylefour .rich-text p a:hover {
    border-bottom: none;
    color: #000000;
  }
  .stylefour .post__descriptor {
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.065em;
    margin-bottom: 0.625rem;
    text-transform: uppercase;
  }
  .stylefour .post__title {
    font-weight: 500;
  }
  @media (max-width: 47.9375rem) {
    .stylefour .post__title {
      font-size: 2.25rem;
      line-height: 1.08;
      letter-spacing: -0.015em;
      margin-bottom: 0.5rem;
    }
  }
  @media (min-width: 48rem) {
    .stylefour .post__title {
      font-size: 2.625rem;
      line-height: 1.15;
      letter-spacing: -0.02em;
      margin-bottom: 0.625rem;
    }
  }
  @media (max-width: 47.9375rem) {
    .stylefour .post__dek {
      font-size: 1.1875rem;
      line-height: 1.42;
      letter-spacing: -0.005em;
      margin-bottom: 0.85em;
    }
  }
  @media (min-width: 48rem) {
    .stylefour .post__dek {
      font-size: 1.375rem;
      line-height: 1.3;
      letter-spacing: -0.005em;
      margin-bottom: 1.5rem;
    }
  }
  @media only screen and (min-width: 900px) {
    .stylefour .post__comment-counter .label {
      font-size: 0.875rem;
    }
  }
  .stylefour .rich-text p {
    font-size: 1.1875rem;
    line-height: 1.6;
  }
  .stylefour .asset .asset__descriptor a {
    font-size: 0.6875rem;
    font-weight: 600;
    letter-spacing: 0.065em;
    text-transform: uppercase;
  }
  .stylefour .block__list .asset__title {
    font-weight: 700;
  }
  @media (max-width: 47.9375rem) {
    .stylefour .block__list .asset__title {
      font-size: 1.1875rem;
      line-height: 1.25;
      letter-spacing: 0;
    }
  }
  @media (min-width: 48rem) {
    .stylefour .block__list .asset__title {
      font-size: 1.3125rem;
      line-height: 1.3;
      letter-spacing: -0.005em;
    }
  }
  .stylefour .post__tags .tags a {
    color: #263238;
    font-weight: 700;
    text-transform: uppercase;
  }
  .stylefour .section__title {
    font-weight: 400;
  }
  @media (max-width: 47.9375rem) {
    .stylefour .section__title {
      font-size: 1.75rem;
      letter-spacing: 0;
      margin-bottom: 1.5rem;
    }
  }
  @media (min-width: 48rem) {
    .stylefour .section__title {
      font-size: 2rem;
      letter-spacing: -0.014em;
      margin-bottom: 2rem;
    }
  }
  .stylefour .newsletter h4 {
    font-size: 2rem;
    font-weight: 400;
    margin-bottom: 0.625rem;
  }
  .stylefour .newsletter label {
    font-size: 1rem;
  }
`;

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
  .asset__time {
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

  .asset time {
    color: #565454;
    display: block;
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }
  .asset time > *:not(:first-of-type)::before {
    content: '— ';
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
  .section-layout__3 .block .ad-wrapper {
    border-top: none;
    border-bottom: none;
    margin: 0;
  }

  .section-layout__3 .block .ad-wrapper .media-left {
    flex-direction: column;
    align-items: center;
  }

  .section-layout__3 .block .ad-wrapper .media-left .media.ad-img-container {
    margin-bottom: 1rem;
    width: 100%;
  }

  @media only screen and (min-width: 960px) {
    .section-layout__3 .block .ad-wrapper .media-left {
      flex-direction: row;
    }
    .section-layout__3 .block .ad-wrapper .media-left .media.ad-img-container {
      margin-bottom: 0;
      width: calc(100% / 3);
    }
  }
  .section-layout__3 .block .ad-wrapper .button {
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

  .post__body .post-text figure {
    margin: 1em 0;
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

  .ad-wrapper,
  .rich-text .ad-wrapper {
    border-bottom: 0.0625rem solid #e7e5e4;
    border-top: 0.0625rem solid #e7e5e4;
    display: block;
    margin: 2em 0;
    padding: 0.5rem 0 1.5rem;
  }
  @media (min-width: 48rem) {
    .ad-wrapper,
    .rich-text .ad-wrapper {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }
  .ad-wrapper .media,
  .rich-text .ad-wrapper .media {
    background-color: #f7f5f4;
    overflow: hidden;
    position: relative;
    width: 100%;
  }
  .ad-wrapper .media .content,
  .ad-wrapper .media > a,
  .rich-text .ad-wrapper .media .content,
  .rich-text .ad-wrapper .media > a {
    bottom: 0;
    display: block;
    left: 0;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
  }
  .ad-wrapper .media img,
  .rich-text .ad-wrapper .media img {
    height: 100%;
    left: 100%;
    margin-left: -200%;
    max-width: none;
    position: relative;
    width: auto;
  }
  .ad-wrapper .media-left,
  .rich-text .ad-wrapper .media-left {
    display: flex;
    flex-flow: row wrap;
  }
  @media (max-width: 47.9375rem) {
    .ad-wrapper .media-left,
    .rich-text .ad-wrapper .media-left {
      align-items: flex-start;
    }
  }
  @media (min-width: 48rem) {
    .ad-wrapper .media-left,
    .rich-text .ad-wrapper .media-left {
      align-items: center;
    }
  }
  .ad-wrapper .media.ad-img-container,
  .rich-text .ad-wrapper .media.ad-img-container {
    max-width: 18.75rem;
    width: calc(100% / 3);
  }
  .ad-wrapper .media-content,
  .rich-text .ad-wrapper .media-content {
    padding-left: 1.5rem;
    flex: 1;
  }
  .ad-wrapper .media-content > *:not(:last-of-type),
  .rich-text .ad-wrapper .media-content > *:not(:last-of-type) {
    margin-bottom: 0;
  }
  .ad-wrapper .media-content p,
  .rich-text .ad-wrapper .media-content p {
    font-size: 0.875rem;
  }
  .ad-wrapper h3,
  .rich-text .ad-wrapper h3 {
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
  .ad-wrapper .ad-brand p,
  .rich-text .ad-wrapper .ad-brand p {
    color: #263238;
    font-size: 0.8125rem;
    padding-top: 0.3125rem;
    margin-bottom: 1rem;
    text-align: center;
  }
  .ad-wrapper .button,
  .rich-text .ad-wrapper .button {
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
  .colorone .ad-wrapper .button {
    background-color: #3666d1;
    color: #fff;
  }

  .colorone .donation .button,
    background-color: #fff;
    color: #000;
  }

  .colorone .ad-wrapper .button {
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
  .colortwo .ad-wrapper .button {
    background-color: #193441;
    color: #fff;
  }

  .colortwo .ad-wrapper .button {
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
  .colorthree .ad-wrapper .button {
    color: #bf0413;
  }

  .colorthree .ad-wrapper .button {
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
  .styleone .ad-wrapper .ad-brand p,
  .styleone .rich-text .ad-wrapper .ad-brand p,
  .styleone .ad-wrapper .media-content p,
  .styleone .rich-text .ad-wrapper .media-content p,
  .styleone .site__logo,
  .styleone .rich-text h1,
  .styleone .rich-text h3,
  .styleone .rich-text h3,
  .styleone .post__tags .tags a {
    font-family: 'Libre Franklin', sans-serif;
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
  .styleone .ad-wrapper .ad-brand p,
  .styleone .rich-text .ad-wrapper .ad-brand p {
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
  .styletwo .ad-wrapper .ad-brand p,
  .styletwo .rich-text .ad-wrapper .ad-brand p,
  .styletwo .ad-wrapper .media-content p,
  .styletwo .rich-text .ad-wrapper .media-content p,
  .styletwo .block__cta,
  .styletwo .post__author-meta .contact,
  .styletwo .post__tags .tags a,
  .styletwo .post__tags .subtitle,
  .styletwo figcaption,
  .styletwo .media-caption,
  .styletwo .media-credit,
  .styletwo .post__comment-counter .label,
  .styletwo .ad-wrapper .button,
  .styletwo .rich-text .ad-wrapper .button,
  .styletwo .site__header nav a,
  .styletwo .rich-text li,
  .styletwo .post__tags .tags a {
    font-family: 'Source Sans Pro', sans-serif;
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
  .styletwo .ad-wrapper .ad-brand p,
  .styletwo .rich-text .ad-wrapper .ad-brand p,
  .styletwo .block__list .asset__descriptor a {
    font-size: 0.875rem;
  }
  .styletwo .post__author-meta,
  .styletwo .post__meta--bottom .post__author-meta p,
  .styletwo .post__author-meta,
  .styletwo .ad-wrapper .media-content p,
  .styletwo .ad-wrapper .button,
  .styletwo .rich-text .ad-wrapper .button {
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
  .styletwo .ad-wrapper .button,
  .styletwo .rich-text .ad-wrapper .button {
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
  .stylethree .ad-wrapper .ad-brand p,
  .stylethree .rich-text .ad-wrapper .ad-brand p,
  .stylethree .ad-wrapper .media-content p,
  .stylethree .rich-text .ad-wrapper .media-content p,
  .stylethree .block-list .block__cta,
  .stylethree .post__author-meta .contact,
  .stylethree .post__tags .tags a,
  .stylethree .post__tags .subtitle,
  .stylethree figcaption,
  .stylethree .media-caption,
  .stylethree .media-credit,
  .stylethree .post__comment-counter .label,
  .stylethree .ad-wrapper .button,
  .stylethree .rich-text .ad-wrapper .button,
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
  .stylethree .ad-wrapper .ad-brand p,
  .stylethree .rich-text .ad-wrapper .ad-brand p,
  .stylethree .asset .asset__descriptor a {
    font-size: 0.875rem;
  }
  .stylethree .post__author-meta,
  .stylethree .post__meta--bottom .post__author-meta p,
  .stylethree .post__author-meta,
  .stylethree .ad-wrapper .media-content p,
  .stylethree .ad-wrapper .button,
  .stylethree .rich-text .ad-wrapper .button {
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
  .stylefour .ad-wrapper .ad-brand p,
  .stylefour .rich-text .ad-wrapper .ad-brand p,
  .stylefour .ad-wrapper .media-content p,
  .stylefour .rich-text .ad-wrapper .media-content p,
  .stylefour .block__cta,
  .stylefour .post__author-meta .contact,
  .stylefour .post__tags .tags a,
  .stylefour .post__tags .subtitle,
  .stylefour figcaption,
  .stylefour .media-caption,
  .stylefour .media-credit,
  .stylefour .post__comment-counter .label,
  .stylefour .ad-wrapper .button,
  .stylefour .rich-text .ad-wrapper .button,
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
  .stylefour .ad-wrapper .media-content p,
  .stylefour .ad-wrapper .button,
  .stylefour .rich-text .ad-wrapper .button {
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
  .stylefour .ad-wrapper .ad-brand p,
  .stylefour .rich-text .ad-wrapper .ad-brand p,
  .stylefour .asset .asset__descriptor a {
    font-size: 0.8125rem;
  }
  .stylefour .post__author-meta,
  .stylefour .post__meta--bottom .post__author-meta p,
  .stylefour .post__author-meta,
  .stylefour .rich-text .newsletter p,
  .stylefour .ad-wrapper .media-content p,
  .stylefour .ad-wrapper .button,
  .stylefour .rich-text .ad-wrapper .button {
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

  .color-style-preview h2 {
    font-size: 18px;
    font-weight: bold;
  }
  .color-style-preview img {
    border: 1px solid black;
  }
`;

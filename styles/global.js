import css from 'styled-jsx/css';

export default css.global`
  /*! bulma.io v0.9.0 | MIT License | github.com/jgthms/bulma */
  @-webkit-keyframes spinAround {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
  @keyframes spinAround {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }

  .button {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .content:not(:last-child),
  .title:not(:last-child),
  .subtitle:not(:last-child),
  .level:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  .button,
  .input {
    -moz-appearance: none;
    -webkit-appearance: none;
    align-items: center;
    border: 1px solid transparent;
    border-radius: 4px;
    box-shadow: none;
    display: inline-flex;
    font-size: 1rem;
    height: 2.5em;
    justify-content: flex-start;
    line-height: 1.5;
    padding-bottom: calc(0.5em - 1px);
    padding-left: calc(0.75em - 1px);
    padding-right: calc(0.75em - 1px);
    padding-top: calc(0.5em - 1px);
    position: relative;
    vertical-align: top;
  }

  .button:focus,
  .input:focus,
  .button:active,
  .input:active,
  .is-active.button,
  .is-active.input {
    outline: none;
  }

  /*! minireset.css v0.0.6 | MIT License | github.com/jgthms/minireset.css */

  body,
  p,
  ol,
  ul,
  li,
  figure,
  h1,
  h2,
  h3 {
    margin: 0;
    padding: 0;
  }

  h1,
  h2,
  h3 {
    font-size: 100%;
    font-weight: normal;
  }

  ul {
    list-style: none;
  }

  button,
  input {
    margin: 0;
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }

  img {
    height: auto;
    max-width: 100%;
  }

  article,
  aside,
  figure,
  footer,
  header,
  section {
    display: block;
  }

  body,
  button,
  input {
    font-family: BlinkMacSystemFont, -apple-system, 'Segoe UI', 'Roboto',
      'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans',
      'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  }

  code {
    -moz-osx-font-smoothing: auto;
    -webkit-font-smoothing: auto;
    font-family: monospace;
  }

  body {
    color: #4a4a4a;
    font-size: 1em;
    font-weight: 400;
    line-height: 1.5;
  }

  a {
    color: #3273dc;
    cursor: pointer;
    text-decoration: none;
  }

  a strong {
    color: currentColor;
  }

  a:hover {
    color: #363636;
  }

  code {
    background-color: whitesmoke;
    color: #f14668;
    font-size: 0.875em;
    font-weight: normal;
    padding: 0.25em 0.5em 0.25em;
  }

  img {
    height: auto;
    max-width: 100%;
  }

  span {
    font-style: inherit;
    font-weight: inherit;
  }

  strong {
    color: #363636;
    font-weight: 700;
  }

  .button {
    background-color: white;
    border-color: #dbdbdb;
    border-width: 1px;
    color: #363636;
    cursor: pointer;
    justify-content: center;
    padding-bottom: calc(0.5em - 1px);
    padding-left: 1em;
    padding-right: 1em;
    padding-top: calc(0.5em - 1px);
    text-align: center;
    white-space: nowrap;
  }

  .button strong {
    color: inherit;
  }

  .button .icon,
  .button .icon.is-small {
    height: 1.5em;
    width: 1.5em;
  }

  .button .icon:first-child:not(:last-child) {
    margin-left: calc(-0.5em - 1px);
    margin-right: 0.25em;
  }

  .button .icon:last-child:not(:first-child) {
    margin-left: 0.25em;
    margin-right: calc(-0.5em - 1px);
  }

  .button .icon:first-child:last-child {
    margin-left: calc(-0.5em - 1px);
    margin-right: calc(-0.5em - 1px);
  }

  .button:hover {
    border-color: #b5b5b5;
    color: #363636;
  }

  .button:focus {
    border-color: #3273dc;
    color: #363636;
  }

  .button:focus:not(:active) {
    box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  }

  .button:active,
  .button.is-active {
    border-color: #4a4a4a;
    color: #363636;
  }

  .button.is-dark {
    background-color: #363636;
    border-color: transparent;
    color: #fff;
  }

  .button.is-dark:hover {
    background-color: #2f2f2f;
    border-color: transparent;
    color: #fff;
  }

  .button.is-dark:focus {
    border-color: transparent;
    color: #fff;
  }

  .button.is-dark:focus:not(:active) {
    box-shadow: 0 0 0 0.125em rgba(54, 54, 54, 0.25);
  }

  .button.is-dark:active,
  .button.is-dark.is-active {
    background-color: #292929;
    border-color: transparent;
    color: #fff;
  }

  .button.is-link {
    background-color: #3273dc;
    border-color: transparent;
    color: #fff;
  }

  .button.is-link:hover {
    background-color: #276cda;
    border-color: transparent;
    color: #fff;
  }

  .button.is-link:focus {
    border-color: transparent;
    color: #fff;
  }

  .button.is-link:focus:not(:active) {
    box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  }

  .button.is-link:active,
  .button.is-link.is-active {
    background-color: #2366d1;
    border-color: transparent;
    color: #fff;
  }

  .button.is-small {
    border-radius: 2px;
    font-size: 0.75rem;
  }

  .container {
    flex-grow: 1;
    margin: 0 auto;
    position: relative;
    width: auto;
  }

  @media screen and (min-width: 1024px) {
    .container {
      max-width: 960px;
    }
  }

  @media screen and (min-width: 1216px) {
    .container {
      max-width: 1152px;
    }
  }

  @media screen and (min-width: 1408px) {
    .container {
      max-width: 1344px;
    }
  }

  .content li + li {
    margin-top: 0.25em;
  }

  .content p:not(:last-child),
  .content ol:not(:last-child),
  .content ul:not(:last-child) {
    margin-bottom: 1em;
  }

  .content h1,
  .content h2,
  .content h3 {
    color: #363636;
    font-weight: 600;
    line-height: 1.125;
  }

  .content h1 {
    font-size: 2em;
    margin-bottom: 0.5em;
  }

  .content h1:not(:first-child) {
    margin-top: 1em;
  }

  .content h2 {
    font-size: 1.75em;
    margin-bottom: 0.5714em;
  }

  .content h2:not(:first-child) {
    margin-top: 1.1428em;
  }

  .content h3 {
    font-size: 1.5em;
    margin-bottom: 0.6666em;
  }

  .content h3:not(:first-child) {
    margin-top: 1.3333em;
  }

  .content ol {
    list-style-position: outside;
    margin-left: 2em;
    margin-top: 1em;
  }

  .content ol:not([type]) {
    list-style-type: decimal;
  }

  .content ul {
    list-style: disc outside;
    margin-left: 2em;
    margin-top: 1em;
  }

  .content ul ul {
    list-style-type: circle;
    margin-top: 0.5em;
  }

  .content ul ul ul {
    list-style-type: square;
  }

  .content figure {
    margin-left: 2em;
    margin-right: 2em;
    text-align: center;
  }

  .content figure:not(:first-child) {
    margin-top: 2em;
  }

  .content figure:not(:last-child) {
    margin-bottom: 2em;
  }

  .content figure img {
    display: inline-block;
  }

  .content figure figcaption {
    font-style: italic;
  }

  .content.is-small {
    font-size: 0.75rem;
  }

  .icon {
    align-items: center;
    display: inline-flex;
    justify-content: center;
    height: 1.5rem;
    width: 1.5rem;
  }

  .icon.is-small {
    height: 1rem;
    width: 1rem;
  }

  .image {
    display: block;
    position: relative;
  }

  .image img {
    display: block;
    height: auto;
    width: 100%;
  }

  @-webkit-keyframes moveIndeterminate {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }

  @keyframes moveIndeterminate {
    from {
      background-position: 200% 0;
    }
    to {
      background-position: -200% 0;
    }
  }

  .tags {
    align-items: center;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
  }

  .tags .tag {
    margin-bottom: 0.5rem;
  }

  .tags .tag:not(:last-child) {
    margin-right: 0.5rem;
  }

  .tags:last-child {
    margin-bottom: -0.5rem;
  }

  .tags:not(:last-child) {
    margin-bottom: 1rem;
  }

  .tag:not(body) {
    align-items: center;
    background-color: whitesmoke;
    border-radius: 4px;
    color: #4a4a4a;
    display: inline-flex;
    font-size: 0.75rem;
    height: 2em;
    justify-content: center;
    line-height: 1.5;
    padding-left: 0.75em;
    padding-right: 0.75em;
    white-space: nowrap;
  }

  .tag:not(body).is-dark {
    background-color: #363636;
    color: #fff;
  }

  .tag:not(body).is-link {
    background-color: #3273dc;
    color: #fff;
  }

  .tag:not(body) .icon:first-child:not(:last-child) {
    margin-left: -0.375em;
    margin-right: 0.1875em;
  }

  .tag:not(body) .icon:last-child:not(:first-child) {
    margin-left: 0.1875em;
    margin-right: -0.375em;
  }

  .tag:not(body) .icon:first-child:last-child {
    margin-left: -0.375em;
    margin-right: -0.375em;
  }

  a.tag:hover {
    text-decoration: underline;
  }

  .title,
  .subtitle {
    word-break: break-word;
  }

  .title em,
  .title span,
  .subtitle em,
  .subtitle span {
    font-weight: inherit;
  }

  .title .tag,
  .subtitle .tag {
    vertical-align: middle;
  }

  .title {
    color: #363636;
    font-size: 2rem;
    font-weight: 600;
    line-height: 1.125;
  }

  .title strong {
    color: inherit;
    font-weight: inherit;
  }

  .title:not(.is-spaced) + .subtitle {
    margin-top: -1.25rem;
  }

  .subtitle {
    color: #4a4a4a;
    font-size: 1.25rem;
    font-weight: 400;
    line-height: 1.25;
  }

  .subtitle strong {
    color: #363636;
    font-weight: 600;
  }

  .subtitle:not(.is-spaced) + .title {
    margin-top: -1.25rem;
  }

  .input {
    background-color: white;
    border-color: #dbdbdb;
    border-radius: 4px;
    color: #363636;
  }

  .input::-moz-placeholder {
    color: rgba(54, 54, 54, 0.3);
  }

  .input::-webkit-input-placeholder {
    color: rgba(54, 54, 54, 0.3);
  }

  .input:-moz-placeholder {
    color: rgba(54, 54, 54, 0.3);
  }

  .input:-ms-input-placeholder {
    color: rgba(54, 54, 54, 0.3);
  }

  .input:hover {
    border-color: #b5b5b5;
  }

  .input:focus,
  .input:active,
  .is-active.input {
    border-color: #3273dc;
    box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  }

  .input {
    box-shadow: inset 0 0.0625em 0.125em rgba(10, 10, 10, 0.05);
    max-width: 100%;
    width: 100%;
  }

  .is-dark.input {
    border-color: #363636;
  }

  .is-dark.input:focus,
  .is-dark.input:active,
  .is-dark.is-active.input {
    box-shadow: 0 0 0 0.125em rgba(54, 54, 54, 0.25);
  }

  .is-link.input {
    border-color: #3273dc;
  }

  .is-link.input:focus,
  .is-link.input:active,
  .is-link.is-active.input {
    box-shadow: 0 0 0 0.125em rgba(50, 115, 220, 0.25);
  }

  .is-small.input {
    border-radius: 2px;
    font-size: 0.75rem;
  }

  .label {
    color: #363636;
    display: block;
    font-size: 1rem;
    font-weight: 700;
  }

  .label:not(:last-child) {
    margin-bottom: 0.5em;
  }

  .label.is-small {
    font-size: 0.75rem;
  }

  .control {
    box-sizing: border-box;
    clear: both;
    font-size: 1rem;
    position: relative;
    text-align: inherit;
  }

  .card {
    background-color: white;
    box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
      0 0px 0 1px rgba(10, 10, 10, 0.02);
    color: #4a4a4a;
    max-width: 100%;
    position: relative;
  }

  .card .media:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  .level {
    align-items: center;
    justify-content: space-between;
  }

  .level code {
    border-radius: 4px;
  }

  .level img {
    display: inline-block;
    vertical-align: top;
  }

  .level.is-mobile {
    display: flex;
  }

  .level.is-mobile .level-left {
    display: flex;
  }

  .level.is-mobile .level-item:not(:last-child) {
    margin-bottom: 0;
    margin-right: 0.75rem;
  }

  .level.is-mobile .level-item:not(.is-narrow) {
    flex-grow: 1;
  }

  @media screen and (min-width: 769px), print {
    .level {
      display: flex;
    }
    .level > .level-item:not(.is-narrow) {
      flex-grow: 1;
    }
  }

  .level-item {
    align-items: center;
    display: flex;
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
    justify-content: center;
  }

  .level-item .title,
  .level-item .subtitle {
    margin-bottom: 0;
  }

  @media screen and (max-width: 768px) {
    .level-item:not(:last-child) {
      margin-bottom: 0.75rem;
    }
  }

  .level-left {
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
  }

  @media screen and (min-width: 769px), print {
    .level-left .level-item:not(:last-child) {
      margin-right: 0.75rem;
    }
  }

  .level-left {
    align-items: center;
    justify-content: flex-start;
  }

  @media screen and (min-width: 769px), print {
    .level-left {
      display: flex;
    }
  }

  .media {
    align-items: flex-start;
    display: flex;
    text-align: inherit;
  }

  .media .content:not(:last-child) {
    margin-bottom: 0.75rem;
  }

  .media .media {
    border-top: 1px solid rgba(219, 219, 219, 0.5);
    display: flex;
    padding-top: 0.75rem;
  }

  .media .media .content:not(:last-child),
  .media .media .control:not(:last-child) {
    margin-bottom: 0.5rem;
  }

  .media .media .media {
    padding-top: 0.5rem;
  }

  .media .media .media + .media {
    margin-top: 0.5rem;
  }

  .media + .media {
    border-top: 1px solid rgba(219, 219, 219, 0.5);
    margin-top: 1rem;
    padding-top: 1rem;
  }

  .media-left {
    flex-basis: auto;
    flex-grow: 0;
    flex-shrink: 0;
  }

  .media-left {
    margin-right: 1rem;
  }

  .media-content {
    flex-basis: auto;
    flex-grow: 1;
    flex-shrink: 1;
    text-align: inherit;
  }

  @media screen and (max-width: 768px) {
    .media-content {
      overflow-x: auto;
    }
  }

  .menu {
    font-size: 1rem;
  }

  .menu.is-small {
    font-size: 0.75rem;
  }

  .navbar {
    background-color: white;
    min-height: 3.25rem;
    position: relative;
    z-index: 30;
  }

  .navbar.is-dark {
    background-color: #363636;
    color: #fff;
  }

  .navbar.is-dark .navbar-brand > .navbar-item {
    color: #fff;
  }

  .navbar.is-dark .navbar-brand > a.navbar-item:focus,
  .navbar.is-dark .navbar-brand > a.navbar-item:hover,
  .navbar.is-dark .navbar-brand > a.navbar-item.is-active {
    background-color: #292929;
    color: #fff;
  }

  .navbar.is-dark .navbar-burger {
    color: #fff;
  }

  @media screen and (min-width: 1024px) {
    .navbar.is-dark .navbar-start > .navbar-item {
      color: #fff;
    }
    .navbar.is-dark .navbar-start > a.navbar-item:focus,
    .navbar.is-dark .navbar-start > a.navbar-item:hover,
    .navbar.is-dark .navbar-start > a.navbar-item.is-active {
      background-color: #292929;
      color: #fff;
    }
  }

  .navbar.is-link {
    background-color: #3273dc;
    color: #fff;
  }

  .navbar.is-link .navbar-brand > .navbar-item {
    color: #fff;
  }

  .navbar.is-link .navbar-brand > a.navbar-item:focus,
  .navbar.is-link .navbar-brand > a.navbar-item:hover,
  .navbar.is-link .navbar-brand > a.navbar-item.is-active {
    background-color: #2366d1;
    color: #fff;
  }

  .navbar.is-link .navbar-burger {
    color: #fff;
  }

  @media screen and (min-width: 1024px) {
    .navbar.is-link .navbar-start > .navbar-item {
      color: #fff;
    }
    .navbar.is-link .navbar-start > a.navbar-item:focus,
    .navbar.is-link .navbar-start > a.navbar-item:hover,
    .navbar.is-link .navbar-start > a.navbar-item.is-active {
      background-color: #2366d1;
      color: #fff;
    }
  }

  .navbar > .container {
    align-items: stretch;
    display: flex;
    min-height: 3.25rem;
    width: 100%;
  }

  .navbar-brand {
    align-items: stretch;
    display: flex;
    flex-shrink: 0;
    min-height: 3.25rem;
  }

  .navbar-brand a.navbar-item:focus,
  .navbar-brand a.navbar-item:hover {
    background-color: transparent;
  }

  .navbar-burger {
    color: #4a4a4a;
    cursor: pointer;
    display: block;
    height: 3.25rem;
    position: relative;
    width: 3.25rem;
    margin-left: auto;
  }

  .navbar-burger span {
    background-color: currentColor;
    display: block;
    height: 1px;
    left: calc(50% - 8px);
    position: absolute;
    transform-origin: center;
    transition-duration: 86ms;
    transition-property: background-color, opacity, transform;
    transition-timing-function: ease-out;
    width: 16px;
  }

  .navbar-burger span:nth-child(1) {
    top: calc(50% - 6px);
  }

  .navbar-burger span:nth-child(2) {
    top: calc(50% - 1px);
  }

  .navbar-burger span:nth-child(3) {
    top: calc(50% + 4px);
  }

  .navbar-burger:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .navbar-burger.is-active span:nth-child(1) {
    transform: translateY(5px) rotate(45deg);
  }

  .navbar-burger.is-active span:nth-child(2) {
    opacity: 0;
  }

  .navbar-burger.is-active span:nth-child(3) {
    transform: translateY(-5px) rotate(-45deg);
  }

  .navbar-menu {
    display: none;
  }

  .navbar-item {
    color: #4a4a4a;
    display: block;
    line-height: 1.5;
    padding: 0.5rem 0.75rem;
    position: relative;
  }

  .navbar-item .icon:only-child {
    margin-left: -0.25rem;
    margin-right: -0.25rem;
  }

  a.navbar-item {
    cursor: pointer;
  }

  a.navbar-item:focus,
  a.navbar-item:focus-within,
  a.navbar-item:hover,
  a.navbar-item.is-active {
    background-color: #fafafa;
    color: #3273dc;
  }

  .navbar-item {
    flex-grow: 0;
    flex-shrink: 0;
  }

  .navbar-item img {
    max-height: 1.75rem;
  }

  @media screen and (max-width: 1023px) {
    .navbar > .container {
      display: block;
    }
    .navbar-brand .navbar-item {
      align-items: center;
      display: flex;
    }
    .navbar-menu {
      background-color: white;
      box-shadow: 0 8px 16px rgba(10, 10, 10, 0.1);
      padding: 0.5rem 0;
    }
    .navbar-menu.is-active {
      display: block;
    }
  }

  @media screen and (min-width: 1024px) {
    .navbar,
    .navbar-menu,
    .navbar-start {
      align-items: stretch;
      display: flex;
    }
    .navbar {
      min-height: 3.25rem;
    }
    .navbar.is-spaced {
      padding: 1rem 2rem;
    }
    .navbar.is-spaced .navbar-start {
      align-items: center;
    }
    .navbar.is-spaced a.navbar-item {
      border-radius: 4px;
    }
    .navbar-burger {
      display: none;
    }
    .navbar-item {
      align-items: center;
      display: flex;
    }
    .navbar-menu {
      flex-grow: 1;
      flex-shrink: 0;
    }
    .navbar-start {
      justify-content: flex-start;
      margin-right: auto;
    }
    .navbar > .container .navbar-brand,
    .container > .navbar .navbar-brand {
      margin-left: -0.75rem;
    }
    .navbar > .container .navbar-menu,
    .container > .navbar .navbar-menu {
      margin-right: -0.75rem;
    }
    a.navbar-item.is-active {
      color: #0a0a0a;
    }
    a.navbar-item.is-active:not(:focus):not(:hover) {
      background-color: transparent;
    }
  }

  .panel {
    border-radius: 6px;
    box-shadow: 0 0.5em 1em -0.125em rgba(10, 10, 10, 0.1),
      0 0px 0 1px rgba(10, 10, 10, 0.02);
    font-size: 1rem;
  }

  .panel:not(:last-child) {
    margin-bottom: 1.5rem;
  }

  .panel.is-dark .panel-heading {
    background-color: #363636;
    color: #fff;
  }

  .panel.is-link .panel-heading {
    background-color: #3273dc;
    color: #fff;
  }

  .panel-block:not(:last-child) {
    border-bottom: 1px solid #ededed;
  }

  .panel-heading {
    background-color: #ededed;
    border-radius: 6px 6px 0 0;
    color: #363636;
    font-size: 1.25em;
    font-weight: 700;
    line-height: 1.25;
    padding: 0.75em 1em;
  }

  .panel-block {
    align-items: center;
    color: #363636;
    display: flex;
    justify-content: flex-start;
    padding: 0.5em 0.75em;
  }

  .panel-block > .control {
    flex-grow: 1;
    flex-shrink: 1;
    width: 100%;
  }

  .panel-block.is-active {
    border-left-color: #3273dc;
    color: #363636;
  }

  .panel-block:last-child {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }

  a.panel-block,
  label.panel-block {
    cursor: pointer;
  }

  a.panel-block:hover,
  label.panel-block:hover {
    background-color: whitesmoke;
  }

  .column {
    display: block;
    flex-basis: 0;
    flex-grow: 1;
    flex-shrink: 1;
    padding: 0.75rem;
  }

  .columns.is-mobile > .column.is-four-fifths {
    flex: none;
    width: 80%;
  }

  @media screen and (min-width: 769px), print {
    .column.is-four-fifths {
      flex: none;
      width: 80%;
    }
  }

  .columns {
    margin-left: -0.75rem;
    margin-right: -0.75rem;
    margin-top: -0.75rem;
  }

  .columns:last-child {
    margin-bottom: -0.75rem;
  }

  .columns:not(:last-child) {
    margin-bottom: calc(1.5rem - 0.75rem);
  }

  .columns.is-mobile {
    display: flex;
  }

  @media screen and (min-width: 769px), print {
    .columns:not(.is-desktop) {
      display: flex;
    }
  }

  .is-size-1 {
    font-size: 3rem;
  }

  .has-text-centered {
    text-align: center;
  }

  .hero {
    align-items: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .hero .navbar {
    background: none;
  }

  .hero.is-dark {
    background-color: #363636;
    color: #fff;
  }

  .hero.is-dark
    a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current),
  .hero.is-dark strong {
    color: inherit;
  }

  .hero.is-dark .title {
    color: #fff;
  }

  .hero.is-dark .subtitle {
    color: rgba(255, 255, 255, 0.9);
  }

  .hero.is-dark .subtitle a:not(.button),
  .hero.is-dark .subtitle strong {
    color: #fff;
  }

  @media screen and (max-width: 1023px) {
    .hero.is-dark .navbar-menu {
      background-color: #363636;
    }
  }

  .hero.is-dark .navbar-item {
    color: rgba(255, 255, 255, 0.7);
  }

  .hero.is-dark a.navbar-item:hover,
  .hero.is-dark a.navbar-item.is-active {
    background-color: #292929;
    color: #fff;
  }

  .hero.is-dark.is-bold {
    background-image: linear-gradient(
      141deg,
      #1f191a 0%,
      #363636 71%,
      #46403f 100%
    );
  }

  @media screen and (max-width: 768px) {
    .hero.is-dark.is-bold .navbar-menu {
      background-image: linear-gradient(
        141deg,
        #1f191a 0%,
        #363636 71%,
        #46403f 100%
      );
    }
  }

  .hero.is-link {
    background-color: #3273dc;
    color: #fff;
  }

  .hero.is-link
    a:not(.button):not(.dropdown-item):not(.tag):not(.pagination-link.is-current),
  .hero.is-link strong {
    color: inherit;
  }

  .hero.is-link .title {
    color: #fff;
  }

  .hero.is-link .subtitle {
    color: rgba(255, 255, 255, 0.9);
  }

  .hero.is-link .subtitle a:not(.button),
  .hero.is-link .subtitle strong {
    color: #fff;
  }

  @media screen and (max-width: 1023px) {
    .hero.is-link .navbar-menu {
      background-color: #3273dc;
    }
  }

  .hero.is-link .navbar-item {
    color: rgba(255, 255, 255, 0.7);
  }

  .hero.is-link a.navbar-item:hover,
  .hero.is-link a.navbar-item.is-active {
    background-color: #2366d1;
    color: #fff;
  }

  .hero.is-link.is-bold {
    background-image: linear-gradient(
      141deg,
      #1577c6 0%,
      #3273dc 71%,
      #4366e5 100%
    );
  }

  @media screen and (max-width: 768px) {
    .hero.is-link.is-bold .navbar-menu {
      background-image: linear-gradient(
        141deg,
        #1577c6 0%,
        #3273dc 71%,
        #4366e5 100%
      );
    }
  }

  .hero.is-small .hero-body {
    padding: 1.5rem;
  }

  .hero-body {
    flex-grow: 1;
    flex-shrink: 0;
    padding: 3rem 1.5rem;
  }

  .section {
    padding: 3rem 1.5rem;
  }

  .footer {
    background-color: #fafafa;
    padding: 3rem 1.5rem 6rem;
  }
  /*# sourceMappingURL=bulma.css.map */
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

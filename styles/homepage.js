import css from 'styled-jsx/css';

export default css.global`
  .section-layout__4 {
    display: flex;
    margin: 0 0 1.875rem 0;
  }

  .section-layout__4 .section__container .block {
    display: flex;
  }
  .section-layout__4 .section__container .block .asset {
    flex-flow: column nowrap;
    flex-direction: column-reverse;
  }

  @media only screen and (min-width: 768px) {
    .section-layout__4 .section__container .block .asset {
      flex-flow: row;
    }
    .section-layout__4
      .section__container
      .block
      .asset
      .asset__meta-container {
      flex: 1 1 0;
    }
    .section-layout__4 .section__container .block .asset .asset__thumbnail {
      flex: 2 1 0;
      margin-left: 2rem;
    }
    .section-layout__4
      .section__container
      .block
      .asset
      .asset__meta-container
      .asset__descriptor
      a {
      font-size: 1rem;
    }
    .section-layout__4
      .section__container
      .block
      .asset
      .asset__meta-container
      .asset__title {
      font-size: 2rem;
    }
    .section-layout__4
      .section__container
      .block
      .asset
      .asset__meta-container
      .asset__excerpt {
      font-size: 18px;
    }
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
`;

import React from 'react';
import { useRouter } from 'next/router';

export default function LocaleSwitcher({ currentLocale, locales }) {
  const router = useRouter();

  console.log('currentLocale:', currentLocale, 'locales:', locales);

  function localisePath(event) {
    router.push(router.pathname, router.pathname, {
      locale: event.target.value,
    });
  }

  let localeOptions;

  if (locales) {
    localeOptions = locales.map((locale, index) => (
      <option
        key={`locale-${index}`}
        value={locale.code}
        selected={currentLocale.code === locale.code ? 'true' : ''}
      >
        {locale.code}
      </option>
    ));
  }

  return (
    <div>
      <select onChange={localisePath} id="localeSwitcher">
        {localeOptions}
      </select>
    </div>
  );
}

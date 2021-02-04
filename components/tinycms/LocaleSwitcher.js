import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function LocaleSwitcher({ currentLocale, locales, id }) {
  const [selectedLocale, setSelectedLocale] = useState(currentLocale.code);
  const router = useRouter();

  // console.log('currentLocale:', currentLocale, 'locales:', locales);

  function localisePath(event) {
    setSelectedLocale(event.target.value);

    if (id) {
      router.push(
        {
          pathname: router.pathname,
          query: { id: id },
        },
        {
          pathname: router.pathname,
          query: { id: id },
        },
        {
          locale: event.target.value,
        }
      );
    } else {
      router.push(router.pathname, router.pathname, {
        locale: event.target.value,
      });
    }
  }

  let localeOptions;

  if (locales) {
    localeOptions = locales.map((locale, index) => (
      <option key={`locale-${index}`} value={locale.code}>
        {locale.code}
      </option>
    ));
  }

  return (
    <div>
      <select
        value={selectedLocale}
        onChange={localisePath}
        id="localeSwitcher"
      >
        {localeOptions}
      </select>
    </div>
  );
}

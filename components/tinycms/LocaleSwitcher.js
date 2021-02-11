import React, { useState } from 'react';
import { useRouter } from 'next/router';

export default function LocaleSwitcher({ currentLocale, locales, id }) {
  const [selectedLocale, setSelectedLocale] = useState(currentLocale);
  const router = useRouter();

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
    localeOptions = locales.map((localeData, index) => (
      <option key={`locale-${index}`} value={localeData.locale.code}>
        {localeData.locale.code}
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

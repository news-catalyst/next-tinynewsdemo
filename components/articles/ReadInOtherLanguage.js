import { useRouter } from 'next/router';
import Link from 'next/link';

export default function ReadInOtherLanguage({ locales, currentLocale }) {
  const router = useRouter();

  let otherLocales = locales.filter(
    (locale) => locale.locale.code !== currentLocale
  );
  let otherLanguageLinks = otherLocales.map((otherLocale) => {
    return (
      <Link
        key={otherLocale.locale.code}
        href={router.asPath}
        locale={otherLocale.locale.code}
      >
        <a>Read in {otherLocale.locale.name}</a>
      </Link>
    );
  });

  return <>{otherLanguageLinks}</>;
}

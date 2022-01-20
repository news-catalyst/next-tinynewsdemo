import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import tw, { styled } from 'twin.macro';
import Typography from '../../../components/common/Typography';
import { hasuraGetMetadataByLocale } from '../../../lib/articles.js';
import { generateNavLinkFor } from '../../../lib/utils.js';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import { hasuraUpsertMetadata } from '../../../lib/site_metadata';
import Notification from '../../../components/tinycms/Notification';
import {
  AddButton,
  DeleteButton,
} from '../../../components/common/CommonStyles.js';
const Container = tw.div`flex flex-wrap -mx-2`;
const MainContent = tw.div`w-full lg:w-3/4 px-4 py-4`;

const SectionLink = styled.a(({ meta }) => ({
  ...tw`lg:items-center lg:mr-8 lg:py-0 inline-flex items-center lg:h-full py-2 px-5 lg:pb-0 lg:px-0 hover:underline`,
  fontFamily: Typography[meta.theme].SectionLink,
}));

export default function NavBuilder({
  apiUrl,
  apiToken,
  currentLocale,
  siteMetadata,
  linkOptions,
  locales,
  vercelHook,
}) {
  const [message, setMessage] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationType, setNotificationType] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [jsonData, setJsonData] = useState('');
  const [parsedData, setParsedData] = useState({});
  const [currentNavOptions, setCurrentNavOptions] = useState([]);

  const [currentNavRandom, setCurrentNavRandom] = useState(Math.random());
  // const [links, setLinks] = useState(linkOptions);

  const router = useRouter();
  const { action } = router.query;

  const linkOptionItems = linkOptions.map((linkOption, i) => {
    return (
      <option
        key={`${linkOption.slug}-${linkOption.type}`}
        data-type={linkOption.type}
        data-slug={linkOption.slug}
        data-label={linkOption.name}
      >
        ({linkOption.type}) {linkOption.name}
      </option>
    );
  });

  const removeLink = (ev) => {
    ev.preventDefault();
    let link = ev.target;
    let removeSlug = link.getAttribute('data-slug');
    let removeType = link.getAttribute('data-type');
    let updatedNavOptions = currentNavOptions.filter((option) => {
      if (option.slug === removeSlug && option.type === removeType) {
        return false;
      } else {
        return true;
      }
    });

    setCurrentNavOptions(updatedNavOptions);
  };

  const selectNavLinkItem = (ev) => {
    let selectedItem = ev.target[ev.target.selectedIndex];
    let selectedSlug = selectedItem.getAttribute('data-slug');
    let selectedLabel = selectedItem.getAttribute('data-label');
    let selectedType = selectedItem.getAttribute('data-type');

    let updatedNavOptions = currentNavOptions;
    updatedNavOptions.push({
      type: selectedType,
      slug: selectedSlug,
      label: selectedLabel,
    });

    setCurrentNavOptions(updatedNavOptions);
    setCurrentNavRandom(Math.random());
  };

  useEffect(() => {
    if (siteMetadata) {
      let md = siteMetadata.site_metadata_translations[0].data;
      setMetadata(md);
      let parsed = md;
      setParsedData(parsed);
      let formattedJSON;
      try {
        formattedJSON = JSON.stringify(parsed, null, 2);
        setJsonData(formattedJSON);
      } catch (error) {
        console.error(error);
      }
      if (parsed && parsed['nav']) {
        setCurrentNavOptions(parsed['nav']);
      }
    }
    if (action && action === 'edit') {
      setMessage('Successfully updated metadata.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created metadata.');
    }
  }, [action, siteMetadata]);

  async function handleClear(ev) {
    ev.preventDefault();
    setCurrentNavOptions([]);
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    let parsed = parsedData;

    if (jsonData && Object.keys(parsedData).length === 0) {
      parsed = JSON.parse(jsonData);
      setParsedData(parsed);
    }

    if (currentNavOptions && currentNavOptions.length > 0) {
      parsed['nav'] = currentNavOptions;
    } else {
      setNotificationType('error');
      setNotificationMessage(
        "You haven't selected any items for the nav. Add some links then try saving again."
      );
      setShowNotification(true);
      return;
    }

    const { errors, data } = await hasuraUpsertMetadata({
      url: apiUrl,
      orgSlug: apiToken,
      data: parsed,
      published: true,
      localeCode: currentLocale,
    });
    if (errors) {
      setNotificationMessage(errors);
      setNotificationType('error');
      setShowNotification(true);
    } else {
      // rebuild the site
      if (!vercelHook) {
        setNotificationMessage(
          'Successfully saved, but no deploy hook defined so unable to republish the site.'
        );
        setNotificationType('success');
      } else {
        const response = await fetch(vercelHook, {
          method: 'POST',
        });
        const statusCode = response.status;
        const data = await response.json();
        // console.log(statusCode, 'vercel data:', data);
        if (statusCode < 200 || statusCode > 299) {
          setNotificationType('error');
          setNotificationMessage(
            'An error occurred republishing the site: ' + JSON.stringify(data)
          );
        } else {
          setNotificationType('success');
          setNotificationMessage(
            'Successfully saved the new nav configuration, republishing the site now!'
          );
        }
      }
      setShowNotification(true);

      let formattedJSON;
      try {
        formattedJSON = JSON.stringify(parsed, null, 2);
        setJsonData(formattedJSON);
      } catch (error) {
        console.error(error);
      }
    }
  }
  return (
    <AdminLayout>
      <AdminNav
        switchLocales={true}
        currentLocale={currentLocale}
        locales={locales}
        homePageEditor={false}
        showConfigOptions={true}
      />

      <Container>
        <MainContent>
          <form
            onSubmit={handleSubmit}
            className={`settings-form ${parsedData['color']}`}
          >
            {showNotification && (
              <Notification
                message={notificationMessage}
                setShowNotification={setShowNotification}
                notificationType={notificationType}
              />
            )}

            <div tw="container mx-auto">
              <div tw="px-10 pt-5">
                <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
                  Navigation Builder
                </h1>
              </div>

              <div tw="flex mb-4 pt-5 px-10" key={currentNavRandom}>
                <div tw="w-full bg-gray-200 h-12">
                  <div
                    tw="flex items-center bg-gray-200 text-black text-sm font-bold px-4 py-3 mb-2"
                    role="alert"
                  >
                    <p>Current navigation links - click to remove:</p>
                  </div>
                  <nav tw="border-solid border-2 border-gray-500 px-3">
                    {currentNavOptions.map((option) => (
                      <SectionLink
                        key={`navbar-${option.type}-${option.slug}`}
                        data-type={option.type}
                        data-slug={option.slug}
                        onClick={removeLink}
                        // href={generateNavLinkFor(option)}
                        meta={metadata}
                      >
                        {option.label}
                      </SectionLink>
                    ))}
                  </nav>
                </div>
              </div>

              <div tw="flex mb-4 pt-5 px-10">
                <div tw="w-full bg-gray-500 h-12">
                  <div
                    tw="flex items-center bg-gray-500 text-white text-sm font-bold px-4 py-3"
                    role="alert"
                  >
                    <svg
                      tw="fill-current w-4 h-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z" />
                    </svg>
                    <p>Select items from the list to add to the nav:</p>
                  </div>
                  <select tw="mt-2" onChange={selectNavLinkItem}>
                    <option>Please select</option>
                    {linkOptionItems}
                  </select>

                  <div tw="flex pt-8 justify-end">
                    <AddButton tw="mr-2" onClick={handleSubmit}>
                      Save
                    </AddButton>
                    <DeleteButton onClick={handleClear}>Clear</DeleteButton>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </MainContent>
      </Container>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const apiUrl = process.env.HASURA_API_URL;
  const apiToken = process.env.ORG_SLUG;
  const tinyApiKey = process.env.TINYMCE_API_KEY;

  let siteMetadata;
  let locales;
  let linkOptions = [];

  const { errors, data } = await hasuraGetMetadataByLocale({
    url: apiUrl,
    orgSlug: apiToken,
    localeCode: context.locale,
  });

  if (errors) {
    console.error('Error getting site metadata:', errors);
    throw errors;
  } else {
    locales = data.organization_locales;
    siteMetadata = data.site_metadatas[0];
    console.log('siteMetadata:', siteMetadata);
    data.authors.forEach((author) => {
      linkOptions.push({
        type: 'author',
        name: [author.first_names, author.last_name].join(' '),
        slug: author.slug,
      });
    });
    data.categories.forEach((category) => {
      linkOptions.push({
        type: 'section',
        name: category.category_translations[0].title,
        slug: category.slug,
      });
    });
    data.pages.forEach((page) => {
      let pageTitle;
      if (page.page_translations[0]) {
        pageTitle = page.page_translations[0].headline;
      } else {
        pageTitle = page.slug;
      }
      linkOptions.push({
        type: 'page',
        name: pageTitle,
        slug: page.slug,
      });
    });
    data.tags.forEach((tag) => {
      linkOptions.push({
        type: 'tag',
        name: tag.tag_translations[0].title,
        slug: tag.slug,
      });
    });
  }
  if (siteMetadata === undefined) {
    siteMetadata = null;
  }

  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      currentLocale: context.locale,
      siteMetadata: siteMetadata,
      linkOptions: linkOptions,
      locales: locales,
      vercelHook: process.env.VERCEL_DEPLOY_HOOK,
    },
  };
}

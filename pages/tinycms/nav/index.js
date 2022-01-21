import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import tw, { styled } from 'twin.macro';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { hasuraGetMetadataByLocale } from '../../../lib/articles.js';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';
import { hasuraUpsertMetadata } from '../../../lib/site_metadata';
import Notification from '../../../components/tinycms/Notification';
import {
  AddButton,
  DeleteButton,
} from '../../../components/common/CommonStyles.js';
import { TrashIcon, SelectorIcon } from '@heroicons/react/solid';
const Container = tw.div`flex flex-wrap -mx-2`;
const MainContent = tw.div`w-full lg:w-3/4 px-4 py-4`;

const Table = tw.table`table-auto w-full`;
const TableBody = tw.tbody``;
const TableRow = tw.tr``;
const TableCell = tw.td`border px-4 py-2`;

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

    console.log('removing link', removeSlug);
    let updatedNavOptions = currentNavOptions.filter((option) => {
      if (option.slug === removeSlug && option.type === removeType) {
        return false;
      } else {
        return true;
      }
    });

    setCurrentNavOptions(updatedNavOptions);
  };

  const reorderLink = (ev) => {
    ev.preventDefault();

    let updatedNavOptions = currentNavOptions.filter((option) => {
      if (option.slug === removeSlug && option.type === removeType) {
        return false;
      } else {
        return true;
      }
    });

    setCurrentNavOptions(updatedNavOptions);
  };

  // a little function to help us with reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      currentNavOptions,
      result.source.index,
      result.destination.index
    );

    setCurrentNavOptions(items);
  };

  const grid = 8;

  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    background: isDragging ? 'lightgrey' : 'white',
    display: isDragging ? 'table' : '',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'white' : 'white',
    padding: grid,
  });

  const selectNavLinkItem = (ev) => {
    let selectedItem = ev.target[ev.target.selectedIndex];
    let selectedSlug = selectedItem.getAttribute('data-slug');
    let selectedLabel = selectedItem.getAttribute('data-label');
    let selectedType = selectedItem.getAttribute('data-type');

    let selectedOptionAlreadyChosen = currentNavOptions.find(
      (option) => option.slug === selectedSlug && option.type === selectedType
    );

    if (selectedOptionAlreadyChosen) {
      let errorMessage = `${selectedLabel} is already in the nav`;
      setNotificationType('error');
      setNotificationMessage(errorMessage);
      setShowNotification(true);
      return;
    } else {
      setNotificationType('success');
      setNotificationMessage('');
      setShowNotification(false);
    }

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
          <div tw="px-10 pt-5">
            <h1 tw="inline-block text-3xl font-extrabold text-gray-900 tracking-tight">
              Navigation Builder
            </h1>
          </div>
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
            <div tw="flex mb-4 pt-5 px-10">
              <div tw="w-full bg-gray-500 h-12">
                <div
                  tw="flex items-center bg-gray-500 text-white text-sm font-bold px-4 py-3"
                  role="alert"
                >
                  <p>Select items from the list to add to the nav:</p>
                </div>
                <select tw="mt-2" onChange={selectNavLinkItem}>
                  <option>Please select</option>
                  {linkOptionItems}
                </select>
              </div>
            </div>
          </form>
        </MainContent>
      </Container>
      <Container>
        <MainContent>
          <div tw="flex mb-4 pt-5 px-10">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                  <Table
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                    tw="table-fixed"
                  >
                    <TableBody>
                      {currentNavOptions.map((item, index) => (
                        <Draggable
                          key={`${item.type}-${item.slug}`}
                          draggableId={`${item.type}-${item.slug}`}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <TableRow
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <TableCell
                                key={`navbar-${item.type}-${item.slug}`}
                                data-type={item.type}
                                data-slug={item.slug}
                                // href={generateNavLinkFor(option)}
                                meta={metadata}
                              >
                                <SelectorIcon
                                  tw="h-5 w-5 float-left"
                                  onClick={reorderLink}
                                  data-type={item.type}
                                  data-slug={item.slug}
                                  data-index={index}
                                />
                                <span tw="float-right">{index + 1}</span>
                              </TableCell>
                              <TableCell>{item.label}</TableCell>
                              <TableCell
                                onClick={removeLink}
                                data-type={item.type}
                                data-slug={item.slug}
                              >
                                <TrashIcon
                                  tw="h-5 w-5"
                                  onClick={removeLink}
                                  data-type={item.type}
                                  data-slug={item.slug}
                                />
                              </TableCell>
                            </TableRow>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </TableBody>
                  </Table>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </MainContent>
      </Container>
      <Container>
        <MainContent>
          <div tw="flex pt-8 justify-end">
            <AddButton tw="mr-2" onClick={handleSubmit}>
              Save
            </AddButton>
            <DeleteButton onClick={handleClear}>Clear</DeleteButton>
          </div>
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
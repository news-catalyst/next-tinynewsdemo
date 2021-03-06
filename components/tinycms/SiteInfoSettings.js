import React, { useEffect, useState } from 'react';
import tw, { css, styled } from 'twin.macro';
import DonationBlock from '../plugins/DonationBlock';
import NewsletterBlock from '../plugins/NewsletterBlock';
import Upload from './Upload';

const SettingsHeader = tw.h1`text-4xl font-bold leading-normal mt-0 mb-2 text-black`;
const SiteInfoFieldsContainer = tw.div`grid grid-cols-3 gap-4`;
const SeoContainer = tw.div``;
const DesignContainer = tw.div`grid grid-cols-2 gap-4`;
const MembershipContainer = tw.div`grid grid-cols-2 gap-8`;
const NewsletterContainer = tw.div`grid grid-cols-2 gap-8`;
const DesignHeader = tw.h1`text-2xl font-bold leading-normal mt-0 mb-2 text-black`;
const SingleColumnContainer = tw.div`grid grid-cols-1 gap-4`;
const StyleOneHead = styled.span`
  font-family: 'Libre Franklin', sans-serif;
`;
const StyleOneBody = styled.span`
  font-family: 'Domine', serif;
`;
const StyleTwoHead = styled.span`
  font-family: 'Source Serif Pro', sans-serif;
`;
const StyleTwoBody = styled.span`
  font-family: 'Source Sans Pro', sans-serif;
`;
const StyleThreeHead = styled.span`
  font-family: 'Roboto Condensed', sans-serif;
`;
const StyleThreeBody = styled.span`
  font-family: 'Roboto', sans-serif;
`;
const StyleFourHead = styled.span`
  font-family: 'Arbutus Slab', serif;
`;
const StyleFourBody = styled.span`
  font-family: 'Mulish', sans-serif;
`;
const StyleFiveHead = styled.span`
  font-family: 'Bodoni Moda', serif;
`;
const StyleFiveBody = styled.span`
  font-family: 'Lato', sans-serif;
`;
const ColorContainer = styled.div`
  float: left;
`;
const ColorLabel = styled.span(
  css`
    float: left;
    ${tw`p-2 mt-1`}
  `
);
const ColorRadioFloat = styled.input`
  float: left;
  margin-right: 1em;
`;
const ColorOnePrimaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: rgba(54, 102, 209, 1);
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);
const ColorOneSecondaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: rgba(209, 131, 65, 0.12);
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);
const ColorTwoPrimaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: rgba(209, 219, 189, 1);
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);
const ColorTwoSecondaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: rgba(25, 52, 65, 1);
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);
const ColorThreePrimaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: #000000;
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);
const ColorThreeSecondaryBox = styled.div(
  css`
    margin-right: 0.5em;
    background-color: rgba(231, 229, 228, 1);
    width: 20px;
    height: 20px;
    float: left;
    clear: both;
    ${tw`h-6 w-6 p-4`}
  `
);

const Input = styled.input`
  ${tw`px-3 py-3 mb-4 placeholder-gray-300 text-gray-600 relative bg-white bg-white rounded text-sm border-0 shadow outline-none focus:outline-none focus:ring w-full`}
`;

export default function SiteInfoSettings(props) {
  const [searchTitle, setSearchTitle] = useState(
    props.parsedData['searchTitle']
  );
  const [searchDescription, setSearchDescription] = useState(
    props.parsedData['searchDescription']
  );
  const [facebookTitle, setFacebookTitle] = useState(
    props.parsedData['facebookTitle']
  );
  const [facebookDescription, setFacebookDescription] = useState(
    props.parsedData['facebookDescription']
  );
  const [twitterTitle, setTwitterTitle] = useState(
    props.parsedData['twitterTitle']
  );
  const [twitterDescription, setTwitterDescription] = useState(
    props.parsedData['twitterDescription']
  );

  const [shortName, setShortName] = useState(props.parsedData['shortName']);
  const [siteUrl, setSiteUrl] = useState(props.parsedData['siteUrl']);
  const [color, setColor] = useState(props.parsedData['color']);
  const [primaryColor, setPrimaryColor] = useState(
    props.parsedData['primaryColor']
  );
  const [secondaryColor, setSecondaryColor] = useState(
    props.parsedData['secondaryColor']
  );
  const [theme, setTheme] = useState(props.parsedData['theme']);
  const [membershipHed, setMembershipHed] = useState(
    props.parsedData['membershipHed']
  );
  const [membershipDek, setMembershipDek] = useState(
    props.parsedData['membershipDek']
  );
  const [newsletterHed, setNewsletterHed] = useState(
    props.parsedData['newsletterHed']
  );
  const [newsletterDek, setNewsletterDek] = useState(
    props.parsedData['newsletterDek']
  );
  const [logo, setLogo] = useState(props.parsedData['logo']);

  useEffect(() => {
    setSearchTitle(props.parsedData['searchTitle']);
    setSearchDescription(props.parsedData['searchDescription']);
    setFacebookTitle(props.parsedData['facebookTitle']);
    setFacebookDescription(props.parsedData['facebookDescription']);
    setTwitterTitle(props.parsedData['twitterTitle']);
    setTwitterDescription(props.parsedData['twitterDescription']);

    setShortName(props.parsedData['shortName']);
    setSiteUrl(props.parsedData['siteUrl']);
    setColor(props.parsedData['color']);
    setTheme(props.parsedData['theme']);
    setPrimaryColor(props.parsedData['primaryColor']);
    setSecondaryColor(props.parsedData['secondaryColor']);
    setMembershipDek(props.parsedData['membershipDek']);
    setMembershipHed(props.parsedData['membershipHed']);
    setNewsletterDek(props.parsedData['newsletterDek']);
    setNewsletterHed(props.parsedData['newsletterHed']);
  }, [props.parsedData]);

  return (
    <div tw="space-x-4 space-y-8">
      <SettingsHeader ref={props.siteInfoRef} id="siteInfo">
        Site Information
      </SettingsHeader>

      <SiteInfoFieldsContainer>
        <label htmlFor="shortName">
          <span tw="mt-1 font-bold">Site name</span>
          <Input
            type="text"
            name="shortName"
            value={shortName}
            onChange={props.handleChange}
          />
        </label>
        <label htmlFor="siteUrl">
          <span tw="mt-1 font-bold">Site URL</span>
          <Input
            type="text"
            name="siteUrl"
            value={siteUrl}
            onChange={props.handleChange}
          />
        </label>
        <label htmlFor="logo">
          <span tw="mt-1 font-bold">Logo</span>
          <Upload
            awsConfig={props.awsConfig}
            slug={shortName}
            image={logo}
            updateParsedData={props.updateParsedData}
            parsedData={props.parsedData}
            setter={setLogo}
            setNotificationMessage={props.setNotificationMessage}
            setNotificationType={props.setNotificationType}
            setShowNotification={props.setShowNotification}
            folderName="logos"
          />
        </label>
      </SiteInfoFieldsContainer>

      <SettingsHeader ref={props.designRef} id="design">
        Design
      </SettingsHeader>
      <DesignContainer>
        <div>
          <DesignHeader>Typography</DesignHeader>
          <SingleColumnContainer>
            <label>
              <input
                type="radio"
                name="theme"
                value="styleone"
                checked={theme === 'styleone'}
                onChange={props.handleChange}
              />
              <StyleOneHead tw="p-2 mt-1 font-bold">
                Libre Franklin is your headline font
              </StyleOneHead>
              <br />
              <StyleOneBody tw="p-2 mt-1">
                Domine is your body font
              </StyleOneBody>
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="styletwo"
                checked={theme === 'styletwo'}
                onChange={props.handleChange}
              />
              <StyleTwoHead tw="p-2 mt-1 font-bold">
                Source Serif Pro is your headline font
              </StyleTwoHead>
              <br />
              <StyleTwoBody tw="p-2 mt-1">
                Source Sans Pro is your body font
              </StyleTwoBody>
            </label>
            <label>
              <input
                type="radio"
                value="stylethree"
                name="theme"
                checked={theme === 'stylethree'}
                onChange={props.handleChange}
              />
              <StyleThreeHead tw="p-2 mt-1 font-bold">
                Roboto Condensed is your headline font
              </StyleThreeHead>
              <br />
              <StyleThreeBody tw="p-2 mt-1">
                Roboto is your body font
              </StyleThreeBody>
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="stylefour"
                checked={theme === 'stylefour'}
                onChange={props.handleChange}
              />
              <StyleFourHead tw="p-2 mt-1 font-bold">
                Arbutus Slab is your headline font
              </StyleFourHead>
              <br />
              <StyleFourBody tw="p-2 mt-1">
                Mulish is your body font
              </StyleFourBody>
            </label>
            <label>
              <input
                type="radio"
                name="theme"
                value="stylefive"
                checked={theme === 'stylefive'}
                onChange={props.handleChange}
              />
              <StyleFiveHead tw="p-2 mt-1 font-bold">
                Bodoni Moda is your headline font
              </StyleFiveHead>
              <br />
              <StyleFiveBody tw="p-2 mt-1">
                Lato is your body font
              </StyleFiveBody>
            </label>
          </SingleColumnContainer>
        </div>
        <div>
          <DesignHeader>Colors</DesignHeader>
          <SingleColumnContainer>
            <label>
              <ColorRadioFloat
                type="radio"
                name="color"
                value="colorone"
                checked={color === 'colorone'}
                onChange={props.handleChange}
              />
              <ColorContainer>
                <ColorOnePrimaryBox></ColorOnePrimaryBox>
                <ColorLabel>Primary</ColorLabel>
                <ColorOneSecondaryBox></ColorOneSecondaryBox>
                <ColorLabel>Secondary</ColorLabel>
              </ColorContainer>
            </label>
            <label>
              <ColorRadioFloat
                type="radio"
                name="color"
                value="colortwo"
                checked={color === 'colortwo'}
                onChange={props.handleChange}
              />
              <ColorContainer>
                <ColorTwoPrimaryBox></ColorTwoPrimaryBox>
                <ColorLabel>Primary</ColorLabel>
                <ColorTwoSecondaryBox></ColorTwoSecondaryBox>
                <ColorLabel>Secondary</ColorLabel>
              </ColorContainer>
            </label>
            <label>
              <ColorRadioFloat
                type="radio"
                name="color"
                value="colorthree"
                checked={color === 'colorthree'}
                onChange={props.handleChange}
              />
              <ColorContainer>
                <ColorThreePrimaryBox></ColorThreePrimaryBox>
                <ColorLabel>Primary</ColorLabel>
                <ColorThreeSecondaryBox></ColorThreeSecondaryBox>
                <ColorLabel>Secondary</ColorLabel>
              </ColorContainer>
            </label>
            <label>
              <ColorRadioFloat
                type="radio"
                name="color"
                value="custom"
                checked={color === 'custom'}
                onChange={props.handleChange}
              />
              <div tw="grid grid-cols-1">
                <span>Custom</span>
                <label htmlFor="primaryColor">
                  <Input
                    type="text"
                    name="primaryColor"
                    placeholder="Primary color (use hex code)"
                    value={primaryColor}
                    onChange={props.handleChange}
                  />
                  <Input
                    type="text"
                    name="secondaryColor"
                    placeholder="Secondary color (use hex code)"
                    value={secondaryColor}
                    onChange={props.handleChange}
                  />
                </label>
              </div>
            </label>
          </SingleColumnContainer>
        </div>
      </DesignContainer>

      <NewsletterContainer ref={props.newsletterRef} id="newsletter">
        <SettingsHeader tw="col-span-3 mt-5">
          Newsletter promotion block
        </SettingsHeader>

        <div tw="col-span-2">
          <label htmlFor="heading">
            <span tw="w-full mt-1 font-bold">Heading</span>
            <Input
              type="text"
              name="newsletterHed"
              value={newsletterHed}
              onChange={props.handleChange}
            />
          </label>
          <label htmlFor="description">
            <span tw="mt-1 font-bold">Description</span>
            <Input
              type="text"
              name="newsletterDek"
              value={newsletterDek}
              onChange={props.handleChange}
            />
          </label>
        </div>
        <div tw="col-span-1">
          <span tw="mt-1 font-bold">Preview</span>

          <NewsletterBlock metadata={props.parsedData} />
        </div>
      </NewsletterContainer>

      <MembershipContainer ref={props.membershipRef} id="membership">
        <SettingsHeader tw="col-span-3 mt-5">
          Membership promotion block
        </SettingsHeader>

        <div tw="col-span-2">
          <label htmlFor="heading">
            <span tw="w-full mt-1 font-bold">Heading</span>
            <Input
              type="text"
              name="membershipHed"
              value={membershipHed}
              onChange={props.handleChange}
            />
          </label>
          <label htmlFor="description">
            <span tw="mt-1 font-bold">Description</span>
            <Input
              type="text"
              name="membershipDek"
              value={membershipDek}
              onChange={props.handleChange}
            />
          </label>
        </div>
        <div tw="col-span-1">
          <span tw="mt-1 font-bold">Preview</span>

          <DonationBlock metadata={props.parsedData} />
        </div>
      </MembershipContainer>

      <SeoContainer ref={props.seoRef}>
        <SettingsHeader tw="col-span-3 mt-5" id="seo">
          SEO and Social Metadata
        </SettingsHeader>

        <div tw="mt-2">
          <label htmlFor="searchTitle">
            <span tw="mt-1 font-bold">Search title</span>
            <Input
              tw="w-full rounded-md border-solid border-gray-300"
              type="text"
              name="searchTitle"
              value={searchTitle}
              onChange={props.handleChange}
            />
          </label>
        </div>
        <div tw="mt-2">
          <label htmlFor="searchDescription">
            <span tw="mt-1 font-bold">Search description</span>
            <Input
              tw="w-full"
              type="text"
              name="searchDescription"
              value={searchDescription}
              onChange={props.handleChange}
            />
          </label>
        </div>
        <div tw="mt-2">
          <label htmlFor="facebookTitle">
            <span tw="mt-1 font-bold">Facebook title</span>
            <Input
              tw="w-full"
              type="text"
              name="facebookTitle"
              value={facebookTitle}
              onChange={props.handleChange}
            />
          </label>
        </div>
        <div tw="mt-2">
          <label htmlFor="facebookDescription">
            <span tw="mt-1 font-bold">Facebook description</span>
            <Input
              tw="w-full"
              type="text"
              name="facebookDescription"
              value={facebookDescription}
              onChange={props.handleChange}
            />
          </label>
        </div>
        <div tw="mt-2">
          <label htmlFor="twitterTitle">
            <span tw="mt-1 font-bold">Twitter title</span>
            <Input
              tw="w-full"
              type="text"
              name="twitterTitle"
              value={twitterTitle}
              onChange={props.handleChange}
            />
          </label>
        </div>
        <div tw="mt-2">
          <label htmlFor="twitterDescription">
            <span tw="mt-1 font-bold">Twitter description</span>
            <Input
              tw="w-full"
              type="text"
              name="twitterDescription"
              value={twitterDescription}
              onChange={props.handleChange}
            />
          </label>
        </div>
      </SeoContainer>
    </div>
  );
}

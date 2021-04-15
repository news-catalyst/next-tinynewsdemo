import React from 'react';
import tw, { css, styled } from 'twin.macro';

const SettingsHeader = tw.h1`text-4xl font-bold leading-normal mt-0 mb-2 text-black`;
const SiteInfoFieldsContainer = tw.div`grid grid-cols-3 gap-4`;
const DesignContainer = tw.div`grid grid-cols-2 gap-4`;
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

export default function SiteInfoSettings(props) {
  return (
    <div tw="space-x-4 space-y-4">
      <SettingsHeader>Site Information</SettingsHeader>

      <SiteInfoFieldsContainer>
        <label for="shortName">
          <span tw="mt-1 font-bold">Site name</span>
          <input
            type="text"
            name="shortName"
            value={props.shortName}
            onChange={props.handleChange}
          />
        </label>
        <label for="siteUrl">
          <span tw="mt-1 font-bold">Site URL</span>
          <input
            type="text"
            name="siteUrl"
            value={props.siteUrl}
            onChange={props.handleChange}
          />
        </label>
        <label for="logo">
          <span tw="mt-1 font-bold">Logo</span>
          <input type="file" name="logo" onChange={props.handleChange} />
        </label>
      </SiteInfoFieldsContainer>

      <SettingsHeader>Design</SettingsHeader>
      <DesignContainer>
        <div>
          <DesignHeader>Typography</DesignHeader>
          <SingleColumnContainer>
            <label>
              <input
                type="radio"
                name="theme"
                value="styleone"
                checked={props.theme === 'styleone'}
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
                checked={props.theme === 'styletwo'}
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
                checked={props.theme === 'stylethree'}
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
                checked={props.theme === 'stylefour'}
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
                checked={props.color === 'colorone'}
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
                checked={props.color === 'colortwo'}
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
                checked={props.color === 'colorthree'}
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
                checked={props.color === 'custom'}
                onChange={props.handleChange}
              />
              <div tw="grid grid-cols-1">
                <span>Custom</span>
                <label for="primaryColor">
                  <input
                    type="text"
                    name="primaryColor"
                    placeholder="Primary color (use hex code)"
                    value={props.primaryColor}
                    onChange={props.handleChange}
                  />
                  <input
                    type="text"
                    name="secondaryColor"
                    placeholder="Secondary color (use hex code)"
                    value={props.secondaryColor}
                    onChange={props.handleChange}
                  />
                </label>
              </div>
            </label>
          </SingleColumnContainer>
        </div>
      </DesignContainer>
    </div>
  );
}

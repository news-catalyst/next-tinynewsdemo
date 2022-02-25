import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import Link from 'next/link';

const NavBar = tw.header`flex h-12 items-center bg-gray-100`;
const HomepageNavBar = tw.header`flex pt-3 px-2 h-12 w-full justify-end bg-blue-100`;
const NavBarContainer = tw.div`w-full container-md mx-auto px-6`;
const NavBarInnerContainer = tw.div`flex justify-between flex-col md:flex-row`;

const BrandContainer = tw.div`w-full md:w-1/5 text-center md:text-left font-bold`;

const NavItemsDiv = tw.div`flex justify-center items-center w-full md:w-4/5`;
const HomepageNavItemsDiv = tw.div`flex justify-end items-center w-full md:w-3/5`;
const NavItem = tw.a`mx-4 cursor-pointer`;
const SaveButton = tw.a`hidden md:flex justify-end text-center h-8 w-full md:w-auto px-3 py-2 text-right bg-green-900 hover:bg-green-500 text-white md:rounded`;

export default function NewAdminNav(props) {
  const [currentLayoutName, setCurrentLayoutName] = useState('');

  async function switchLayout(layoutData) {
    props.changeLayout(layoutData);
    setCurrentLayoutName(layoutData.name);
  }

  useEffect(() => {
    if (
      props.homePageEditor &&
      props.hpData &&
      props.hpData.homepage_layout_schema
    ) {
      setCurrentLayoutName(props.hpData.homepage_layout_schema.name);
    } else if (props.homePageEditor) {
      console.log('is homepage editor AND missing hp data/schema', props);
    }
  }, []);

  return (
    <div>
      <NavBar>
        <NavBarContainer>
          <NavBarInnerContainer>
            <BrandContainer>
              <Link href="/tinycms" passHref>
                <a tw="text-4xl">TinyCMS</a>
              </Link>
            </BrandContainer>
            <NavItemsDiv>
              <Link href="/tinycms/analytics" passHref>
                <NavItem>Analytics</NavItem>
              </Link>
              <Link href="/tinycms/homepage" passHref>
                <NavItem>Homepage Editor</NavItem>
              </Link>
              <Link href="/tinycms/authors" passHref>
                <NavItem>Authors</NavItem>
              </Link>
              <Link href="/tinycms/settings" passHref>
                <NavItem>Settings</NavItem>
              </Link>
              <Link href="/tinycms/sections" passHref>
                <NavItem>Sections</NavItem>
              </Link>
              <Link href="/tinycms/tags" passHref>
                <NavItem>Tags</NavItem>
              </Link>
            </NavItemsDiv>
          </NavBarInnerContainer>
        </NavBarContainer>
      </NavBar>

      {props.homePageEditor && (
        <HomepageNavBar>
          <NavBarContainer>
            <NavBarInnerContainer>
              <BrandContainer>
                <NavItem tw="font-bold">Change Layout:</NavItem>
              </BrandContainer>
              <HomepageNavItemsDiv>
                {props.layoutSchemas.map((option) => (
                  <NavItem
                    className="layout-switcher"
                    key={option.id}
                    onClick={() => switchLayout(option)}
                  >
                    {option.name}
                    {option.name === currentLayoutName ? ` (current)` : ``}
                  </NavItem>
                ))}
                <SaveButton onClick={() => props.saveAndPublishHomepage()}>
                  Save
                </SaveButton>
              </HomepageNavItemsDiv>
            </NavBarInnerContainer>
          </NavBarContainer>
        </HomepageNavBar>
      )}
    </div>
  );
}

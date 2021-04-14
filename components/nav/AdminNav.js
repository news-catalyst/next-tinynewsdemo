import React, { useEffect, useState } from 'react';
import tw from 'twin.macro';
import Link from 'next/link';
import { signOut } from 'next-auth/client';

const NavBar = tw.nav`flex items-center flex-wrap p-3`;
const Brand = tw.span`text-xl text-black font-bold tracking-wide`;

const NavItemsDiv = tw.div`hidden w-full lg:inline-flex lg:flex-grow lg:w-auto`;
const NavItem = tw.a`lg:inline-flex lg:w-auto w-full px-3 py-2 rounded text-black items-center justify-center`;
const SignoutButton = tw.a`hidden md:flex w-full md:w-auto px-4 py-2 text-right bg-blue-900 hover:bg-blue-500 text-white md:rounded`;

const DropdownContainer = tw.div`relative inline-block text-left`;
const DropdownButtonToggle = tw.button`inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500`;
const DropdownMenu = tw.div`origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none`;
const DropdownItem = tw.a`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900`;

export default function NewAdminNav(props) {
  const [currentLayoutName, setCurrentLayoutName] = useState('');

  async function switchLayout(layoutData) {
    props.changeLayout(layoutData);
    setCurrentLayoutName(layoutData.name);
  }

  useEffect(() => {
    if (props.homePageEditor && props.hpData && props.hpData.layoutSchema) {
      setCurrentLayoutName(props.hpData.layoutSchema.name);
    } else if (props.homePageEditor) {
      setCurrentLayoutName(props.layoutSchemas[0].name);
    }
  }, [props.hpData]);

  return (
    <div>
      <NavBar>
        <Link href="/tinycms">
          <Brand>
            <a href="/tinycms">TinyCMS</a>
          </Brand>
        </Link>
        <NavItemsDiv>
          <Link href="/tinycms/analytics">
            <NavItem>analytics</NavItem>
          </Link>
          <Link href="/tinycms/homepage">
            <NavItem>homepage editor</NavItem>
          </Link>
          <Link href="/tinycms/homepage-layouts">
            <NavItem>layouts</NavItem>
          </Link>
          <Link href="/tinycms/authors">
            <NavItem>authors</NavItem>
          </Link>
          <Link href="/tinycms/metadata">
            <NavItem>metadata</NavItem>
          </Link>
          <Link href="/tinycms/sections">
            <NavItem>sections</NavItem>
          </Link>
          <Link href="/tinycms/tags">
            <NavItem>tags</NavItem>
          </Link>

          {props.homePageEditor && (
            <>
              <DropdownContainer>
                <div>
                  <DropdownButtonToggle
                    type="button"
                    id="options-menu"
                    aria-expanded="true"
                    aria-haspopup="true"
                  >
                    Options
                    <svg
                      className="-mr-1 ml-2 h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </DropdownButtonToggle>
                </div>
                <DropdownMenu
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <div className="py-1" role="none">
                    {props.layoutSchemas.map((option) => (
                      <DropdownItem
                        role="menuitem"
                        key={option.id}
                        onClick={() => switchLayout(option)}
                      >
                        {option.name}
                      </DropdownItem>
                    ))}
                  </div>
                </DropdownMenu>
              </DropdownContainer>

              <NavItem>Currently using {currentLayoutName}</NavItem>
            </>
          )}

          <SignoutButton onClick={() => signOut()}>Sign out</SignoutButton>
        </NavItemsDiv>
      </NavBar>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { signOut } from 'next-auth/client';

export default function AdminNav(props) {
  const [currentLayoutName, setCurrentLayoutName] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (props.homePageEditor && props.hpData && props.hpData.layoutSchema) {
      setCurrentLayoutName(props.hpData.layoutSchema.name);
    } else if (props.homePageEditor) {
      setCurrentLayoutName(props.layoutSchemas[0].name);
    }
  }, [props.hpData]);

  async function switchLayout(layoutData) {
    props.changeLayout(layoutData);
    setCurrentLayoutName(layoutData.name);
  }

  return (
    <nav className="navbar">
      <div className="navbar-item">
        <a href="/tinycms">tinycms</a>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <a
            className={
              /\/tinycms\/analytics/.test(document.location.pathname)
                ? 'navbar-item is-tab is-active'
                : 'navbar-item'
            }
            href="/tinycms/analytics"
          >
            analytics
          </a>
          <a
            className={
              /\/tinycms\/homepage/.test(document.location.pathname)
                ? 'navbar-item is-tab is-active'
                : 'navbar-item'
            }
            href="/tinycms/homepage"
          >
            homepage editor
          </a>
          <a
            className={
              /\/tinycms\/homepage-layouts/.test(document.location.pathname)
                ? 'navbar-item is-tab is-active'
                : 'navbar-item'
            }
            href="/tinycms/homepage-layouts"
          >
            homepage layouts
          </a>
          <a
            className={
              /\/tinycms\/authors/.test(document.location.pathname)
                ? 'navbar-item is-tab is-active'
                : 'navbar-item'
            }
            href="/tinycms/authors"
          >
            authors
          </a>
          <a
            className={
              /\/tinycms\/metadata/.test(document.location.pathname)
                ? 'navbar-item is-tab is-active'
                : 'navbar-item'
            }
            href="/tinycms/metadata"
          >
            metadata
          </a>
          <a
            className={
              /\/tinycms\/sections/.test(document.location.pathname)
                ? 'navbar-item is-tab is-active'
                : 'navbar-item'
            }
            href="/tinycms/sections"
          >
            sections
          </a>
          <a
            className={
              /\/tinycms\/tags/.test(document.location.pathname)
                ? 'navbar-item is-tab is-active'
                : 'navbar-item'
            }
            href="/tinycms/tags"
          >
            tags
          </a>
        </div>
        <div className="navbar-end">
          <div className="navbar-item">
            <div className="control">
              <button
                className="button is-light is-small"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </div>
          </div>
          {props.homePageEditor && (
            <>
              <div
                className={`navbar-item has-dropdown ${
                  showDropdown && 'is-active'
                }`}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                <a className="navbar-link">Change layout</a>
                <div className="navbar-dropdown is-right">
                  {props.layoutSchemas.map((option) => (
                    <a
                      key={option.id}
                      onClick={() => switchLayout(option)}
                      className="navbar-item"
                    >
                      {option.name}
                    </a>
                  ))}
                  <div className="navbar-item">
                    Currently using {currentLayoutName}
                  </div>
                </div>
              </div>
              <div className="navbar-item">
                <button
                  className="button is-primary"
                  onClick={() => {
                    window.confirm(
                      'Are you sure you want to publish the homepage?'
                    ) && props.saveAndPublishHomepage();
                  }}
                >
                  Save & Publish
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

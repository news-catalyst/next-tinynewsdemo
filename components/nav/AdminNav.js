import React, { useEffect, useState } from 'react';

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
          <a className="navbar-item" href="/tinycms/homepage">
            homepage editor
          </a>
          <a className="navbar-item" href="/tinycms/homepage-layouts">
            homepage layouts
          </a>
          <a className="navbar-item" href="/tinycms/authors">
            authors
          </a>
          <a className="navbar-item" href="/tinycms/metadata">
            metadata
          </a>
          <a className="navbar-item" href="/tinycms/sections">
            sections
          </a>
          <a className="navbar-item" href="/tinycms/tags">
            tags
          </a>
        </div>
        {props.homePageEditor && (
          <div className="navbar-end">
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
          </div>
        )}
      </div>
    </nav>
  );
}

import React, { useEffect, useState } from 'react';

export default function AdminNav(props) {
  console.log(props);

  const [currentLayoutName, setCurrentLayoutName] = useState(
    props.hpData.layoutSchema.name
  );

  async function changeLayout(layoutData) {
    console.log('changing layout:', layoutData);
    props.changeLayout(layoutData);
    setCurrentLayoutName(layoutData.name.value);
  }

  return (
    <nav className="navbar">
      <div className="navbar-item">tinycms</div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" href="/tinycms/homepage">
            homepage editor
          </a>
          <a className="navbar-item" href="/tinycms/authors">
            manage authors
          </a>
        </div>
        {props.homePageEditor && (
          <div className="navbar-end">
            <div className="navbar-item has-dropdown is-active">
              <a className="navbar-link">Change layout</a>
              <div className="navbar-dropdown is-right">
                {props.layoutSchemas.map((option) => (
                  <a
                    key={option.id}
                    onClick={() => changeLayout(option)}
                    className="navbar-item"
                  >
                    {option.name.value}
                  </a>
                ))}
                <div className="navbar-item">
                  Currently using {currentLayoutName}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

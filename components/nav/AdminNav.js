import React from 'react';
import Link from 'next/link';

export default function AdminNav(props) {
  console.log(props);
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
                <a className="navbar-item">Option 1</a>
                <a className="navbar-item">Option 2</a>
                <hr className="navbar-divider" />
                <div className="navbar-item">Currently using Option 1</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

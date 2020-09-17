import React from 'react';
import Link from 'next/link';

export default function AdminNav() {
  return (
    <nav className="navbar">
      <div className="navbar-item">tinycms</div>
      <a className="navbar-item" href="/tinycms/homepage">
        homepage editor
      </a>
      <a className="navbar-item" href="/tinycms/authors">
        manage authors
      </a>
    </nav>
  );
}

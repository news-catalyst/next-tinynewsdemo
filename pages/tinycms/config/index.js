import Link from 'next/link';
import React from 'react';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';

export default function Config(props) {
  return (
    <AdminLayout>
      <AdminNav homePageEditor={false} />
      <div id="page">
        <h1 className="title">Site Config & Setup</h1>
        <ul>
          <li>
            <Link href="/tinycms/config/homepage-layouts">
              Homepage Layouts
            </Link>
          </li>
          <li>
            <Link href="/tinycms/config/categories">Categories/Sections</Link>
          </li>
        </ul>
      </div>
    </AdminLayout>
  );
}

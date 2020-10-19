import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { listLayoutSchemas } from '../../../lib/homepage.js';
import AdminLayout from '../../../components/AdminLayout.js';
import AdminNav from '../../../components/nav/AdminNav';

export default function HomepageLayouts(props) {
  // const [message, setMessage] = useState(null);

  // const router = useRouter();
  // const { action } = router.query;

  // useEffect(() => {
  //   if (action && action === 'edit') {
  //     setMessage('Successfully updated homepage layout.');
  //   }
  //   if (action && action === 'create') {
  //     setMessage('Successfully created homepage layout.');
  //   }
  // }, []);

  // const listItems = homepageLayouts.map((homepageLayout) => {
  //   return (
  //     <li key={homepageLayout.id}>
  //       <Link key={`${homepageLayout.id}-link`} href={`/tinycms/config/homepage-layouts/${homepageLayout.id}`}>
  //         <a>{homepageLayout.name}</a>
  //       </Link>
  //     </li>
  //   );
  // });

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

// export async function getStaticProps() {
//   let homepageLayouts = await listLayoutSchemas();
//   return {
//     props: {
//       homepageLayouts: homepageLayouts,
//     },
//   };
// }

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { listAllAuthors } from '../../lib/authors.js';
import AdminLayout from '../../components/AdminLayout.js';

export default function Authors({ authors }) {
  const [message, setMessage] = useState(null);

  const router = useRouter();
  const { action } = router.query;

  useEffect(() => {
    if (action && action === 'edit') {
      setMessage('Successfully updated author.');
    }
    if (action && action === 'create') {
      setMessage('Successfully created author.');
    }
  }, []);

  const listItems = authors.map((author) => {
    return (
      <li key={author.id}>
        <Link key={`${author.id}-link`} href={`/authors/${author.id}`}>
          <a>
            {author.name.value}, {author.title.value}
          </a>
        </Link>
      </li>
    );
  });

  return (
    <AdminLayout>
      <div id="page">
        <h1>Authors</h1>
        <Link href="/add-author">Add Author</Link>

        {message && <div className="success">{message}</div>}
        <ul>{listItems}</ul>
      </div>
    </AdminLayout>
  );
}

export async function getStaticProps() {
  let authors = await listAllAuthors();
  return {
    props: {
      authors: authors,
    },
  };
}

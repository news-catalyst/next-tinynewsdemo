import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../../components/AdminLayout';
import {
  getAuthor,
  listAllAuthorIds,
  updateAuthor,
} from '../../../lib/authors';

export default function EditAuthor({ apiUrl, apiToken, author }) {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [twitter, setTwitter] = useState('');
  const [staff, setStaff] = useState(false);
  const [bio, setBio] = useState('');
  const [authorId, setAuthorId] = useState(null);
  const [error, setError] = useState(null);
  const [staffYesNo, setStaffYesNo] = useState('no');

  useEffect(() => {
    if (author) {
      setName(author.name.value);
      setTitle(author.title.value);
      setTwitter(author.twitter.value);
      setBio(author.bio.value);
      setAuthorId(author.id);
      if (author.staff.value) {
        setStaffYesNo('yes');
      } else {
        setStaffYesNo('no');
      }
      setStaff(author.staff.value);
    }
  }, []);
  const router = useRouter();

  const handleChange = (ev) => {
    if (ev.target.value === 'yes') {
      setStaff(true);
    } else {
      setStaff(false);
    }
    setStaffYesNo(ev.target.value);
  };

  async function handleCancel(ev) {
    ev.preventDefault();
    router.push('/tinycms/authors');
  }

  async function handleSubmit(ev) {
    ev.preventDefault();

    const response = await updateAuthor(
      apiUrl,
      apiToken,
      authorId,
      name,
      title,
      twitter,
      bio,
      staff
    );

    if (response.content.error !== null) {
      setError(response.content.error);
    } else {
      setAuthorId(response.content.data.id);
      router.push('/tinycms/authors?action=edit');
    }
  }

  return (
    <AdminLayout>
      <div id="page">
        <h1 className="title">Edit Author</h1>
        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label" htmlFor="name">
              Name
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={name}
                name="name"
                onChange={(ev) => setName(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="title">
              Title
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={title}
                name="title"
                onChange={(ev) => setTitle(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="twitter">
              Twitter
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={twitter}
                name="twitter"
                onChange={(ev) => setTwitter(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label" htmlFor="bio">
              Bio
            </label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={bio}
                name="Twitter"
                onChange={(ev) => setBio(ev.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <label className="radio">
                <input
                  type="radio"
                  name="staff"
                  value="yes"
                  checked={staffYesNo === 'yes'}
                  onChange={handleChange}
                />{' '}
                Staff
              </label>
              <label className="radio">
                <input
                  type="radio"
                  name="staff"
                  value="no"
                  checked={staffYesNo === 'no'}
                  onChange={handleChange}
                />{' '}
                Not Staff
              </label>
            </div>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <input
                className="button is-link"
                name="submit"
                type="submit"
                value="Submit"
              />
            </div>
            <div className="control">
              <button
                className="button is-link is-light"
                name="cancel"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
export async function getStaticPaths() {
  const paths = await listAllAuthorIds();
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const apiUrl = process.env.ADMIN_CONTENT_DELIVERY_API_URL;
  const apiToken = process.env.ADMIN_CONTENT_DELIVERY_API_ACCESS_TOKEN;
  let author = await getAuthor(params.id);
  return {
    props: {
      apiUrl: apiUrl,
      apiToken: apiToken,
      author: author,
    },
  };
}

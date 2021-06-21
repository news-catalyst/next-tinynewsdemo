import React from 'react';
import { FacebookProvider, EmbeddedPost } from 'react-facebook';
 
export default function Facebook({ node }) {
  return (
    <FacebookProvider appId="123456789">
      <EmbeddedPost href={node.link} width="500" />
    </FacebookProvider>
  );
}
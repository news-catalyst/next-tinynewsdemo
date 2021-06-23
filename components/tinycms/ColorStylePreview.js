import React from 'react';

export default function ColorStylePreview(props) {
  let imgName = '/tinycms/' + props.color + '-' + props.theme + '.png';
  return (
    <div className="field color-style-preview" key="color-style-preview">
      <h2>Homepage preview</h2>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imgName} alt="" />
    </div>
  );
}

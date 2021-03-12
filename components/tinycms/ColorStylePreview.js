import React from 'react';

export default function ColorStylePreview(props) {
  let imgName = '/tinycms/' + props.color + '-' + props.theme + '.png';
  return (
    <div className="field color-style-preview" key="color-style-preview">
      <h2>Homepage preview</h2>
      <img src={imgName} />
    </div>
  );
}

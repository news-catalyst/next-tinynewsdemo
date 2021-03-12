import React from 'react';

export default function ColorStylePreview(props) {
  let imgName = '/tinycms/' + props.color + '-' + props.theme + '.png';
  return (
    <div className="field" key="color-style-preview">
      <img src={imgName} />
    </div>
  );
}

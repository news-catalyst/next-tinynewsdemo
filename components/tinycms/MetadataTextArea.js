import React from 'react';

export default function MetadataTextArea(props) {
  console.log('textarea props:', props);
  return (
    <div className="field" key={props.name}>
      <label className="label" htmlFor={props.name}>
        {props.label}
      </label>
      <div className="control">
        <textarea
          name={props.name}
          className="textarea"
          onChange={props.handleChange}
          value={props.value}
        />
      </div>
    </div>
  );
}

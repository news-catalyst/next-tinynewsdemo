import React from 'react';

export default function MetadataTextInput(props) {
  return (
    <div className="field" key={props.name}>
      <label className="label" htmlFor={props.name}>
        {props.label}
      </label>
      <div className="control">
        <input
          type="text"
          name={props.name}
          className="input"
          value={props.value}
          onChange={props.handleChange}
        />
      </div>
    </div>
  );
}

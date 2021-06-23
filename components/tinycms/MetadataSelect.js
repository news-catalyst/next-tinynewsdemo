import React from 'react';

export default function MetadataSelect(props) {
  return (
    <div className="field" key={props.name}>
      <label className="label" htmlFor={props.name}>
        {props.label}
      </label>
      <div className="control">
        <select
          name={props.name}
          className="select"
          value={props.value}
          onChange={props.handleChange}
        >
          {props.choices.map((choice) => (
            <option key={choice} value={choice}>
              {choice}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

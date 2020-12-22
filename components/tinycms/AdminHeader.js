import React from 'react';
import LocaleSwitcher from './LocaleSwitcher';

export default function AdminHeader(props) {
  return (
    <div>
      <div className="level-left">
        <div className="level-item">
          <h1 className="title">
            {props.title} ({props.currentLocale.code})
          </h1>
        </div>
      </div>
      <div className="level-right">
        <div className="level-item">
          <LocaleSwitcher
            locales={props.locales}
            currentLocale={props.currentLocale}
            id={props.id}
          />
        </div>
      </div>
    </div>
  );
}

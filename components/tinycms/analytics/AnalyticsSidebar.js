import React from 'react';

const AnalyticsSidebar = (props) => {
  return (
    <article className="message">
      <div className="message-header">
        <p>{props.title}</p>
      </div>
      <div className="message-body">{props.children}</div>
    </article>
  );
};

export default AnalyticsSidebar;

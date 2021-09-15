import { Component } from 'react';

class Coral extends Component {
  componentDidMount() {
    const script = document.createElement('script');
    script.id = 'loadCoral';
    script.src = '/coral.js';
    script.async = true;
    this.instance.appendChild(script);
  }

  render() {
    return (
      <div
        ref={(el) => (this.instance = el)}
        id="coral_thread"
        style={{
          paddingLeft: '1.25rem',
          paddingRight: '1.25rem',
          width: '100%',
          marginRight: 'auto',
          marginLeft: 'auto',
          maxWidth: '64rem',
        }}
      ></div>
    );
  }
}

Coral.displayName = 'Coral';

export default Coral;

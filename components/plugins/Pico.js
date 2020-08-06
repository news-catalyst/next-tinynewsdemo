import React, { Component } from 'react';

class Pico extends Component {
  componentDidMount() {
    var pageInfo = {
      article: this.props.article,
      post_type: this.props.postType,
      url: window.location.href,
    };
    if (this.props.post_id) {
      pageInfo.post_id = this.props.post_id;
    }
    if (this.props.tags) {
      pageInfo.taxonomies = { tags: this.props.tags };
    }

    if (window.pico) {
      console.log('Pico is loaded');
      console.log(pageInfo);
      window.pico('visit', pageInfo);
    }
  }

  render() {
    return (
      <div>
        <button ref={(el) => (this.instance = el)} className="PicoRule">
          Open Pico (Test)
        </button>
      </div>
    );
  }
}

export default Pico;

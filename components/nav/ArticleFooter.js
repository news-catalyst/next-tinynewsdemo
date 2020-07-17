import { Component } from 'react';

class ArticleFooter extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="content has-text-centered">
          <p>
            <strong>{this.props.metadata.footerTitle}</strong> by{' '}
            <a href={this.props.metadata.footerBylineLink}>
              {this.props.metadata.footerBylineName}
            </a>
            .
          </p>
        </div>
      </footer>
    );
  }
}
export default ArticleFooter;

import Link from 'next/link';

export const renderAuthor = (author, i) => {
  if (author.slug !== null && author.slug !== undefined) {
    return (
      <Link href={`/authors/${author.slug}`} key={`${author.slug}-${i}`}>
        <a className="is-link">{author.name}</a>
      </Link>
    );
  } else {
    return (
      <span className="author" key={author.id}>
        {author.name}
      </span>
    );
  }
};

// solution that works with react elements from https://codepen.io/pascalpp/pen/MKRwjP
export const renderAuthors = (authors) => {
  authors = authors.map(renderAuthor);

  var output = [];
  authors.forEach(function (author, i) {
    // if list is more than one item and this is the last item, prefix with 'and '
    if (authors.length > 1 && i === authors.length - 1) output.push('and ');
    // output the item
    output.push(author);
    // if list is more than 2 items, append a comma to all but the last item
    if (authors.length > 2 && i < authors.length - 1) output.push(',');
    // if list is more than 1 item, append a space to all but the last item
    if (authors.length > 1 && i < authors.length - 1) output.push(' ');
  });

  return output;
};

import { Editor } from '@tinymce/tinymce-react';

const TinyEditor = ({ tinyApiKey, value, setValue }) => {
  return (
    <Editor
      apiKey={tinyApiKey}
      initialValue={value}
      init={{
        height: 250,
        menubar: false,
        plugins: [
          'advlist autolink lists link image',
          'charmap print preview anchor help',
          'searchreplace visualblocks code',
          'insertdatetime media table paste wordcount',
        ],
        toolbar:
          'undo redo | formatselect | bold italic | \
            alignleft aligncenter alignright | \
            bullist numlist outdent indent | help',
      }}
      onChange={setValue}
    />
  );
};
export default TinyEditor;

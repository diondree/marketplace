import { useCallback, useState } from 'react';
import { NextPage } from 'next';
import { useDropzone } from 'react-dropzone';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

const ADD_PRODUCT = gql`
  mutation AddProduct(
    $name: String!
    $description: String
    $price: Float!
    $storeId: String!
    $images: [String!]
  ) {
    addProduct(
      name: $name
      description: $description
      price: $price
      storeId: $storeId
      images: $images
    ) {
      name
      description
      price
    }
  }
`;

const IndexPage: NextPage = () => {
  const initialProduct = {
    name: 'Macbook Pro',
    description: 'Best laptop',
    price: 3600,
    storeId: 'store1',
  };

  const [state, setState] = useState('initial');
  const [files, setFiles] = useState([]);
  const [addProduct, { data, error }] = useMutation(ADD_PRODUCT);

  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    console.log('FILES');
    console.log(acceptedFiles);
    const filePaths = acceptedFiles.map((file: any) => file.path);
    setFiles(filePaths);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ['image/png', 'image/jpeg'],
    onDrop,
  });

  const submit = async () => {
    try {
      setState('loading');
      await addProduct({ variables: { ...initialProduct, images: files } });
      setState('initial');
    } catch (err) {
      console.log(err);
      setState('error');
    }
  };
  return (
    <div>
      <h1>File Uploader</h1>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag and drop some files here, or click to select files</p>
        )}
      </div>
      {error && <span>An Error occurrred</span>}
      <button disabled={state === 'loading'} onClick={submit}>
        Submit
      </button>
    </div>
  );
};

export default IndexPage;

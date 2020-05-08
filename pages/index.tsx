import { useCallback, useState } from 'react';
import { NextPage } from 'next'
import { useDropzone } from 'react-dropzone'
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';


const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $description: String, $price: Float!, $storeId: String!, $images: [String!] ) {
    addProduct(name: $name, description: $description, price: $price, storeId: $storeId, images: $images) {
      name
      description
      price
    }
  }
`;

const IndexPage: NextPage = () => {
  const initialProduct = {
    name: "Macbook Pro",
    description: "Best laptop",
    price: 3600,
    storeId: "store1",
  }

  const [state, setState] = useState('initial');
  const [files, setFiles] = useState([]);
  const [addProduct, { data, error }] = useMutation(ADD_PRODUCT);

  const onDrop = useCallback(acceptedFiles => {
    // Do something with the files
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: ["image/x-png", "image/jpeg"] })

  const submit = async () => {
    try {
      setState('loading')
      await addProduct({ variables: { ...initialProduct, images: files } });
      setState('initial')
    } catch (err) {
      console.log(err)
      setState('error')
    }
  }
  return (
    <div>
      <h1>File Uploader</h1>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {
          isDragActive ?
            <p>Drop the files here ...</p> :
            <p>Drag 'n' drop some files here, or click to select files</p>
        }
      </div>
      {error && (<span>An Error occurrred</span>)}
      <button disabled={state === "loading"} onClick={submit}>Submit</button>
    </div>
  )
}

export default IndexPage
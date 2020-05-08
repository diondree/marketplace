import { useState } from 'react';
import { NextPage } from 'next';
import { useMutation } from 'react-apollo';
import gql from 'graphql-tag';

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    sellerLogin(email: $email, password: $password) {
      seller {
        email
        name
      }
      token
    }
  }
`;

const LoginPage: NextPage = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [login, { data, error }] = useMutation(LOGIN);

  const onChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(target);
    const { name, value } = target;
    setCredentials({ ...credentials, [name]: value });
  };

  const submit = async () => {
    try {
      await login({ variables: credentials });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="text"
            value={credentials.email}
            onChange={onChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="text"
            value={credentials.password}
            onChange={onChange}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;

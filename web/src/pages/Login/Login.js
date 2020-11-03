import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {Button, Form} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import Cookies from 'js-cookie';
import {FormCustom} from '../../components/FormCustom';
import {LOGIN} from '../../actions/actionTypes';
import {backendHost, createAlert, getUserType} from '../../utils';

const Login = () => {
  const {register, handleSubmit, reset} = useForm();
  const [state, setState] = useState({isLogin: false});
  const dispatch = useDispatch();

  const onSubmit = data => {
    fetch(`${backendHost}/login`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(data),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Not 200');
        }
        return res.json();
      })
      .then(res => {
        const {userType, caretakerType} = getUserType(res.roles);

        Cookies.set('petpals', 'cookie');
        Cookies.set('petpals-userType', userType);
        Cookies.set('petpals-username', data.username);
        Cookies.set('caretaker-type', caretakerType);
        reset();
        dispatch({
          type: LOGIN,
          payload: {
            userId: data.username,
            sessionCookie: 'cookie',
            userType,
          },
        });
        setState({...state, isLogin: true});
      })
      .catch(() => createAlert('Failed to login'));
  };

  if (state.isLogin) {
    return <Redirect to="/" />;
  }

  return (
    <FormCustom onSubmit={handleSubmit(onSubmit)}>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" name="username" ref={register} required />
        <Form.Text className="text-muted">
          Please use a username you have registered with
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          name="password"
          ref={register}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </FormCustom>
  );
};

export default Login;

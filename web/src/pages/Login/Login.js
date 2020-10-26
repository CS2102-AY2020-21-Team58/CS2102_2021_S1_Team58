import React from 'react';
import {useDispatch} from 'react-redux';
import {Button, Form} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import Cookies from 'js-cookie';
import {FormCustom} from '../../components/FormCustom';
import {LOGIN} from '../../actions/actionTypes';

const Login = () => {
  const {register, handleSubmit, reset} = useForm();
  const dispatch = useDispatch();

  const onSubmit = data => {
    // TODO: Update with call to API
    const {email} = data;
    Cookies.set('petpals', 'cookie');
    Cookies.set('petpals-userType', 'Owner');
    Cookies.set('petpals-email', email);
    reset();
    dispatch({
      type: LOGIN,
      payload: {userId: email, sessionCookie: 'cookie', userType: 'Owner'},
    });
  };

  return (
    <FormCustom onSubmit={handleSubmit(onSubmit)}>
      <Form.Group>
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          name="email"
          ref={register}
          required
        />
        <Form.Text className="text-muted">
          Please give a valid email that you have registered with
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

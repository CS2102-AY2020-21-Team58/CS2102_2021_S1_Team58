import React from 'react';
import {useDispatch} from 'react-redux';
import {Button, Form} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import {FormCustom} from '../../components/FormCustom';
import {LOGIN} from '../../actions/actionTypes';

const Register = () => {
  const {register, handleSubmit, reset} = useForm();
  const dispatch = useDispatch();

  const onSubmit = data => {
    // TODO: First we need to register the user with the API, then we need to do the registration
    const {email, userType} = data;
    dispatch({
      type: LOGIN,
      payload: {userId: email, sessionCookie: 'cookie', userType},
    });
    reset();
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
          If you have registered as another type of user, use the same email.
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

      <Form.Group>
        <Form.Label>Select User Type</Form.Label>
        <Form.Control as="select" name="userType" ref={register} required>
          <option>Caretaker</option>
          <option>Owner</option>
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </FormCustom>
  );
};

export default Register;

import React, {useState} from 'react';
import Cookies from 'js-cookie';
import {Redirect} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {Button, Form} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import {FormCustom} from '../../components/FormCustom';
import {LOGIN} from '../../actions/actionTypes';
// eslint-disable-next-line
import {backendHost, createAlert, getUserType} from '../../utils';

/* eslint-disable fp/no-mutating-methods */
const parseUserType = userType => {
  const results = [];
  if (
    userType.indexOf('Full-Timer') !== -1 &&
    userType.indexOf('Part-Timer') !== -1
  ) {
    results.push('Full-Timer');
  }

  if (userType.indexOf('Full-Timer') !== -1) {
    results.push('Full-Timer');
  }
  if (userType.indexOf('Part-Timer') !== -1) {
    results.push('Part-Timer');
  }
  if (userType.indexOf('Owner') !== -1) {
    results.push('Owner');
  }
  if (userType.indexOf('Administrator') !== -1) {
    results.push('Administrator');
  }
  return results;
};
/* eslint-enable */

const Register = () => {
  const {register, handleSubmit, reset} = useForm();
  const [state, setState] = useState({isRegistered: false});
  const dispatch = useDispatch();

  const onSubmit = data => {
    // TODO: First we need to register the user with the API, then we need to do the registration
    const {username, userType, card, location, password, fullname} = data;
    const types = parseUserType(userType);
    const requestData = {
      username,
      types,
      card,
      location,
      password,
      full_name: fullname,
    };
    fetch(`${backendHost}/register`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestData),
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Not 200');
        }
        const {userType: petpalsUsertype, caretakerType} = getUserType(
          userType
        );
        Cookies.set('petpals', 'cookie');
        Cookies.set('petpals-userType', petpalsUsertype);
        Cookies.set('petpals-username', username);
        Cookies.set('caretaker-type', caretakerType);
        dispatch({
          type: LOGIN,
          payload: {userId: username, sessionCookie: 'cookie', userType},
        });
        setState({...state, isRegistered: true});
        reset();
      })
      .catch(() => {
        createAlert('Failed to Register');
      });
  };

  if (state.isRegistered) {
    return <Redirect to="/" />;
  }

  return (
    <FormCustom onSubmit={handleSubmit(onSubmit)}>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter Username"
          name="username"
          ref={register}
          required
        />
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
        <Form.Label>Full Name</Form.Label>
        <Form.Control type="text" name="fullname" ref={register} required />
      </Form.Group>

      <Form.Group>
        <Form.Label>Card Number</Form.Label>
        <Form.Control type="text" name="card" ref={register} required />
      </Form.Group>

      <Form.Group>
        <Form.Label>User Type</Form.Label>
        <Form.Control
          as="select"
          name="userType"
          ref={register}
          required
          multiple>
          <option>Administrator</option>
          <option>Full-Timer</option>
          <option>Part-Timer</option>
          <option>Owner</option>
        </Form.Control>
        <Form.Text className="text-muted">
          Note that you can only be either one of full-timer or part-timer. If
          you choose both, you default to full-timer.
        </Form.Text>
      </Form.Group>

      <Form.Group>
        <Form.Label>Location</Form.Label>
        <Form.Control as="select" name="location" ref={register} required>
          <option>North</option>
          <option>South</option>
          <option>East</option>
          <option>West</option>
        </Form.Control>
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </FormCustom>
  );
};

export default Register;

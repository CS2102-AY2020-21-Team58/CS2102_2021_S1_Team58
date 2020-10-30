import React, {useState, useEffect} from 'react';
import {Button, Form} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import Cookies from 'js-cookie';
import Table from '../../components/Table';
import {FormCustom} from '../../components/FormCustom';
import {allPetTypes, allPetServices, backendHost} from '../../utils';
// eslint-disable-next-line
import style from './Leaves.module.css';

const Leaves = () => {
  const todayDate = new Date().toISOString().slice(0, 10);
  const {register, handleSubmit, reset} = useForm();
  const [state, setState] = useState({
    leavesData: {data: [], columns: []},
    availability: {data: [], columns: []},
    form: {start: todayDate, end: todayDate},
    supported: {'Big Dog': ['Walk']},
    currentPetInFocus: '',
  });

  const leaves = [
    {start: '2020-10-12', end: '2020-10-13'},
    {start: '2020-11-20', end: '2020-12-30'},
  ];

  const leavesColumns = [
    {Header: 'Start', accessor: 'start'},
    {Header: 'End', accessor: 'end'},
  ];

  const caretakerType = Cookies.get('caretaker-type');
  const userType = Cookies.get('petpals-userType');
  const isFullTimer =
    caretakerType === 'fulltime' || userType === 'Administrator';
  const unsupportedPetTypes = allPetTypes.filter(
    type =>
      !Object.keys(state.supported).includes(type) ||
      state.supported[type].length !== 2
  );

  const getServices = () => {
    const curr = state.currentPetInFocus;
    if (Object.keys(state.supported).includes(curr)) {
      return allPetServices.filter(
        service => !state.supported[state.currentPetInFocus].includes(service)
      );
    }

    return allPetServices;
  };

  useEffect(() => {
    setState({
      ...state,
      leavesData: {data: leaves, columns: leavesColumns},
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {isFullTimer ? <h3>Upcoming Leaves</h3> : <h3>Upcoming Availability</h3>}
      <Table data={state.leavesData.data} columns={state.leavesData.columns} />
      {isFullTimer ? <h3>Apply Leave</h3> : <h3>Add Availability</h3>}
      <div>
        <span>
          Start:
          <input
            type="date"
            id="form-start"
            name="form-start"
            value={state.form.start}
            onChange={event =>
              setState({
                ...state,
                form: {...state.form, start: event.target.value},
              })
            }
          />
        </span>
        <br />
        <span>
          End:
          <input
            type="date"
            id="form-end"
            name="form-end"
            value={state.form.end}
            onChange={event =>
              setState({
                ...state,
                form: {...state.form, end: event.target.value},
              })
            }
          />
        </span>
      </div>
      <h3 className={style.pet_types}>Pet Types and Services Supported</h3>
      {Object.entries(state.supported)
        .map(([pet, petServices]) => `${pet}: ${petServices.join(',')}`)
        .join('\n')}
      {Object.keys(state.supported).length !== 4 ||
      Object.values(state.supported).reduce((x, y) => x + y.length, 0) !== 8 ? (
        <div className={style.pet_types}>
          <h5>Add New Pets and Service to Support</h5>
          <FormCustom onSubmit={handleSubmit(() => {})}>
            <Form.Group>
              <Form.Label>Pet Type</Form.Label>
              <Form.Control
                as="select"
                name="pet"
                ref={register}
                required
                onChange={event => {
                  setState({...state, currentPetInFocus: event.target.value});
                }}
                value={state.currentPetInFocus}>
                {unsupportedPetTypes.map((item, key) => (
                  <option value={item} key={key}>
                    {item}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Service</Form.Label>
              <Form.Control as="select" name="service" ref={register} required>
                {getServices().map((service, key) => (
                  <option value={service} key={key}>
                    {service}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </FormCustom>
        </div>
      ) : null}
    </div>
  );
};

export default Leaves;

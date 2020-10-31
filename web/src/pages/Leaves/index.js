import React, {useState, useEffect} from 'react';
import {Button, Form} from 'react-bootstrap';
import moment from 'moment';
import 'moment-timezone';
import {useForm} from 'react-hook-form';
import Cookies from 'js-cookie';
import Table from '../../components/Table';
import {FormCustom} from '../../components/FormCustom';
import {
  allPetTypes,
  allPetServices,
  backendHost,
  fetchStatusHandler,
  createAlert,
  generateStartEnd,
} from '../../utils';
// eslint-disable-next-line
import style from './Leaves.module.css';

const Leaves = () => {
  const todayDate = moment().tz('Asia/Singapore').format('YYYY-MM-DD');
  const maxDate = generateStartEnd(todayDate).end;
  const {register, handleSubmit} = useForm();
  const [state, setState] = useState({
    leavesData: {data: [], columns: []},
    availability: {data: [], columns: []},
    form: {start: todayDate, end: todayDate},
    supported: {},
    currentPetInFocus: '',
  });

  const leavesColumns = [
    {Header: 'Start', accessor: 'start'},
    {Header: 'End', accessor: 'end'},
  ];

  const caretakerType = Cookies.get('caretaker-type');
  const userType = Cookies.get('petpals-userType');
  const isFullTimer = caretakerType === 'fulltime';
  const unsupportedPetTypes = obj =>
    allPetTypes.filter(
      type => !Object.keys(obj).includes(type) || obj[type].length !== 2
    );

  const submitLeave = async () => {
    const {start, end} = state.form;
    const username = Cookies.get('petpals-username');

    if (new Date(Date.parse(start)) > new Date(Date.parse(end))) {
      createAlert('Start date cannot be greater than end date');
      return;
    }

    try {
      await fetch(`${backendHost}/leaves_availability/${username}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          start_period: start,
          end_period: end,
          user: username,
        }),
      }).then(fetchStatusHandler);
      await fetchData();
    } catch (error) {
      createAlert('Failed to register service');
    }
  };

  const submitNewPet = async data => {
    console.log(data);
    const username = Cookies.get('petpals-username');
    if (data.price !== undefined) {
      try {
        await fetch(`${backendHost}/caretakers/${username}/services`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            price: data.price,
            animal_name: data.pet,
            username,
          }),
        }).then(fetchStatusHandler);
      } catch (error) {
        createAlert('Failed to register animal type');
        return;
      }
    }

    try {
      await fetch(
        `${backendHost}/caretakers/${username}/services/${data.pet}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            animal_name: data.pet,
            service: data.service,
            username,
          }),
        }
      ).then(fetchStatusHandler);
    } catch (error) {
      createAlert('Failed to register service');
    } finally {
      await fetchData();
    }
  };

  const getServices = () => {
    const curr = state.currentPetInFocus;
    if (Object.keys(state.supported).includes(curr)) {
      return allPetServices.filter(
        service => !state.supported[state.currentPetInFocus].includes(service)
      );
    }

    return allPetServices;
  };

  const fetchData = async () => {
    const username = Cookies.get('petpals-username');
    const animalsMap = {};

    // First try to get animals related data
    try {
      const animalsData = await fetch(
        `${backendHost}/caretakers/${username}/services`
      )
        .then(fetchStatusHandler)
        .then(res => res.json());
      const promises = [];
      for (const animal of animalsData.results) {
        // eslint-disable-next-line
        const animalServicesRes = fetch(
          `${backendHost}/caretakers/${username}/services/${animal.animal_name}`
        )
          .then(fetchStatusHandler)
          .then(res => res.json());
        // eslint-disable-next-line
        promises.push(animalServicesRes);
      }
      const animalServicesData = await Promise.all(promises);
      // eslint-disable-next-line
      for (let i = 0; i < animalsData.results.length; i += 1) {
        // eslint-disable-next-line
        animalsMap[animalsData.results[i].animal_name] = animalServicesData[
          i
        ].results.map(result => result.service_name);
      }
    } catch (error) {
      createAlert('Failed to fetch data');
    }

    let leaves = [];

    // Then try to fetch the leaves data
    try {
      const leavesRes = await fetch(
        `${backendHost}/leaves_availability/${username}`
      )
        .then(fetchStatusHandler)
        .then(res => res.json());
      // eslint-disable-next-line
      leaves = leavesRes.results.map(result => ({
        start: moment(result.start_period)
          .tz('Asia/Singapore')
          .format('YYYY-MM-DD'),
        end: moment(result.end_period)
          .tz('Asia/Singapore')
          .format('YYYY-MM-DD'),
      }));
    } catch (error) {
      createAlert('Failed to fetch leaves data');
    }

    setState({
      ...state,
      supported: animalsMap,
      leavesData: {columns: leavesColumns, data: leaves},
      currentPetInFocus:
        unsupportedPetTypes(animalsMap).length === 0
          ? ''
          : unsupportedPetTypes(animalsMap)[0],
    });
  };

  useEffect(() => {
    fetchData();
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
            min={todayDate}
            max={maxDate}
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
            min={state.form.start}
            max={maxDate}
            onChange={event => {
              setState({
                ...state,
                form: {...state.form, end: event.target.value},
              });
            }}
          />
        </span>
      </div>
      <Button
        variant="primary"
        onClick={submitLeave}
        className={style.leaves_button}>
        {isFullTimer ? 'Submit Leaves' : 'Submit Availability'}
      </Button>
      <h3 className={style.pet_types}>Pet Types and Services Supported</h3>
      {Object.entries(state.supported)
        .map(([pet, petServices]) => `${pet}: ${petServices.join(',')}`)
        .join('\n')}
      {Object.keys(state.supported).length !== 4 ||
      Object.values(state.supported).reduce((x, y) => x + y.length, 0) !== 8 ? (
        <div className={style.pet_types}>
          <h5>Add New Pets and Service to Support</h5>
          <FormCustom onSubmit={handleSubmit(submitNewPet)}>
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
                {unsupportedPetTypes(state.supported).map((item, key) => (
                  // eslint-disable-next-line
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
                  // eslint-disable-next-line
                  <option value={service} key={key}>
                    {service}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            {!Object.keys(state.supported).includes(state.currentPetInFocus) ? (
              <Form.Group>
                <Form.Label>Pet Base Price</Form.Label>
                <Form.Control
                  type="text"
                  name="price"
                  // Cheap hack - may not cover all cases
                  ref={register({validate: value => !isNaN(value)})}
                  required
                />
              </Form.Group>
            ) : null}{' '}
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

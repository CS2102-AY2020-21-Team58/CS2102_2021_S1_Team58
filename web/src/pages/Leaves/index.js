import React, {useState, useEffect} from 'react';
import {Button, Form, Tabs, Tab} from 'react-bootstrap';
import moment from 'moment';
import 'moment-timezone';
import {useForm} from 'react-hook-form';
import Cookies from 'js-cookie';
import Table from '../../components/Table';
import {FormCustom} from '../../components/FormCustom';
import InfoBox from '../../components/InfoBox';
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
  const {register, handleSubmit, reset} = useForm();
  const [state, setState] = useState({
    leavesData: {data: [], columns: []},
    availability: {data: [], columns: []},
    form: {start: todayDate, end: todayDate},
    supported: {},
    currentPetInFocus: '',
    currentPetToDelete: '',
    noOfPetDays: 0,
    salaryThisMonth: 0,
  });

  const caretakerType = Cookies.get('caretaker-type');
  const isFullTimer = caretakerType === 'fulltime';

  const leavesColumns = [
    {Header: 'Start', accessor: 'start'},
    {Header: 'End', accessor: 'end'},
    {
      Header: isFullTimer ? 'Cancel Leave' : 'Cancel Availability',
      id: 'cancel',
      // eslint-disable-next-line
      Cell: ({row}) => (
        // eslint-disable-next-line
        <Button onClick={cancelLeaveAvailability(row.values)} variant="danger">
          Cancel
        </Button>
      ),
    },
  ];

  const unsupportedPetTypes = obj =>
    allPetTypes.filter(
      type =>
        !Object.keys(obj).includes(type) ||
        obj[type].length !== allPetServices.length
    );

  const cancelLeaveAvailability = values => async () => {
    const username = Cookies.get('petpals-username');
    try {
      await fetch(`${backendHost}/caretakers/${username}/leaves_availability`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          start_period: values.start,
          end_period: values.end,
        }),
      }).then(fetchStatusHandler);
      await fetchData();
    } catch (error) {
      createAlert('Failed to delete leave/availability');
    }
  };

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
      createAlert('Failed to Submit leave/availability');
    }
  };

  const submitNewPet = async data => {
    const username = Cookies.get('petpals-username');
    // eslint-disable-next-line
    if (data.price != undefined) {
      try {
        await fetch(`${backendHost}/caretakers/${username}/services`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            price: data.price,
            animal_name: state.currentPetInFocus,
            username,
          }),
        }).then(fetchStatusHandler);
      } catch (error) {
        createAlert(
          'Failed to register animal type. Try setting a higher base price'
        );
        return;
      }
    }

    try {
      await fetch(
        `${backendHost}/caretakers/${username}/services/${state.currentPetInFocus}`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            animal_name: state.currentPetInFocus,
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

  const fetchCaretakerData = async () => {
    const username = Cookies.get('petpals-username');

    let salaryThisMonth = 0;
    try {
      const url = new URL(`${backendHost}/salary/${username}/${todayDate}`);
      // eslint-disable-next-line
      url.search = new URLSearchParams({usertype: caretakerType});
      const salaryResponse = await fetch(url)
        .then(fetchStatusHandler)
        .then(res => res.json());
      // eslint-disable-next-line
      salaryThisMonth =
        salaryResponse.results == undefined ? 0 : salaryResponse.results.salary;
    } catch (error) {
      createAlert('Failed to fetch caretaker salary');
    }

    let noOfPetDays = 0;
    try {
      const petDaysResponse = await fetch(
        `${backendHost}/caretakers/${username}/pet_days/${todayDate}`
      )
        .then(fetchStatusHandler)
        .then(res => res.json());
      // eslint-disable-next-line
      noOfPetDays =
        petDaysResponse.results[0].sum == undefined
          ? 0
          : petDaysResponse.results[0].sum;
    } catch (error) {
      createAlert('Failed to fetch number of pet days worked');
    }

    return {noOfPetDays, salaryThisMonth};
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

    const {noOfPetDays, salaryThisMonth} = await fetchCaretakerData();

    setState({
      ...state,
      supported: animalsMap,
      leavesData: {columns: leavesColumns, data: leaves},
      noOfPetDays,
      salaryThisMonth,
      currentPetInFocus:
        unsupportedPetTypes(animalsMap).length === 0
          ? ''
          : unsupportedPetTypes(animalsMap)[0],
    });
  };

  const deleteService = async data => {
    const {pet, service} = data;
    const username = Cookies.get('petpals-username');
    const servicesLeft = state.supported[pet].filter(
      serviceName => serviceName !== service
    );

    try {
      await fetch(`${backendHost}/caretakers/${username}/services/${pet}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          service,
        }),
      });
    } catch (error) {
      createAlert('Failed to delete service');
      await fetchData();
      reset();
      return;
    }

    if (servicesLeft.length > 0) {
      await fetchData();
      reset();
      return;
    }

    try {
      await fetch(`${backendHost}/caretakers/${username}/services`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          animal_name: pet,
        }),
      });
    } catch (error) {
      createAlert('Failed to delete pet type');
    }

    await fetchData();
    reset();
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const deleteServiceForm = (
    <FormCustom onSubmit={handleSubmit(deleteService)}>
      <Form.Group>
        <Form.Label>Pet Type</Form.Label>
        <Form.Control
          as="select"
          name="pet"
          ref={register}
          required
          onChange={event => {
            setState({
              ...state,
              currentPetToDelete: event.target.value,
            });
          }}
          value={state.currentPetToDelete}>
          <option value="">Select a pet</option>
          {Object.keys(state.supported).map((item, key) => (
            // eslint-disable-next-line
            <option value={item} key={key}>
              {item}
            </option>
          ))}
        </Form.Control>
        <Form.Text className="text-muted">
          If the pet has no more associated services, it is taken as you no
          longer service this pet
        </Form.Text>
      </Form.Group>
      {state.currentPetToDelete !== '' &&
      state.supported[state.currentPetToDelete] !== undefined ? (
        <Form.Group>
          <Form.Label>Service</Form.Label>
          <Form.Control as="select" name="service" ref={register} required>
            {state.supported[state.currentPetToDelete].map((service, key) => (
              // eslint-disable-next-line
              <option value={service} key={key}>
                {service}
              </option>
            ))}
          </Form.Control>
        </Form.Group>
      ) : null}
      <Button
        variant="primary"
        type="submit"
        disabled={state.currentPetToDelete === ''}>
        Submit
      </Button>
    </FormCustom>
  );

  const caretakerData = (
    <>
      <h3>Your Summary</h3>
      <div className={style.summary_box}>
        <InfoBox
          title="Number of Pet Days clocked this month"
          content={state.noOfPetDays}
          subtitle="This is the number of pets you have taken care of in a month"
        />
        <InfoBox
          title="Total Salary earned this month"
          content={`$${state.salaryThisMonth}`}
          subtitle="Salary you are owed for this calendar month"
        />
      </div>
    </>
  );

  return (
    <div className={style.container}>
      <Tabs defaultActiveKey="upcoming" className={style.tab_bar}>
        <Tab eventKey="upcoming" title="Upcoming">
          {isFullTimer ? (
            <h3>Upcoming Leaves</h3>
          ) : (
            <h3>Upcoming Availability</h3>
          )}
          <Table
            data={state.leavesData.data}
            columns={state.leavesData.columns}
          />
        </Tab>
        <Tab
          eventKey="add"
          title={isFullTimer ? 'Add Leave' : 'Add Availability'}>
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
            <span className={style.end_date}>
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
        </Tab>
        <Tab eventKey="services" title="Add Services">
          <h5 className={style.pet_types}>Pet Types and Services Supported</h5>
          {Object.entries(state.supported)
            .map(([pet, petServices]) => `${pet}: ${petServices.join(', ')}`)
            .join('; ')}
          {Object.keys(state.supported).length !== 4 ||
          Object.values(state.supported).reduce((x, y) => x + y.length, 0) !==
            16 ? (
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
                      setState({
                        ...state,
                        currentPetInFocus: event.target.value,
                      });
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
                  <Form.Control
                    as="select"
                    name="service"
                    ref={register}
                    required>
                    {getServices().map((service, key) => (
                      // eslint-disable-next-line
                      <option value={service} key={key}>
                        {service}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                {!Object.keys(state.supported).includes(
                  state.currentPetInFocus
                ) ? (
                  <Form.Group>
                    <Form.Label>Pet Base Price</Form.Label>
                    <Form.Control
                      type="text"
                      name="price"
                      // Cheap hack - may not cover all cases
                      ref={register({validate: value => !isNaN(value)})}
                      required
                    />
                    <Form.Text className="text-muted">
                      Note that if you want to edit the base price later, you
                      will have to delete all the services associated with it
                      and then add it again. Try to set a value you will not
                      regret.
                    </Form.Text>
                  </Form.Group>
                ) : null}{' '}
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </FormCustom>
            </div>
          ) : null}
        </Tab>
        {Object.keys(state.supported).length > 0 ? (
          <Tab eventKey="delete" title="Delete Service">
            {deleteServiceForm}
          </Tab>
        ) : null}
        <Tab eventKey="data" title="Summary">
          {caretakerData}
        </Tab>
      </Tabs>
    </div>
  );
};

export default Leaves;

import React, {useState, useEffect} from 'react';
import {Button, Form, Tabs, Tab} from 'react-bootstrap';
import Cookies from 'js-cookie';
import {useForm} from 'react-hook-form';
import {FormCustom} from '../../components/FormCustom';
import Table from '../../components/Table';
import style from './Pets.module.css';
import {
  backendHost,
  fetchStatusHandler,
  createAlert,
  allPetServices,
  allPetTypes,
} from '../../utils';

const PetsPage = () => {
  const [state, setState] = useState({
    petsData: {data: [], columns: []},
  });

  const {register, handleSubmit, reset} = useForm();
  const petsColumns = [
    {Header: 'Pet Name', accessor: 'pet_name'},
    {Header: 'Pet Type', accessor: 'type'},
  ];

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  const fetchData = async () => {
    const username = Cookies.get('petpals-username');
    let pets = [];

    try {
      const petsResponse = await fetch(`${backendHost}/owner/${username}/pets`)
        .then(fetchStatusHandler)
        .then(res => res.json());
      // eslint-disable-next-line
      pets = petsResponse.results;
    } catch (error) {
      createAlert('Failed to fetch pets');
    }

    setState({...state, petsData: {data: pets, columns: petsColumns}});
  };

  const submitPet = async data => {
    const owner = Cookies.get('petpals-username');

    try {
      await fetch(`${backendHost}/owner/${owner}/pet`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({pet_name: data.petName, type: data.type}),
      }).then(fetchStatusHandler);
    } catch (error) {
      createAlert('Failed to create pet');
      return;
    }

    try {
      await fetch(`${backendHost}/owner/${owner}/pets/services`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({pet_name: data.petName, services: data.services}),
      }).then(fetchStatusHandler);
      await fetchData();
    } catch (error) {
      createAlert(
        'Failed to add pet services to pet. Use the edit function to try again'
      );
    }
    reset();
  };

  return (
    <div className={style.container}>
      <Tabs defaultActiveKey="pets" className={style.tab_bar}>
        <Tab eventKey="pets" title="Your Pets">
          <h3>Current Pets</h3>
          <Table data={state.petsData.data} columns={state.petsData.columns} />
        </Tab>
        <Tab eventKey="submit" title="Add a Pet">
          <h3>Add a pet</h3>
          <FormCustom onSubmit={handleSubmit(submitPet)}>
            <Form.Group>
              <Form.Label>Pet Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Pet Name here"
                name="petName"
                ref={register}
                required
              />
              <Form.Text className="text-muted">
                Pet Names cannot repeat. After all, why would they?
              </Form.Text>
            </Form.Group>

            <Form.Group>
              <Form.Label>Select Pet Type</Form.Label>
              <Form.Control as="select" name="type" ref={register} required>
                {allPetTypes.map((type, key) => (
                  // eslint-disable-next-line
                  <option value={type} key={key}>
                    {type}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Select Services Required</Form.Label>
              <Form.Control
                as="select"
                name="services"
                ref={register}
                multiple
                required>
                {allPetServices.map((service, key) => (
                  // eslint-disable-next-line
                  <option value={service} key={key}>
                    {service}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className={style.submit_button}>
              Submit
            </Button>
          </FormCustom>
        </Tab>
      </Tabs>
    </div>
  );
};

export default PetsPage;

import React, {useState, useEffect} from 'react';
import {Button, Form} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import {FormCustom} from '../../components/FormCustom';
import Table from '../../components/Table';
import style from './Pets.module.css';

const PetsPage = () => {
  const [state, setState] = useState({
    petsData: [],
    petsColumn: [],
  });

  const {register, handleSubmit, reset} = useForm();

  useEffect(() => {
    setState({
      ...state,
      petsData: [
        {username: 'blah', name: 'golden', type: 'dog'},
        {username: 'fdjvn', name: 'fdjnf', type: 'bat'},
      ],
      petsColumn: [
        {Header: 'Owner Name', accessor: 'username'},
        {Header: 'Pet Name', accessor: 'name'},
        {Header: 'Pet Type', accessor: 'type'},
      ],
    });
  }, [state]);

  return (
    <div>
      <h3>Current Pets</h3>
      {state.petsData.length === 0 ? (
        <p>You have no pets currently.</p>
      ) : (
        <Table data={state.petsData} columns={state.petsColumn} />
      )}
      <h3>Add a pet</h3>
      <FormCustom
        onSubmit={handleSubmit(() => {
          reset();
        })}>
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
          <Form.Control as="select" name="userType" ref={register} required>
            <option>Dog</option>
            <option>Rat</option>
          </Form.Control>
          <Button
            variant="primary"
            type="submit"
            className={style.submit_button}>
            Submit
          </Button>
        </Form.Group>
      </FormCustom>
    </div>
  );
};

export default PetsPage;

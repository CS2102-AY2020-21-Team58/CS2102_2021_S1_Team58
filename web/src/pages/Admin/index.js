import React, {useEffect, useState} from 'react';
import {Button, Form, Tabs, Tab} from 'react-bootstrap';
import {useForm} from 'react-hook-form';
import moment from 'moment';
import 'moment-timezone';
import {createAlert, backendHost, fetchStatusHandler} from '../../utils';
import InfoBox from '../../components/InfoBox';
import Table from '../../components/Table';
import {FormCustom} from '../../components/FormCustom';
import style from './Admin.module.css';

const AdminPage = () => {
  const [state, setState] = useState({
    noOfPetsCared: 0,
    totalSalary: 0,
    salaryData: {data: [], columns: []},
    maxMonth: 0,
    profit: 0,
    baseRates: [],
    basePrice: 0,
    currentPetInFocus: '',
  });
  const {register, handleSubmit, reset} = useForm();

  const salaryColumns = [
    {Header: 'Caretaker', accessor: 'cusername'},
    {Header: 'Salary Owed', accessor: 'salary'},
  ];

  const fetchMaxMonth = async () => {
    try {
      const maxMonthResponse = await fetch(`${backendHost}/monthmaxjobs`)
        .then(fetchStatusHandler)
        .then(res => res.json());
      return maxMonthResponse.results[0].month;
    } catch (error) {
      createAlert('Failed to fetch max month');
      return null;
    }
  };

  const fetchProfitMonth = async todayDate => {
    try {
      const profitResponse = await fetch(`${backendHost}/profit/${todayDate}`)
        .then(fetchStatusHandler)
        .then(res => res.json());
      return profitResponse.results.profit;
    } catch (error) {
      createAlert('Failed to fetch profit');
      return null;
    }
  };

  const fetchBaseRates = async () => {
    try {
      const ratesResponse = await fetch(`${backendHost}/baserates`)
        .then(fetchStatusHandler)
        .then(res => res.json());
      return ratesResponse.results;
    } catch (error) {
      createAlert('Failed to fetch base rates');
      return null;
    }
  };

  const fetchData = async () => {
    const todayDate = moment().format('YYYY-MM-DD');
    let totalSalary = 0;

    try {
      const salaryResponse = await fetch(
        `${backendHost}/salary_total/${todayDate}`
      )
        .then(fetchStatusHandler)
        .then(res => res.json());
      // eslint-disable-next-line
      totalSalary = salaryResponse.total_salary;
    } catch (error) {
      createAlert('Failed to fetch totalSalary');
    }

    let noOfPetsCared = 0;
    try {
      const todayMonth = moment().format('MM');
      const url = new URL(`${backendHost}/pets/month`);
      // eslint-disable-next-line
      url.search = new URLSearchParams({month: todayMonth});
      const petTakenCareResponse = await fetch(url)
        .then(fetchStatusHandler)
        .then(res => res.json());
      // eslint-disable-next-line
      noOfPetsCared = petTakenCareResponse.results[0].count;
    } catch (error) {
      createAlert('Failed to get number of pets');
    }

    const caretakerSalaries = await fetchAllCaretakerSalaries();
    const maxMonth = await fetchMaxMonth();
    const profit = await fetchProfitMonth(todayDate);
    const baseRates = await fetchBaseRates();

    setState({
      ...state,
      noOfPetsCared,
      totalSalary,
      salaryData: {data: caretakerSalaries, columns: salaryColumns},
      maxMonth,
      profit,
      baseRates,
    });
  };

  const fetchAllCaretakerSalaries = async () => {
    const todayDate = moment().tz('Asia/Singapore').format('YYYY-MM-DD');
    let caretakerSalaries = [];
    try {
      const allSalariesResponse = await fetch(
        `${backendHost}/salary_list/${todayDate}`
      )
        .then(fetchStatusHandler)
        .then(res => res.json());
      // eslint-disable-next-line
      caretakerSalaries = allSalariesResponse.results;
    } catch (error) {
      createAlert('Failed to get all caretaker salaries');
    }

    return caretakerSalaries;
  };

  const submitRateForm = async () => {
    try {
      await fetch(
        `${backendHost}/baserates/${state.currentPetInFocus}/${state.basePrice}`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
        }
      ).then(fetchStatusHandler);
      await fetchData();
      reset();
    } catch (error) {
      createAlert(
        'Failed to register change base rate. Perhaps it was too High'
      );
    }
  };

  const baseRateForm = (
    <FormCustom onSubmit={handleSubmit(submitRateForm)}>
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
              basePrice: state.baseRates.filter(
                r => r.animal_name === event.target.value
              )[0].base_price,
            });
          }}
          value={state.currentPetInFocus}>
          <option value="">Select a pet</option>
          {state.baseRates.map((item, key) => (
            // eslint-disable-next-line
            <option value={item.animal_name} key={key}>
              {item.animal_name}
            </option>
          ))}
        </Form.Control>
      </Form.Group>
      {state.currentPetInFocus !== '' ? (
        <Form.Group>
          <Form.Label>Pet Base Price</Form.Label>
          <Form.Control
            type="text"
            name="price"
            // Cheap hack - may not cover all cases
            ref={register({validate: value => !isNaN(value)})}
            value={state.basePrice}
            onChange={event =>
              setState({...state, basePrice: event.target.value})
            }
            required
          />
        </Form.Group>
      ) : null}
      <Button
        variant="primary"
        type="submit"
        disabled={state.currentPetInFocus === ''}>
        Submit
      </Button>
    </FormCustom>
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={style.admin_page}>
      <Tabs defaultActiveKey="summary" className={style.tab_bar}>
        <Tab eventKey="summary" title="Summary">
          <h3>Pet-Pals Administrator Summary for this month</h3>
          <div className={style.summary_box}>
            <div className={style.info_row}>
              <InfoBox
                title="Number of pets cared this month"
                content={state.noOfPetsCared}
              />
              <InfoBox
                title="Total Salary owed to Caretakers this month"
                content={`$${state.totalSalary}`}
              />
            </div>
            <div className={style.info_row}>
              <InfoBox
                title="Profits this month"
                // eslint-disable-next-line
                content={`${state.profit ? state.profit : 0} SGD`}
              />
              <InfoBox
                title="Month with most jobs"
                content={
                  state.maxMonth
                    ? moment()
                        .month(state.maxMonth - 1)
                        .format('MMMM')
                    : 'N/A'
                }
              />
            </div>
          </div>
        </Tab>
        <Tab eventKey="salaries" title="Caretaker Salaries">
          <h5>Caretaker Salaries for this month</h5>
          <Table
            data={state.salaryData.data}
            columns={state.salaryData.columns}
          />
        </Tab>
        <Tab eventKey="rate" title="Edit Base Rates">
          {baseRateForm}
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminPage;

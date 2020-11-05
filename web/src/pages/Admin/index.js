import React, {useEffect, useState} from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import moment from 'moment';
import 'moment-timezone';
import {createAlert, backendHost, fetchStatusHandler} from '../../utils';
import InfoBox from '../../components/InfoBox';
import Table from '../../components/Table';
import style from './Admin.module.css';

const AdminPage = () => {
  const [state, setState] = useState({
    noOfPetsCared: 0,
    totalSalary: 0,
    salaryData: {data: [], columns: []},
  });

  const salaryColumns = [
    {Header: 'Caretaker', accessor: 'cusername'},
    {Header: 'Salary Owed', accessor: 'salary'},
  ];

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

    setState({
      ...state,
      noOfPetsCared,
      totalSalary,
      salaryData: {data: caretakerSalaries, columns: salaryColumns},
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
            <InfoBox
              title="Number of pets cared this month"
              content={state.noOfPetsCared}
            />
            <InfoBox
              title="Total Salary owed to Caretakers this month"
              content={`$${state.totalSalary}`}
            />
          </div>
        </Tab>
        <Tab eventKey="salaries" title="Caretaker Salaries">
          <h5>Caretaker Salaries for this month</h5>
          <Table
            data={state.salaryData.data}
            columns={state.salaryData.columns}
          />
        </Tab>
      </Tabs>
    </div>
  );
};

export default AdminPage;

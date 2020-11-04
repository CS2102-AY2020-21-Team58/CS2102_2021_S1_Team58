import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment-timezone';
import {createAlert, backendHost, fetchStatusHandler} from '../../utils';
import InfoBox from '../../components/InfoBox';
import style from './Admin.module.css';

const AdminPage = () => {
  const [state, setState] = useState({
    noOfPetsCared: 0,
    totalSalary: 0,
  });

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

    setState({...state, noOfPetsCared, totalSalary});
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={style.admin_page}>
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
    </div>
  );
};

export default AdminPage;

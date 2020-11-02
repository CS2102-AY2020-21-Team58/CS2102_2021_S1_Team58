import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment-timezone';
import {createAlert, backendHost, fetchStatusHandler} from '../../utils';
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
    <div>
      <h4 className={style.section_title}>Number of Pets Cared this month </h4>
      <div className={style.section_value}>{state.noOfPetsCared}</div>
      <h4 className={style.section_title}>Total Salary Owed this month </h4>
      <div className={style.section_value}>$ {state.totalSalary}</div>
    </div>
  );
};

export default AdminPage;

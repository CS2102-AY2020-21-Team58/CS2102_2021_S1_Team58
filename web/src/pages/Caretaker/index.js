import React, {useEffect, useState} from 'react';
import moment from 'moment';
import 'moment-timezone';
import Cookies from 'js-cookie';
import {createAlert, backendHost, fetchStatusHandler} from '../../utils';
import style from './Caretaker.module.css';

const CaretakerPage = () => {
  const [state, setState] = useState({
    noOfPetDays: 0,
    salaryThisMonth: 0,
  });

  const fetchData = async () => {
    const todayDate = moment().format('YYYY-MM-DD');
    const username = Cookies.get('petpals-username');
    const caretakerType = Cookies.get('caretaker-type');

    let salaryThisMonth = 0;
    try {
      const url = new URL(`${backendHost}/salary/${username}/${todayDate}`);
      // eslint-disable-next-line
      url.search = new URLSearchParams({usertype: caretakerType});
      const salaryResponse = await fetch(url)
        .then(fetchStatusHandler)
        .then(res => res.json());
      // eslint-disable-next-line
      salaryThisMonth = salaryResponse.results.salary;
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
      noOfPetDays = petDaysResponse.results[0].sum;
    } catch (error) {
      createAlert('Failed to fetch number of pet days worked');
    }

    setState({...state, noOfPetDays, salaryThisMonth});
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h4 className={style.section_title}>
        Number of Pets Days clocked this month
      </h4>
      <div className={style.section_value}>{state.noOfPetDays}</div>
      <h4 className={style.section_title}>Total Salary Owed this month </h4>
      <div className={style.section_value}>$ {state.salaryThisMonth}</div>
    </div>
  );
};

export default CaretakerPage;

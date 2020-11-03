import React, {useState, useEffect} from 'react';
import moment from 'moment';
import 'moment-timezone';
import {Button, Tabs, Tab} from 'react-bootstrap';
import Cookies from 'js-cookie';
import Table from '../../components/Table';
import {createAlert, backendHost, fetchStatusHandler} from '../../utils';
import style from './BidsCaretaker.module.css';

const BidsCaretaker = () => {
  const todayDate = moment().tz('Asia/Singapore').format('YYYY-MM-DD');
  const [state, setState] = useState({
    upcoming: {data: [], columns: []},
    pending: {data: [], columns: []},
  });

  const upcomingColumns = [
    {Header: 'Owner', accessor: 'owner'},
    {Header: 'Pet Name', accessor: 'pet_name'},
    {Header: 'Bid Price', accessor: 'bid_rate'},
    {Header: 'Job Date', accessor: 'start_period'},
  ];

  const pendingColumns = [
    {Header: 'Owner', accessor: 'owner'},
    {Header: 'Pet Name', accessor: 'pet_name'},
    {Header: 'Bid Price', accessor: 'bid_rate'},
    {Header: 'Job Date', accessor: 'start_period'},
    {
      Header: 'Action',
      id: 'action',
      // eslint-disable-next-line
      Cell: ({row}) => {
        return (
          <>
            <Button
              variant="success"
              // eslint-disable-next-line
              onClick={() => submitAction('accept', row.values)}>
              Accept
            </Button>
            <Button
              variant="danger"
              // eslint-disable-next-line
              onClick={() => submitAction('decline', row.values)}>
              Decline
            </Button>
          </>
        );
      },
    },
  ];

  const submitAction = async (action, row) => {
    const username = Cookies.get('petpals-username');
    const {owner, pet_name: petName, start_period: date} = row;

    try {
      await fetch(
        `${backendHost}/booking/${owner}/${petName}/${username}/${date}/${date}`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({decision: action === 'accept'}),
        }
      ).then(fetchStatusHandler);
      await fetchData();
    } catch (error) {
      createAlert('Failed to submit action');
    }
  };

  const fetchData = async () => {
    const username = Cookies.get('petpals-username');
    let confirmedBookings = [];
    let pendingBookings = [];

    try {
      const bookingsResponse = await fetch(
        `${backendHost}/booking/caretaker/${username}`
      )
        .then(fetchStatusHandler)
        .then(res => res.json());
      // eslint-disable-next-line
      confirmedBookings = bookingsResponse.results.filter(
        booking => booking.status === 'ACCEPTED'
      );
      confirmedBookings.forEach(booking => {
        // eslint-disable-next-line
        booking.end_period = moment(booking.end_period)
          .tz('Asia/Singapore')
          .format('YYYY-MM-DD');
        // eslint-disable-next-line
        booking.start_period = moment(booking.start_period)
          .tz('Asia/Singapore')
          .format('YYYY-MM-DD');
      });
      // eslint-disable-next-line
      pendingBookings = bookingsResponse.results.filter(
        booking => booking.status === 'PENDING'
      );
      pendingBookings.forEach(booking => {
        // eslint-disable-next-line
        booking.end_period = moment(booking.end_period)
          .tz('Asia/Singapore')
          .format('YYYY-MM-DD');
        // eslint-disable-next-line
        booking.start_period = moment(booking.start_period)
          .tz('Asia/Singapore')
          .format('YYYY-MM-DD');
      });
    } catch (error) {
      createAlert('Could not fetch data');
    }
    const upcomingBookings = confirmedBookings.filter(
      booking => Date.parse(booking.end_period) >= Date.parse(todayDate)
    );
    // eslint-disable-next-line
    pendingBookings = pendingBookings.filter(
      booking => Date.parse(booking.end_period) >= Date.parse(todayDate)
    );

    setState({
      ...state,
      upcoming: {data: upcomingBookings, columns: upcomingColumns},
      pending: {data: pendingBookings, columns: pendingColumns},
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={style.container}>
      <Tabs defaultActiveKey="upcoming" className={style.tab_bar}>
        <Tab eventKey="upcoming" title="Upcoming Bids">
          <h3>Upcoming Jobs</h3>
          <Table columns={state.upcoming.columns} data={state.upcoming.data} />
        </Tab>
        <Tab eventKey="pending" title="Pending Bids">
          <h3>Pending Bids</h3>
          <Table columns={state.pending.columns} data={state.pending.data} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default BidsCaretaker;

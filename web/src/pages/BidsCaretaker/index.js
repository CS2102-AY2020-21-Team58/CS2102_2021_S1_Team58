import React, {useState, useEffect} from 'react';
import moment from 'moment';
import 'moment-timezone';
import {Button} from 'react-bootstrap';
import Cookies from 'js-cookie';
import Table from '../../components/Table';
import {createAlert, backendHost, fetchStatusHandler} from '../../utils';

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
            <Button variant="success" onClick={() => {}}>
              Accept
            </Button>
            <Button variant="danger" onClick={() => {}}>
              Decline
            </Button>
          </>
        );
      },
    },
  ];

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
        booking => booking.status === 'ACCEPTED'
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
    <div>
      <h3>Upcoming Jobs</h3>
      <Table columns={state.upcoming.columns} data={state.upcoming.data} />
      <h3>Pending Bids</h3>
      <Table columns={state.pending.columns} data={state.pending.data} />
    </div>
  );
};

export default BidsCaretaker;

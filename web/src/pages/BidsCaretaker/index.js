import React, {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import Table from '../../components/Table';

const BidsCaretaker = () => {
  const [state, setState] = useState({
    upcoming: {data: [], columns: []},
    pending: {data: [], columns: []},
  });

  const upcomingData = [
    {
      username: 'a',
      pet: 'b',
      price: 1,
      start_date: '2020/10/30',
      end_date: '2020/10/30',
    },
    {
      username: 'c',
      pet: 'd',
      price: 12,
      start_date: '2020/10/31',
      end_date: '2020/10/31',
    },
  ];

  const upcomingColumns = [
    {Header: 'Caretaker', accessor: 'username'},
    {Header: 'Pet Name', accessor: 'pet'},
    {Header: 'Bid Price', accessor: 'price'},
    {Header: 'Start Date', accessor: 'start_date'},
    {Header: 'End Date', accessor: 'end_date'},
  ];

  const pendingColumns = [
    {Header: 'Caretaker', accessor: 'username'},
    {Header: 'Pet Name', accessor: 'pet'},
    {Header: 'Bid Price', accessor: 'price'},
    {Header: 'Start Date', accessor: 'start_date'},
    {Header: 'End Date', accessor: 'end_date'},
    {
      Header: 'Ratings',
      id: 'rating',
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

  const pendingData = [
    {
      username: 'a',
      pet: 'b',
      price: 1,
      start_date: '2020/10/10',
      end_date: '2020/10/12',
    },
    {
      username: 'c',
      pet: 'd',
      price: 12,
      start_date: '2020/10/20',
      end_date: '2020/10/22',
    },
  ];

  useEffect(() => {
    setState({
      upcoming: {data: upcomingData, columns: upcomingColumns},
      pending: {data: pendingData, columns: pendingColumns},
    });
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

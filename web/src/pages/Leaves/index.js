import React, {useState, useEffect} from 'react';
import {Button} from 'react-bootstrap';
import Cookies from 'js-cookie';
import Table from '../../components/Table';

const Leaves = () => {
  const todayDate = new Date().toISOString().slice(0, 10);
  const [state, setState] = useState({
    leavesData: {data: [], columns: []},
    availability: {data: [], columns: []},
    form: {start: todayDate, end: todayDate},
  });

  const leaves = [
    {start: '2020-10-12', end: '2020-10-13'},
    {start: '2020-11-20', end: '2020-12-30'},
  ];

  const leavesColumns = [
    {Header: 'Start', accessor: 'start'},
    {Header: 'End', accessor: 'end'},
  ];

  useEffect(() => {
    setState({
      ...state,
      leavesData: {data: leaves, columns: leavesColumns},
    });
    // eslint-disable-next-line
  }, []);

  const caretakerType = Cookies.get('caretaker-type');
  const userType = Cookies.get('petpals-userType');
  const isFullTimer =
    caretakerType === 'fulltime' || userType === 'Administrator';

  return (
    <div>
      {isFullTimer ? <h3>Upcoming Leaves</h3> : <h3>Upcoming Availability</h3>}
      <Table data={state.leavesData.data} columns={state.leavesData.columns} />
      {isFullTimer ? <h3>Apply Leave</h3> : <h3>Add Availability</h3>}
      <div>
        <span>
          Start:
          <input
            type="date"
            id="form-start"
            name="form-start"
            value={state.form.start}
            onChange={event =>
              setState({
                ...state,
                form: {...state.form, start: event.target.value},
              })
            }
          />
        </span>
        <br />
        <span>
          End:
          <input
            type="date"
            id="form-end"
            name="form-end"
            value={state.form.end}
            onChange={event =>
              setState({
                ...state,
                form: {...state.form, end: event.target.value},
              })
            }
          />
        </span>
      </div>
      <Button variant="primary" onClick={() => {}}>
        Submit
      </Button>
    </div>
  );
};

export default Leaves;

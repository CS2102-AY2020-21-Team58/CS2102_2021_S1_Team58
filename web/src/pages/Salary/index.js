import React, {useEffect, useState} from 'react';
import Table from '../../components/Table';

const SalaryPage = () => {
  const [state, setState] = useState({
    salaryData: {columns: [], data: []},
  });

  const columns = [
    {Header: 'Caretaker', accessor: 'username'},
    {Header: 'Days Worked', accessor: 'worked'},
    {Header: 'Type', accessor: 'type'},
    {Header: 'Money Owed', accessor: 'owed'},
  ];

  const data = [
    {
      username: 'a',
      worked: 20,
      type: 'Part Time',
      owed: 200,
    },
    {
      username: 'b',
      worked: 23,
      type: 'Full Time',
      owed: 400,
    },
  ];

  useEffect(() => {
    setState({
      ...state,
      salaryData: {columns, data},
    });
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h3>Salary Owed</h3>
      <Table data={state.salaryData.data} columns={state.salaryData.columns} />
    </div>
  );
};

export default SalaryPage;

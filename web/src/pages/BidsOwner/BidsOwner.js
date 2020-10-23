import React, {useState} from 'react';
import {Button} from 'react-bootstrap';
import Table from '../../components/Table';
import Modal from '../../components/Modal';

const BidsOwner = () => {
  const [state, setState] = useState({
    modalToShow: '',
    showModal: false,
    reviewModalData: {},
    bidModalData: {},
  });

  const handleModalClose = () =>
    setState({...state, modalToShow: '', showModal: false});

  // Hacky way to store the row data for displaying on the modal
  const bidModalClosure = row => () => {
    console.log(row);
    setState({...state, showModal: true, modalToShow: 'bid'});
  };

  const bidModal = (
    <Modal
      show={state.showModal}
      title="Make a new Bid"
      handleClose={handleModalClose}
    />
  );

  const columns = [
    {Header: 'Caretaker', accessor: 'username'},
    {Header: 'Pet Name', accessor: 'pet'},
    {Header: 'Bid Price', accessor: 'price'},
    {Header: 'Start Date', accessor: 'start_date'},
    {Header: 'End Date', accessor: 'end_date'},
    {
      Header: 'Book',
      id: 'book',
      // eslint-disable-next-line
      Cell: ({row}) => <Button onClick={bidModalClosure(row)}>Book</Button>,
    },
  ];
  const data = [
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
  const parsedData = data.map(row => ({
    ...row,
    start_date: new Date(Date.parse(row.start_date)),
    end_date: new Date(Date.parse(row.end_date)),
  }));

  return (
    <div>
      <p>Your current bids</p>
      <p>Past bids</p>
      <h3>Make new bids</h3>
      <Table columns={columns} data={parsedData} />
    </div>
  );
};

export default BidsOwner;

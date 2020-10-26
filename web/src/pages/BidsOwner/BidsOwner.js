import React, {useState} from 'react';
import {Button, Modal as ModalBS} from 'react-bootstrap';
import Table from '../../components/Table';
import Modal from '../../components/Modal';

const BidsOwner = () => {
  const [state, setState] = useState({
    modalToShow: '',
    showModal: false,
    reviewModalData: {},
    bidModalData: {},
    bidDatePickerData: {},
  });

  const handleModalClose = () =>
    setState({...state, modalToShow: '', showModal: false});

  // Hacky way to store the row data for displaying on the modal
  const bidModalClosure = row => () => {
    setState({
      ...state,
      showModal: true,
      modalToShow: 'bid',
      bidModalData: {...row, booking_date: row.start_date.replaceAll('/', '-')},
    });
  };

  const changeBidDatePickerSelected = event => {
    setState({
      ...state,
      bidModalData: {...state.bidModalData, booking_date: event.target.value},
    });
  };

  const bidModal =
    state.modalToShow === 'bid' ? (
      <Modal
        show={state.showModal}
        title="Make a new Bid"
        handleClose={handleModalClose}>
        <ModalBS.Body>
          <input
            type="date"
            id="bid-start"
            name="bid-start"
            value={state.bidModalData.booking_date}
            min={state.bidModalData.start_date.replaceAll('/', '-')}
            max={state.bidModalData.end_date.replaceAll('/', '-')}
            onChange={changeBidDatePickerSelected}
          />
        </ModalBS.Body>
        <ModalBS.Footer>
          {/* TODO: Make the onClick Button confirm the booking */}
          <Button variant="secondary" onClick={() => {}}>
            Submit
          </Button>
        </ModalBS.Footer>
      </Modal>
    ) : null;

  const columns = [
    {Header: 'Caretaker', accessor: 'username'},
    {Header: 'Pet Name', accessor: 'pet'},
    {Header: 'Bid Price', accessor: 'price'},
    {Header: 'Start Date', accessor: 'start_date'},
    {Header: 'End Date', accessor: 'end_date'},
    {
      Header: () => null,
      id: 'book',
      // eslint-disable-next-line
      Cell: ({row}) => (
        // eslint-disable-next-line
        <Button onClick={bidModalClosure(row.values)}>Book</Button>
      ),
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

  return (
    <div>
      <p>Your current bids</p>
      <p>Past bids</p>
      <h3>Make new bids</h3>
      <Table columns={columns} data={data} />
      {bidModal}
    </div>
  );
};

export default BidsOwner;

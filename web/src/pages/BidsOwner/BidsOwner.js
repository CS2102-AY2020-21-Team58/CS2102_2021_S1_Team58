import React, {useState} from 'react';
import {Button, Modal as ModalBS} from 'react-bootstrap';
import Table from '../../components/Table';
import Modal from '../../components/Modal';

const BidsOwner = () => {
  // Dummy Data
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

  const pastColumns = [
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
        // eslint-disable-next-line
        return row.original.rating !== undefined ? (
          // eslint-disable-next-line
          <p>{row.original.rating}/5</p>
        ) : (
          // eslint-disable-next-line
          <Button onClick={ratingsModalClosure(row.values)}>Review</Button>
        );
      },
    },
  ];

  const pastData = [
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
      rating: 4,
    },
  ];

  const [state, setState] = useState({
    modalToShow: '',
    showModal: false,
    reviewModalData: {},
    bidModalData: {},
    bidDatePickerData: {},
    newBidsTable: {columns, data},
    pastBidsTable: {columns: pastColumns, data: pastData},
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

  const ratingsModalClosure = row => () => {
    setState({
      ...state,
      showModal: true,
      modalToShow: 'review',
      reviewModalData: {...row},
    });
  };

  const changeBidDatePickerSelected = event => {
    setState({
      ...state,
      bidModalData: {...state.bidModalData, booking_date: event.target.value},
    });
  };

  const changeRatings = event => {
    setState({
      ...state,
      reviewModalData: {...reviewModalData, rating: event.target.value},
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

  const reviewModalData =
    state.modalToShow === 'review' ? (
      <Modal
        show={state.showModal}
        title="Leave a Review for this service"
        handleClose={handleModalClose}>
        <ModalBS.Body>
          <select name="review" onChange={changeRatings}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </ModalBS.Body>
        <ModalBS.Footer>
          {/* TODO: Make the onClick Button confirm the booking */}
          <Button variant="secondary" onClick={() => {}}>
            Submit
          </Button>
        </ModalBS.Footer>
      </Modal>
    ) : null;

  return (
    <div>
      <h3>Your current bids</h3>
      <Table
        columns={state.pastBidsTable.columns}
        data={state.pastBidsTable.data}
      />
      <h3>Past bids</h3>
      <Table columns={[]} data={[]} />
      <h3>Make new bids</h3>
      <Table
        columns={state.newBidsTable.columns}
        data={state.newBidsTable.data}
      />
      {bidModal}
      {reviewModalData}
    </div>
  );
};

export default BidsOwner;

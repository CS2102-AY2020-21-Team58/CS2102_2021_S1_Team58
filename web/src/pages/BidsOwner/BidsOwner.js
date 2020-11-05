import React, {useState, useEffect} from 'react';
import moment from 'moment';
import 'moment-timezone';
import Cookies from 'js-cookie';
import {Button, Modal as ModalBS, Tabs, Tab} from 'react-bootstrap';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import {
  backendHost,
  fetchStatusHandler,
  generateStartEnd,
  createAlert,
} from '../../utils';
import style from './BidsOwner.module.css';

const BidsOwner = () => {
  const todayDate = moment().tz('Asia/Singapore').format('YYYY-MM-DD');
  const maxDate = generateStartEnd(todayDate).end;

  const [state, setState] = useState({
    newBidsTable: {columns: [], data: []},
    upcomingBidsTable: {columns: [], data: []},
    pastBidsTable: {columns: [], data: []},
    showBidsTable: false,
    form: {start: todayDate, end: todayDate, pet: ''},
    pets: [],
  });
  const [modalState, setModalState] = useState({
    modalToShow: '',
    reviewModalData: {},
    bidModalData: {},
    bidDatePickerData: {},
    showModal: false,
  });

  // Dummy Data
  const newBidsColumns = [
    {Header: 'Caretaker', accessor: 'username'},
    {Header: 'Name', accessor: 'first_name'},
    {Header: 'Bid Price', accessor: 'price'},
    {Header: 'Average Rating', accessor: 'rating'},
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

  const pastColumns = [
    {Header: 'Caretaker', accessor: 'caretaker'},
    {Header: 'Pet Name', accessor: 'pet_name'},
    {Header: 'Bid Price', accessor: 'bid_rate'},
    {Header: 'Job Date', accessor: 'start_period'},
    {
      Header: 'Ratings',
      id: 'rating',
      // eslint-disable-next-line
      Cell: ({row}) => {
        // eslint-disable-next-line
        return row.original.rating != undefined ? (
          // eslint-disable-next-line
          <p>{row.original.rating}/5</p>
        ) : (
          // eslint-disable-next-line
          <Button onClick={ratingsModalClosure(row.values)}>Review</Button>
        );
      },
    },
  ];

  const upcomingColumns = [
    {Header: 'Caretaker', accessor: 'caretaker'},
    {Header: 'Pet Name', accessor: 'pet_name'},
    {Header: 'Bid Price', accessor: 'bid_rate'},
    {Header: 'Job Date', accessor: 'start_period'},
  ];

  const handleModalClose = () =>
    setModalState({...modalState, modalToShow: '', showModal: false});

  // Hacky way to store the row data for displaying on the modal
  const bidModalClosure = row => () => {
    setModalState({
      ...modalState,
      showModal: true,
      modalToShow: 'bid',
      bidModalData: row,
    });
  };

  const ratingsModalClosure = row => () => {
    setModalState({
      ...modalState,
      showModal: true,
      modalToShow: 'review',
      reviewModalData: {...row, new_rating: 1},
    });
  };

  const changeBidDatePickerSelected = event => {
    setModalState({
      ...modalState,
      bidModalData: {
        ...modalState.bidModalData,
        booking_date: event.target.value,
      },
    });
  };

  const getAverageRatings = async () => {
    try {
      const ratingsResponse = await fetch(`${backendHost}/ratings`)
        .then(fetchStatusHandler)
        .then(res => res.json());
      const ratingsMap = {};
      ratingsResponse.results.forEach(element => {
        // eslint-disable-next-line
        ratingsMap[element.caretaker] = parseFloat(element.avg).toFixed(2);
      });
      return ratingsMap;
    } catch (error) {
      createAlert('Failed to get average ratings');
      return {};
    }
  };

  const getAvailableCaretakers = async () => {
    const {start, end, pet} = state.form;

    if (new Date(Date.parse(start)) > new Date(Date.parse(end))) {
      createAlert('Start date cannot be greater than end date');
      return;
    }

    if (pet === '') {
      createAlert('Select a pet');
      return;
    }

    const username = Cookies.get('petpals-username');
    let availableCaretakers = [];

    try {
      // eslint-disable-next-line
      availableCaretakers = await fetch(
        `${backendHost}/caretakers/${username}/availability/${start}/${end}/${pet}`
      )
        .then(fetchStatusHandler)
        .then(res => res.json());
    } catch (error) {
      createAlert('Could not get availability');
    }

    const ratingsMap = await getAverageRatings();
    const availableCaretakersWithRating = availableCaretakers.results
      .map(caretaker => ({
        ...caretaker,
        rating:
          ratingsMap[caretaker.username] === undefined
            ? 'Not Available'
            : ratingsMap[caretaker.username],
      }))
      .filter(caretaker => caretaker.username !== username);

    setState({
      ...state,
      newBidsTable: {
        columns: newBidsColumns,
        data: availableCaretakersWithRating,
        bidModalData: {
          start: state.form.start,
          end: state.form.end,
          booking_date: state.form.start,
          delivery: 'Delivery',
          payment: 'Card',
        },
      },
      showBidsTable: true,
    });
  };

  const fetchData = async () => {
    const username = Cookies.get('petpals-username');
    let confirmedBookings = [];

    try {
      const bookingsResponse = await fetch(
        `${backendHost}/booking/owner/${username}`
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
    } catch (error) {
      createAlert('Could not fetch data');
    }

    const pastBookings = confirmedBookings.filter(
      booking => Date.parse(booking.end_period) < Date.parse(todayDate)
    );
    const upcomingBookings = confirmedBookings.filter(
      booking => Date.parse(booking.end_period) >= Date.parse(todayDate)
    );

    let pets = [];
    try {
      const petsResponse = await fetch(`${backendHost}/owner/${username}/pets`)
        .then(fetchStatusHandler)
        .then(res => res.json());
      // eslint-disable-next-line
      pets = [...new Set(petsResponse.results.map(pet => pet.pet_name))];
    } catch (error) {
      createAlert('Failed to fetch pets');
    }

    setState({
      ...state,
      pastBidsTable: {columns: pastColumns, data: pastBookings},
      upcomingBidsTable: {columns: upcomingColumns, data: upcomingBookings},
      pets,
    });
  };

  const submitBooking = async () => {
    const {
      price,
      username: caretaker,
      booking_date: bookingDate,
      delivery,
      payment,
    } = modalState.bidModalData;
    const {pet} = state.form;
    const username = Cookies.get('petpals-username');

    try {
      await fetch(`${backendHost}/booking`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          owner: username,
          pet_name: pet,
          caretaker,
          start_period: bookingDate,
          end_period: bookingDate,
          payment_method: payment,
          delivery_method: delivery,
          bid_rate: price,
        }),
      }).then(fetchStatusHandler);
      await fetchData();
      setModalState({
        ...modalState,
        showModal: false,
        modalToShow: '',
      });
    } catch (error) {
      createAlert('Failed to submit booking');
    }
  };

  const submitRating = async () => {
    const username = Cookies.get('petpals-username');
    const {
      caretaker,
      new_rating: rating,
      pet_name: petName,
      start_period: date,
    } = modalState.reviewModalData;

    // good old web api
    const review = document.querySelector('#review').value;

    try {
      await fetch(
        `${backendHost}/booking/${username}/${petName}/${caretaker}/${date}/${date}`,
        {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({rating, review}),
        }
      ).then(fetchStatusHandler);
      await fetchData();
      setModalState({
        ...modalState,
        showModal: false,
        modalToShow: '',
      });
    } catch (error) {
      createAlert('Failed to submit rating');
    }
  };

  const changeRatings = event => {
    setModalState({
      ...modalState,
      reviewModalData: {
        ...modalState.reviewModalData,
        new_rating: event.target.value,
      },
    });
  };

  const onDeliveryChange = event => {
    setModalState({
      ...modalState,
      bidModalData: {
        ...modalState.bidModalData,
        delivery: event.target.value,
      },
    });
  };

  const onPaymentChange = event => {
    setModalState({
      ...modalState,
      bidModalData: {
        ...modalState.bidModalData,
        payment: event.target.value,
      },
    });
  };

  const bidModal =
    modalState.modalToShow === 'bid' ? (
      <Modal
        show={modalState.showModal}
        title="Make a new Bid"
        handleClose={handleModalClose}>
        <ModalBS.Body>
          <div className={style.bid_entry}>
            <p>Date of job</p>
            <input
              type="date"
              id="bid-start"
              name="bid-start"
              value={modalState.bidModalData.booking_date}
              min={state.form.start}
              max={state.form.end}
              onChange={changeBidDatePickerSelected}
            />
          </div>
          <div className={style.bid_entry}>
            <p>Delivery options</p>
            <select
              value={modalState.bidModalData.delivery}
              onChange={onDeliveryChange}>
              <option value="Delivery">Delivery</option>
              <option value="Transfer">Transfer</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>
          <div className={style.bid_entry}>
            <p>Payment Mode</p>
            <select
              value={modalState.bidModalData.payment}
              onChange={onPaymentChange}>
              <option value="Card">Card</option>
              <option value="Cash">Cash</option>
            </select>
          </div>
        </ModalBS.Body>
        <ModalBS.Footer>
          {/* TODO: Make the onClick Button confirm the booking */}
          <Button variant="primary" onClick={submitBooking}>
            Submit
          </Button>
        </ModalBS.Footer>
      </Modal>
    ) : null;

  const reviewModalData =
    modalState.modalToShow === 'review' ? (
      <Modal
        show={modalState.showModal}
        title="Leave a Review for this service"
        handleClose={handleModalClose}>
        <ModalBS.Body>
          <div className={style.review}>
            <div className={style.bid_entry}>
              <p>Rating</p>
              <select name="review" onChange={changeRatings}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
            <div className={style.bid_entry}>
              <p>Review</p>
              <textarea id="review" />
            </div>
          </div>
        </ModalBS.Body>
        <ModalBS.Footer>
          {/* TODO: Make the onClick Button confirm the booking */}
          <Button variant="primary" onClick={submitRating}>
            Submit
          </Button>
        </ModalBS.Footer>
      </Modal>
    ) : null;

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className={style.container}>
      <Tabs defaultActiveKey="past" className={style.tab_bar}>
        <Tab eventKey="past" title="Past Bids">
          <h3>Past bids</h3>
          <Table
            columns={state.pastBidsTable.columns}
            data={state.pastBidsTable.data}
          />
        </Tab>
        <Tab eventKey="upcoming" title="Upcoming Bids">
          <h3>Upcoming bids</h3>
          <Table
            columns={state.upcomingBidsTable.columns}
            data={state.upcomingBidsTable.data}
          />
        </Tab>
        <Tab eventKey="new" title="New Bids">
          <h3 className={style.margin_12}>Make new bids</h3>
          <div className={style.psuedo_form}>
            <div>
              <span className={style.margin_r12}>
                Start Date:
                <input
                  type="date"
                  id="form-start"
                  name="form-start"
                  value={state.form.start}
                  min={todayDate}
                  max={maxDate}
                  onChange={event =>
                    setState({
                      ...state,
                      form: {...state.form, start: event.target.value},
                    })
                  }
                />
              </span>
              <span>
                End:
                <input
                  type="date"
                  id="form-end"
                  name="form-end"
                  value={state.form.end}
                  min={state.form.start}
                  max={maxDate}
                  onChange={event => {
                    setState({
                      ...state,
                      form: {...state.form, end: event.target.value},
                    });
                  }}
                />
              </span>
            </div>
            <div className={style.margin_8}>
              <span>Pet: </span>
              <select
                name="pet"
                onChange={event => {
                  setState({
                    ...state,
                    form: {...state.form, pet: event.target.value},
                  });
                }}>
                <option value="">Select a pet</option>
                {state.pets.map((type, key) => (
                  <option value={type}>{type}</option>
                ))}
              </select>
            </div>
            <Button
              variant="primary"
              onClick={getAvailableCaretakers}
              className={style.margin_12}
              disabled={state.pets.length === 0}>
              {state.pets.length === 0
                ? 'Add a pet first'
                : 'Search for availability'}
            </Button>
          </div>
          {state.showBidsTable ? (
            <Table
              className={style.margin_12}
              columns={state.newBidsTable.columns}
              data={state.newBidsTable.data}
            />
          ) : null}
        </Tab>
      </Tabs>
      {bidModal}
      {reviewModalData}
    </div>
  );
};

export default BidsOwner;

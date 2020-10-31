import Cookies from 'js-cookie';

export const isCookieSet = () => Cookies.get('petpals') !== undefined;
export const backendHost = process.env.REACT_APP_BACKEND_HOST;
export const allPetTypes = ['Cat', 'Big Dog', 'Dog', 'Lizard'];
export const allPetServices = ['Walk', 'Home Care'];
export const createAlert = message => {
  alert(message);
};

// Code-Gore below
/* eslint-disable fp/no-mutation */
export const getUserType = type => {
  const isBoth =
    (type.indexOf('Part-Timer') !== -1 || type.indexOf('Part-Timer') !== -1) &&
    type.indexOf('Owner') !== -1;
  const isAdmin = type.indexOf('Administrator') !== -1;
  const isPart = type.indexOf('Part-Timer') !== -1;
  const isFull = type.indexOf('Full-Timer') !== -1;
  const isCaretaker = isPart || isFull;
  let userType = '';
  if (isAdmin) {
    userType = 'Administrator';
  } else if (isBoth) {
    userType = 'Both';
  } else if (isCaretaker) {
    userType = 'Caretaker';
  } else {
    userType = 'Owner';
  }

  let caretakerType = '';
  if (isPart) {
    caretakerType = 'parttime';
  } else if (isFull) {
    caretakerType = 'fulltime';
  }

  return {
    userType,
    caretakerType,
  };
};

export function fetchStatusHandler(response) {
  if (response.status === 200) {
    return response;
  }
  throw new Error(response.statusText);
}

export function generateStartEnd(todayDate) {
  const year = parseInt(todayDate.slice(0, 4), 10);
  return {start: todayDate, end: `${year + 1}-12-31`};
}

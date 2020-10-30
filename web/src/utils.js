import Cookies from 'js-cookie';

export const isCookieSet = () => Cookies.get('petpals') !== undefined;
export const backendHost = process.env.REACT_APP_backend_host;
export const createAlert = message => {
  alert(message);
};

import Cookies from 'js-cookie';

export const isCookieSet = () => Cookies.get('petpals') !== undefined;

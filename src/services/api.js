import axios from 'axios';

import { API_URL } from '../constants/api';
import store from '../store';

export const query = async ({
  method = 'GET',
  endpoint = '/',
  data = null,
  headers = {},
  params = {}
}) =>
  await axios({
    method,
    url: API_URL + endpoint,
    data,
    params,
    headers: store.getState().user.isLogged
      ? { ...headers, token: store.getState().user.info.token, 'Content-Type': 'application/json' }
      : headers
  });

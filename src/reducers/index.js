import { combineReducers } from 'redux';

import user from './user';
import bill from './bill';
import store from './store';
import detail from './detail';
import sellHistory from './sellHistory';
import importProduct from './import';
import report from './report';
import app from './app';
import customer from './customer';

export default combineReducers({
  user,
  bill,
  store,
  detail,
  sellHistory,
  importProduct,
  report,
  app,
  customer
});

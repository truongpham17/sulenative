import { query } from '../services/api';
import { ENDPOINTS } from '../constants/api';

export const GET_REPORT_REQUEST = 'get-report-detail';
export const GET_REPORT_SUCCESS = 'get-report-success';
export const GET_REPORT_FAILURE = 'get-report-failure';

export function getReportDetail(data, callback = {}) {
  return async dispatch => {
    try {
      dispatch({ type: GET_REPORT_REQUEST });

      const result = await query({
        endpoint: `${ENDPOINTS.report}?start=${data.start}&end=${data.end}`
      });
      if (result.status === 200) {
        const { billCount, reportByTime, reportByStore, totalSoldMoney } = result.data;
        dispatch({
          type: GET_REPORT_SUCCESS,
          payload: {
            billCount,
            reportByTime,
            reportByStore,
            totalSoldMoney
          }
        });
        if (callback.success) {
          callback.success();
        }
      } else {
        dispatch({ type: GET_REPORT_FAILURE });
        if (callback.failure) {
          callback.failure();
        }
      }
    } catch (err) {
      dispatch({ type: GET_REPORT_FAILURE });
      if (callback.failure) {
        callback.failure();
      }
    }
  };
}

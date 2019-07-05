// import { ENDPOINTS, METHODS } from '../constants/api';
// import { query } from '../services/api';

// export const GET_FRAME_PRICE_REQUEST = 'get-frame-price-request';
// export const GET_FRAME_PRICE_SUCCESS = 'get-frame-price-success';
// export const GET_FRAME_PRICE_FAILURE = 'get-frame-price-failure';

// export function getFramePrices() {
//   return async dispatch => {
//     try{
//       dispatch({
//         type: GET_FRAME_PRICE_REQUEST
//       });
//       const result = await query({
//         endpoint: `${ENDPOINTS.frameprice}`
//       });
//       if(result.status === 200) {
//         dispatch({
//           type: GET_FRAME_PRICE_SUCCESS,
//           payload: result.list
//         });
//       }
//     } catch(err) {

//     }
//   }
// }

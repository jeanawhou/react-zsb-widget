import axios from 'axios';
import settings from '../constants/settings.json';
export const apiService = {

  jacPrimeRun: function (data, sentinel, xtoken) {
    axios.defaults.headers.common['Authorization'] = 'token ' + xtoken;
    return axios.request({
      baseURL: settings.API_BASE_URL,
      url: '/jac/prime_run',
      method: 'post',
      data: { ...data, snt: sentinel }
    });
  },

  askQuestion: function (sentinel, jid, input, xtoken, visitorID, sessionID, interactionID, channel) {
    return this.jacPrimeRun(
      {
        name: 'ask_question',
        nd: jid,
        ctx: {
          text: input, metadata: {
            visitorID,
            sessionID,
            interactionID,
            channel
          }
        },


      },
      sentinel, xtoken
    );
  },

  logFeedback: function (sentinel, jid, feedback, xtoken, visitorID, sessionID, interactionID, channel) {
    return this.jacPrimeRun(
      {
        name: 'log_feedback',
        nd: jid,
        ctx: {
          feedback, metadata: {
            visitorID,
            sessionID,
            interactionID,
            channel
          }
        },


      },
      sentinel, xtoken
    );
  },

  logCallback: function (sentinel, nd, xtoken, session_id, name, email, mobile) {
    return this.jacPrimeRun(
      {
        name: 'log_callback',
        nd,
        ctx: {
          customer_info: {
            name, email, mobile
          }, session_id
        },
      },
      sentinel, xtoken
    );
  },

};

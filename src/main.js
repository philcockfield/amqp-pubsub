import R from "ramda";
import Promise from "bluebird";
import connect from "mq-connection";
import event from "./event";

const isValidUrl = (url) => new RegExp("^(amqp|amqps)://", "i").test(url.trim());



/**
 * Factory for creating a pub/sub manager.
 *
 * @param {String} url:    The URL to the RabbitMQ server.
 *
 * @return {Promise}
 */
export default (url) => {
  // Ensure a URL was specified.
  if (R.isNil(url) || R.isEmpty(url)) { throw new Error("A URL to the RabbitMQ server must be specified."); }
  if (!isValidUrl(url)) { throw new Error("A connection url must start with 'amqp://' or 'amqps://'"); }
  let connection, channel;

  // Make connection with the RabbitMQ server.
  const connecting = new Promise((resolve, reject) => {
      connect(url)
        .then(conn => {
            connection = conn;
            return connection.createChannel();
        })
        .then(ch => {
            channel = ch;
            resolve(channel);
        })
        .catch(err => reject(err));
    });


    // Main API.
    const api = {
      isReady: false,

      /**
       * A {Promise} that can be used to determine when the event
       * is ready to be interacted with.
       */
       ready() {
        return new Promise((resolve, reject) => {
            connecting
              .then(() => resolve({ isReady: true }))
              .catch(err => reject(err));
          });
       },


      /**
       * Retrieves an pub/sub manager for a single event.
       * @param {String} name: The name of the event.
       * @return {Object} event API.
       */
      event(name) {
        return event(name, connecting);
      }
    };

    // Store connection state.
    connecting
      .then(() => api.isReady = true)
      .catch(err => api.connectionError = err);

    // Finish up.
    return api;
};

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
      Promise.coroutine(function*() {
          try {
            // Connect to the server (or used cached connection)
            // then setup the pub/sub pattern.
            connection = yield connect(url);
            channel = yield connection.createChannel();

            // Create the exchange, using the `event` as the exchange name.
            // yield channel.assertExchange(event, "fanout", { durable: false });

            // Return the pub/sub API.
            resolve({ channel });

          } catch (err) {
            reject(err);
          }

      }).call(this);
    });


    // Main API.
    const api = {
      isReady: false,

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


  // return new Promise((resolve, reject) => {
  //   Promise.coroutine(function*() {
  //       try {
  //         // Connect to the server (or used cached connection)
  //         // then setup the pub/sub pattern.
  //         const connection = yield connect(url);
  //         const channel = yield connection.createChannel();
  //
  //         // Create the exchange, using the `event` as the exchange name.
  //         yield channel.assertExchange(event, "fanout", { durable: false });
  //
  //         // Return the pub/sub API.
  //         resolve(api(event, channel));
  //
  //       } catch (err) {
  //         reject(err);
  //       }
  //
  //   }).call(this);
  // });
};

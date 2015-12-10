import R from "ramda";
import polyfill from "babel-polyfill"; // NB: Required for ES6 generators.
import Promise from "bluebird";
import connect from "mq-connection";
import api from "./api";




/**
 * Factory for creating a pub/sub manager.
 *
 * @param {String} url:    The URL to the RabbitMQ server.
 * @param {String} event:  The name of the event being handled.
 *
 * @return {Promise}
 */
export default (url, event) => {
  // Ensure a URL was specified.
  if (R.isNil(url) || R.isEmpty(url)) {
    throw new Error("A URL to the RabbitMQ server must be specified.");
  }

  // Ensure an event name was specified.
  if (R.isNil(event) || R.isEmpty(event)) {
    throw new Error("An `event` name must be specified.");
  }

  return new Promise((resolve, reject) => {
    Promise.coroutine(function*() {
        try {
          // Connect to the server (or used cached connection)
          // then setup the pub/sub pattern.
          const connection = yield connect(url);
          const channel = yield connection.createChannel();

          // Create the exchange, using the `event` as the exchange name.
          channel.assertExchange(event, "fanout", { durable: false });

          // Return the pub/sub API.
          resolve(api(event, channel));

        } catch (err) {
          reject(err);
        }

    }).call(this);
  });
};

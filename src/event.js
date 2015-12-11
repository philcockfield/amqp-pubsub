import R from "ramda";
import Promise from "bluebird";


/**
 * Factory for creating a single pub/sub event.
 *
 * @param {String}  event:      The name of the event.
 * @param {Promise} connecting: A promise that returns the channel to work with.
 *
 * @return {Object} event API.
 */
export default (event, connecting) => {

  // Ensure an event name was specified.
  if (R.isNil(event) || R.isEmpty(event)) { throw new Error("An `event` name must be specified."); }
  const EXCHANGE_NAME = `pub-sub:${ event }`;

  // Setup the channel and exchange.
  const initializing = new Promise((resolve, reject) => {
        let channel;
        connecting
          .then(result => {
              channel = result;
              channel.assertExchange(EXCHANGE_NAME, "fanout", { durable: false });
          })
          .then(() => resolve(channel))
          .catch(err => reject(err));
      });


  // let isListening = false;
  // const listen = (handler) => {
  //       isListening = true;
  //       Promise.coroutine(function*() {
  //           const q = channel.assertQueue("", { exchangeclusive: true });
  //           channel.bindQueue(q.queue, event, "");
  //           channel.consume(q.queue, handler, { noAck: true });
  //       }).call(this);
  //     };
  //
  //
  // const onEvent = (msg) => {
  //     let payload;
  //     payload = JSON.parse(msg.content.toString());
  //
  //     // TODO: Invoke handlers.
  //     console.log("payload", payload);
  //     // console.log("");
  //
  //   };
  //

// new Promise((resolve, reject) => {
//     initializing
//       .then(result => {
//           api.isReady = true;
//           resolve({ isReady: true });
//       })
//       .catch(err => {
//           api.connectionError = err;
//           reject(err);
//       });
//   })

  // API.
  const api = {
    name: event,
    isReady: false,

    /**
     * A {Promise} that can be used to determine when the event
     * is ready to be interacted with.
     */
     ready() {
      return new Promise((resolve, reject) => {
          initializing
            .then(() => resolve({ isReady: true }))
            .catch(err => reject(err));
        });
     },


    /**
     * Listens for the event.
     * @param {Function} func: The function to invoke when events are published.
     */
    // subscribe(func) {
    //   if (R.is(Function, func)) {
    //     if (!isListening) { listen(onEvent); }
    //
    //     // TODO: Store handler func.
    //
    //   }
    // },
    //

    /**
     * Broadcasts an event to all listeners.
     *
     * @param {Object} data: The JSON serializable data to broadcast.
     *
     * @return {Promise} that yields when the data has been published
     *                   which will be delayed until the connection is
     *                   established with the server.
     */
    publish(data) {
      const payload = { event, data };
      const json = JSON.stringify(payload);
      const ROUTING_KEY = "";
      return new Promise((resolve, reject) => {
        initializing
          .then(channel => {
              channel.publish(EXCHANGE_NAME, ROUTING_KEY, new Buffer(json));
              resolve({ exchange: EXCHANGE_NAME, payload });
          })
          .catch(err => reject(err));
      });
    }
  };

  // Store connection state.
  initializing
    .then(() => api.isReady = true)
    .catch(err => api.connectionError = err);

  // Finish up.
  return api;
};

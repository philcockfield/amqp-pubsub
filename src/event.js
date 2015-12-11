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
  if (R.isNil(event) || R.isEmpty(event)) {
    throw new Error("An `event` name must be specified.");
  }

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



  // API.
  const api = {
    name: event,
    isReady: false,


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
     * @param {Object} data: The JSON serializable data to broadcast.
     */
    // publish(data) {
    //   const payload = JSON.stringify({ event, data });
    //   const ROUTING_KEY = "";
    //   channel.publish(event, ROUTING_KEY, new Buffer(payload));
    // }
  };

  // Store connection state.
  connecting
    .then(result => api.isReady = true)
    .catch(err => api.connectionError = err);


  return api;
};

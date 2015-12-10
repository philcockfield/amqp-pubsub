import R from "ramda";
import Promise from "bluebird";


export default (event, channel) => {
  let isListening = false;
  const listen = (handler) => {
        isListening = true;
        Promise.coroutine(function*() {
            const q = channel.assertQueue("", { exchangeclusive: true });
            channel.bindQueue(q.queue, event, "");
            channel.consume(q.queue, handler, { noAck: true });
        }).call(this);
      };


  const onEvent = (msg) => {
      let payload;
      payload = JSON.parse(msg.content.toString());

      // TODO: Invoke handlers.
      console.log("payload", payload);
      // console.log("");

    };



  return {
    name: event,


    /**
     * Listens for the event.
     * @param {Function} func: The function to invoke when events are published.
     */
    subscribe(func) {
      if (R.is(Function, func)) {
        if (!isListening) { listen(onEvent); }

        // TODO: Store handler func.

      }
    },


    /**
     * Broadcasts an event to all listeners.
     * @param {Object} data: The JSON serializable data to broadcast.
     */
    publish(data) {
      const payload = JSON.stringify({ event, data });
      const ROUTING_KEY = "";
      channel.publish(event, ROUTING_KEY, new Buffer(payload));
    }
  };
};

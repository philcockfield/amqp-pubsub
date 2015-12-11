"use strict";
import { expect } from "chai";
import connect from "mq-connection";
import factory from "../src/main";

const URL = "amqp://rabbitmq";
const delay = (msecs, func) => setTimeout(func, msecs);
let pubsub, fakeConnection;


describe("Event (manager)", function() {
  beforeEach(() => {
    connect.reset();
    fakeConnection = connect.fake();
    pubsub = factory(URL);
  });
  afterEach(() => connect.real());


  it("has the event name", () => {
    const event = pubsub.event("myEvent");
    expect(event.name).to.equal("myEvent");
  });


  it("throws if an event name was not specified", () => {
    expect(() => pubsub.event()).to.throw();
    expect(() => pubsub.event("")).to.throw();
  });


  it("is not ready", () => {
    const event = pubsub.event("myEvent");
    expect(event.isReady).to.equal(false);
  });


  it("isReady when connection completes", (done) => {
    const event = pubsub.event("myEvent");
    expect(event.isReady).to.equal(false);
    event.ready().then(result => {
        expect(result.isReady).to.equal(true);
        done();
    });
  });


  describe("connection failures", function() {
    const CONNECTION_ERROR = new Error("Connection Fail!");
    beforeEach(() => {
      // Override the connect method to force failure.
      connect.reset();
      connect.connect = () => new Promise((resolve, reject) => reject(CONNECTION_ERROR));
    });


    it("reports connection error (isReady: false)", (done) => {
      const event = factory(URL).event("myEvent");
      delay(10, () => {
          expect(event.isReady).to.equal(false);
          expect(event.connectionError).to.equal(CONNECTION_ERROR);
          done();
      });
    });


    it("fails on subscription if there is a connection error", (done) => {
      const event = factory(URL).event("myEvent");
      delay(10, () => {
          event.subscribe((msg) => true)
            .catch(err => {
                expect(err).to.equal(CONNECTION_ERROR);
                done();
            });
      });
    });


    it("fails on publish if there is a connection error", (done) => {
      const event = factory(URL).event("myEvent");
      delay(10, () => {
          event.publish({ foo:123 })
            .catch(err => {
                expect(err).to.equal(CONNECTION_ERROR);
                done();
            });
      });
    });
  });


  describe("publish", function() {
    it("publishes an event", (done) => {
      const event = pubsub.event("myEvent");
      let channel;
      event.ready()
        .then(() => {
            channel = fakeConnection.test.channels[0];
            return event.publish({ foo: 123 });
        })
        .then(() => {
            const args = channel.test.publish[0];
            const payload = JSON.parse(args.content.toString());
            expect(args.exchange).to.equal("pub-sub:myEvent");
            expect(args.routingKey).to.equal("");
            expect(payload.event).to.equal("myEvent");
            expect(payload.data).to.eql({ foo: 123 });
            done();
        });
    });

    it("publishes no data (undefined)", (done) => {
      const event = pubsub.event("myEvent");
      let channel;
      event.ready()
        .then(() => {
            channel = fakeConnection.test.channels[0];
            return event.publish();
        })
        .then(() => {
            const args = channel.test.publish[0];
            const payload = JSON.parse(args.content.toString());
            expect(payload.data).to.eql(undefined);
            done();
        });
    });
  });


  describe("subscribe", function() {
    it("subscribes to an event", (done) => {
      const event = pubsub.event("myEvent");
      let channel;
      const fn = (msg) => {};
      event.ready()
        .then(() => {
            channel = fakeConnection.test.channels[0];

            // Channel has not yet been setup.
            expect(channel.test.assertQueue.length).to.equal(0);
            expect(channel.test.bindQueue.length).to.equal(0);
            expect(channel.test.consume.length).to.equal(0);

            return event.subscribe(fn);
        })
        .then(result => {

            // Ensure the channel has been setup.
            expect(channel.test.assertQueue.length).to.equal(1);
            expect(channel.test.bindQueue.length).to.equal(1);
            expect(channel.test.consume.length).to.equal(1);

            expect(result).to.eql({});
            done();
        });
    });
  });
});

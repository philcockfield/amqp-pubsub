"use strict";
import { expect } from "chai";
import connect from "mq-connection";
import factory from "../src/main";

const URL = "amqp://rabbitmq";
const delay = (msecs, func) => setTimeout(func, msecs);
let pubsub;


describe("Event (manager)", function() {
  beforeEach(() => {
    connect.reset();
    connect.fake();
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
    delay(10, () => {
        expect(event.isReady).to.equal(true);
        done();
    });
  });


  it("reports connection error (isReady: false)", (done) => {
    // Override the connect method to force it to fail.
    const err = new Error("Fail!");
    connect.reset();
    connect.connect = () => new Promise((resolve, reject) => reject(err));
    const event = factory(URL).event("myEvent");
    delay(10, () => {
      expect(event.isReady).to.equal(false);
      expect(event.connectionError).to.equal(err);
      done();
    });
  });
});

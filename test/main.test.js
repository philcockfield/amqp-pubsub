"use strict";
import { expect } from "chai";
import connect from "mq-connection";
import factory from "../src/main";

const URL = "amqp://rabbitmq";
const delay = (msecs, func) => setTimeout(func, msecs);


describe("Main (API)", function() {
  beforeEach(() => {
    connect.reset();
    connect.fake();
  });
  afterEach(() => connect.real());


  it("throws if a URL was not specified", () => {
    expect(() => factory()).to.throw();
    expect(() => factory("")).to.throw();
  });


  it("throws if the URL does not start with 'amqp://' or 'amqps://", () => {
    expect(() => factory("fail")).to.throw();
  });


  it("isReady when connection completes", (done) => {
    const pubsub = factory(URL);
    expect(pubsub.isReady).to.equal(false);
    delay(10, () => {
        expect(pubsub.isReady).to.equal(true);
        done();
    });
  });


  it("reports connection error (isReady: false)", (done) => {
    // Override the connect method to force it to fail.
    const err = new Error("Fail!");
    connect.connect = () => new Promise((resolve, reject) => reject(err));
    const pubsub = factory(URL);
    delay(10, () => {
      expect(pubsub.isReady).to.equal(false);
      expect(pubsub.connectionError).to.equal(err);
      done();
    });
  });
});

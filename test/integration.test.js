"use strict";
import { expect } from "chai";
import amqp from "amqplib";
import pubsub from "../src/main";

const URL = "amqp://guest:guest@dev.rabbitmq.com";


describe("mq-pubsub", () => {
  it("throws if a URL was not specified", () => {
    expect(() => pubsub(undefined, "my:event")).to.throw();
  });

  it("throws if an event was not specified", () => {
    expect(() => pubsub(URL)).to.throw();
  });
});

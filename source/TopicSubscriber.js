/*
 * Copyright (C) 2013 Lightstreamer Srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Inheritance from "./Inheritance";
import MessageConsumer from "./MessageConsumer";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link TopicSubscriber} object that receives messages from a
   * specific {@link Topic}.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this subscriber will
   * receive messages on.
   * @param {Topic} topic specifies the topic this
   * subscriber will receive messages from.
   * @param {String} subscriptionName specifies the optional name to
   * make the subscription a durable subscription.
   * @param {Boolean} durable specifies if this consumer is for a durable subscription.
   * @param {Boolean} noLocal specifies if this consumer must receive or not messages
   * published by its own connection.
   * @param {Boolean} shared specifies if this consumer is shared between multiple
   * connections.
   * @param {String} messageSelector specifies the optional selector, e.g.
   * the rule to be applied to messages being received to filter them or not.
   * See JMS specifications for more information on message selectors.
   * @param {MessageListener} messageListener is the listener that will
   * asynchronously receive messages from this topic.
//JSDOC_IGNORE_END
   *
   * @exports TopicSubscriber
   * @class Class that receives messages from a specific {@link Topic}.
   * The subscriber will deliver messages asynchronously to its
   * {@link MessageListener}.
   * @extends MessageConsumer
   */
  var TopicSubscriber= function(session, topic, subscriptionName, durable, noLocal, shared, messageSelector, messageListener) {
    this._callSuperConstructor(TopicSubscriber, [session, topic, subscriptionName, durable, noLocal, shared, messageSelector]);
    this.messageListener= messageListener;
  };

  Inheritance(TopicSubscriber, MessageConsumer);
  export default TopicSubscriber;

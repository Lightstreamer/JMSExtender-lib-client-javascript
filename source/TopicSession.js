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
import Session from "./Session";
import Topic from "./Topic";
import TopicSubscriber from "./TopicSubscriber";
import TopicPublisher from "./TopicPublisher";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link TopicSession} object that works as a context for sending
   * and publishing messages on a {@link Topic}.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {TopicConnection} topicConnection connection on which the session
   * must work.
   * @param {Boolean} transacted flag that specifies if the session is
   * transacted.
   * @param {String} acknowledgeMode specifies the type of acknowledge
   * to be used for messages. Can be <code>"PRE_ACK"</code>, <code>"AUTO_ACK"</code>,
   * <code>"CLIENT_ACK"</code>, <code>"DUPS_OK"</code> or <code>"INDIVIDUAL_ACK"</code>.
   * See JMS Extender documentation for more information.
//JSDOC_IGNORE_END
   *
   * @exports TopicSession
   * @class Class that works as a context for sending
   * and publishing messages on a {@link Topic}.
   * @extends Session
   */
  var TopicSession= function(topicConnection, transacted, acknowledgeMode) {
    this._callSuperConstructor(TopicSession, [topicConnection, transacted, acknowledgeMode]);
  };

  TopicSession.prototype= {

    /**
     * Creates a new {@link TopicSubscriber} object for receiving messages on
     * a specific {@link Topic}.
     * @returns {TopicSubscriber}
     *
     * @param {Topic} topic topic from which the subscriber must receive
     * messages.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     */
    createSubscriber: function(topic, messageSelector) {
      var subscriber= new TopicSubscriber(this, topic, null, messageSelector, null);
      this.consumers.push(subscriber);

      if (this.running)
        subscriber.start();

      return subscriber;
    },

    /**
     * Creates a new {@link TopicPublisher} object for publishing messages on
     * a specific {@link Topic}.
     * @returns {TopicPublisher}
     *
     * @param {Topic} topic topic to which the publisher must send messages.
     */
    createPublisher: function(topic) {

      // Default QoS values
      var defaultDeliveryMode= "PERSISTENT";
      var defaultPriority= 4;
      var defaultTimeToLive= 0;

      var publisher= new TopicPublisher(this, topic, defaultDeliveryMode, defaultPriority, defaultTimeToLive);
      this.producers.push(publisher);

      return publisher;
    }
  };

  TopicSession.prototype["createPublisher"] = TopicSession.prototype.createPublisher;
  TopicSession.prototype["createSubscriber"] = TopicSession.prototype.createSubscriber;

  Inheritance(TopicSession, Session);
  export default TopicSession;

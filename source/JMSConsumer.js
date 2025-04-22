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
import MessageListener from "./MessageListener";
import JMSException from "./JMSException";
import IllegalStateException from "./IllegalStateException";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link JMSConsumer} object that works for consuming messages.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {MessageConsumer} consumer message consumer on which this consumer
   * must work.
//JSDOC_IGNORE_END
   *
   * @exports JMSConsumer
   * @class Class that works for consuming message.
   */
  var JMSConsumer= function(consumer) {
    this.consumer= consumer;
  };

  JMSConsumer.prototype= {

    /**
     * Gets this message consumer's message selector expression.
     * @returns {String}
     */
    getMessageSelector: function() {
      return this.consumer.getMessageSelector();
    },

    /**
     * Gets the message consumer's {@link MessageListener}.
     * @returns {MessageListener}
     */
    getMessageListener: function() {
      return this.consumer.getMessageListener();
    },

    /**
     * Sets the consumer's {@link MessageListener}. As soon as it is set, any
     * message that is received will be forwarded to the listener in its
     * {@link MessageListener#onMessage} event.
     *
     * @param {MessageListener} messageListener the message listener meant
     * to receive messages from this consumer.
     */
    setMessageListener: function(listener) {
      this.consumer.setMessageListener(listener);
    },

    /**
     * Receives the next message if one is immediately available.
     * @returns {Message}
     */
    receiveNoWait: function() {
      return this.consumer.receiveNoWait();
    },

    /**
     * Closes the consumer. Once closed, the consumer will not deliver
     * any more messages.
     * <BR/><B>Implementation note</B>: underlying subscription is
     * unsubscribed and deleted.
     */
    close: function() {
      this.consumer.close();
    }
  };

  JMSConsumer.prototype["getMessageSelector"] = JMSConsumer.prototype.getMessageSelector;
  JMSConsumer.prototype["getMessageListener"] = JMSConsumer.prototype.getMessageListener;
  JMSConsumer.prototype["setMessageListener"] = JMSConsumer.prototype.setMessageListener;
  JMSConsumer.prototype["receiveNoWait"] = JMSConsumer.prototype.receiveNoWait;
  JMSConsumer.prototype["close"] = JMSConsumer.prototype.close;

  export default JMSConsumer;

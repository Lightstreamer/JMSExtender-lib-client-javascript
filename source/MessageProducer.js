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
import IntArrayConverter from "./IntArrayConverter";
import IllegalStateException from "./IllegalStateException";
import JMSException from "./JMSException";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link MessageProducer} object that sends messages to a
   * specific {@link Destination}.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this producer will
   * send messages on.
   * @param {Destination} destination specifies the destination this
   * producer will send messages to.
   * @param {String} deliveryMode specifies if by default messages must be
   * delivered persistently or not persistently. It can either be
   * <code>"PERSISTENT"</code> or <code>"NON_PERSISTENT"</code>.
   * See JMS specifications for more information.
   * @param {Number} priority specifies the default level of priority for
   * messages sent with this producer. See JMS specifications for more
   * information.
   * @param {Number} timeToLive specifies the default time to live for
   * messages sent with this producer. Time to live directly influences
   * message expiration. See JMS specifications for more information.
//JSDOC_IGNORE_END
   *
   * @exports MessageProducer
   * @class Class that sends messages to a specific
   * {@link Destination}.
   * <BR/><B>Producers with no destination are not supported.</B>
   */
  var MessageProducer= function(session, destination, deliveryMode, priority, timeToLive) {
    this.session= session;
    this.destination= destination;
    this.deliveryMode= deliveryMode;
    this.deliveryDelay= 0;
    this.priority= priority;
    this.timeToLive= timeToLive;

    this.open= true;
  };

  MessageProducer.prototype= {

    /**
     * Gets the destination associated with this {MessageProducer}.
     * @returns {Destination}
     */
    getDestination: function() {
      return this.destination;
    },

    /**
     * Sets the producer's default delivery mode.
     *
     * @param {String} deliveryMode specifies if by default messages must be
     * delivered persistently or not persistently. It can either be
     * <code>"PERSISTENT"</code> or <code>"NON_PERSISTENT"</code>.
     * See JMS specifications for more information.
     */
    setDeliveryMode: function(deliveryMode) {
      this.deliveryMode= deliveryMode;
    },

    /**
     * Gets the producer's default delivery mode.
     * @returns {String}
     */
    getDeliveryMode: function() {
      return this.deliveryMode;
    },

    /**
     * Sets the minimum length of time in milliseconds that must elapse after
     * a message is sent before the JMS provider may deliver the message to a
     * consumer.
     *
     * @param {Number} deliveryDelay the delivery delay in milliseconds.
     */
    setDeliveryDelay: function(deliveryDelay) {
      this.deliveryDelay= deliveryDelay;
    },

    /**
     * Gets the minimum length of time in milliseconds that must elapse after
     * a message is sent before the JMS provider may deliver the message to a
     * consumer.
     * @returns {Number}
     */
    getDeliveryDelay: function() {
      return this.deliveryDelay;
    },

    /**
     * Sets the producer's default priority.
     *
     * @param {Number} priority specifies the default level of priority for
     * messages sent with this producer. See JMS specifications for more
     * information.
     */
    setPriority: function(priority) {
      this.priority= priority;
    },

    /**
     * Gets the producer's default priority.
     * @returns {Number}
     */
    getPriority: function() {
      return this.priority;
    },

    /**
     * Sets the default length of time in milliseconds from its dispatch time that a
     * produced message should be retained by the message system.
     *
     * @param {Number} timeToLive specifies the default time to live for
     * messages sent with this producer. Time to live directly influences
     * message expiration. See JMS specifications for more information.
     */
    setTimeToLive: function(timeToLive) {
      this.timeToLive= timeToLive;
    },

    /**
     * Gets the default length of time in milliseconds from its dispatch time that a
     * produced message should be retained by the message system.
     * @returns {Number}
     */
    getTimeToLive: function() {
      return this.timeToLive;
    },

    /**
     * Sends a message. Will use {@link MessageProducer}'s default delivery mode,
     * priority and time to live if message parameters are not set.
     *
     * @param {Message} message the message to be sent.
     * @param {Destination} destination the destination the message is to be
     * sent to.
     * @param {CompletionListener} completionListener an optional
     * CompletionListener to be notified when the send has completed.
     */
    send: function(message, destination, completionListener) {
      if (!this.open)
        throw new IllegalStateException("Producer has been closed");

      if (destination == null)
        destination= this.destination;

      if (destination == null)
        throw new IllegalStateException("This producer has no defined destination");

      this.sendMessage(message, destination, completionListener);
    },

    /**
     * Closes the producer. Once closed, sending a message will not be
     * possible any more.
     */
    close: function() {
      if (!this.open)
        return;

      this.open= false;

      // Remove producer from session's producer list
      var index= this.session.producers.indexOf(this);
      if (index >= 0)
        this.session.producers.splice(index, 1);
    },

//JSDOC_IGNORE_START
    sendMessage: function(message, destination, completionListener) {
      try {
        var actualMessage= {
          "dataAdapterName": this.session.connection.dataAdapterName,
          "localClientId": this.session.connection.clientId,
          "localSessionGuid": this.session.localGuid,
          "destinationType": destination.destinationType,
          "destinationName": destination.destinationName,
          "ackMode": this.session.acknowledgeMode,
          "messageKind": message.messageKind,
          "deliveryMode": message.deliveryMode,
          "deliveryDelay": this.deliveryDelay,
          "priority": message.priority,
          "messageProperties": message.properties
        };

        switch (message.messageKind) {
          case "TEXT_MSG":
          case "OBJECT_MSG":
          case "MAP_MSG":
            if (message.messageKind == "OBJECT_MSG")
              actualMessage["classFQN"] = message.classFQN;

            actualMessage["payload"] = message.body;
            break;

          case "BYTES_MSG":
            actualMessage["payload"] = IntArrayConverter.toBase64(message.body);
            break;

          default:
            break;
        }

        // Check reply destination
        if (message.replyDestination != null) {
          actualMessage["replyDestinationType"] = message.replyDestination.destinationType;
          actualMessage["replyDestinationName"] = message.replyDestination.destinationName;
        }

        // Check QoS properties
        if (actualMessage["deliveryMode"] == null)
          actualMessage["deliveryMode"] = this.deliveryMode;

        if (actualMessage["priority"] == null)
          actualMessage["priority"] = this.priority;

        if (actualMessage["timeToLive"] == null)
          actualMessage["timeToLive"] = this.timeToLive;

        // Other properties
        if (message.type != null)
          actualMessage["type"]= message.type;

        if (message.correlationId !=null)
          actualMessage["correlationId"] = message.correlationId;

        // Use session GUID as sequence identifier, to guarantee proper message serialization
        var sequenceId= this.session.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");

        // If requested, wrap the completion listener in a client message listener
        var listener= null;
        if (completionListener != null) {
          listener= {
            "onAbort": function(originalMessage, sentOnNetwork) {
              completionListener["onException"](message, new JMSException("Message sending has been aborted"));
            },

            "onDeny": function(originalMessage, code, error) {
              completionListener["onException"](message, new JMSException("The message has been denied by the server: " + error, code));
            },

            "onDiscarded": function(originalMessage) {
              completionListener["onException"](message, new JMSException("The message has been discarded by the server"));
            },

            "onError": function(originalMessage) {
              completionListener["onException"](message, new JMSException("A server internal error occurred while sending the message"));
            },

            "onProcessed": function(originalMessage) {
              completionListener["onCompletion"](message);
            }
          };
        }

        this.session.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, listener, true);

        message.setJMSDeliveryTime(new Date().getTime());

      } catch (err) {

        // Log the error
        try {
          console.log("MessageProducer: exception while sending message: " + err);
        } catch (err2) {}
      }
    }
//JSDOC_IGNORE_END
  };

  MessageProducer.prototype["close"] = MessageProducer.prototype.close;
  MessageProducer.prototype["getDeliveryMode"] = MessageProducer.prototype.getDeliveryMode;
  MessageProducer.prototype["getDestination"] = MessageProducer.prototype.getDestination;
  MessageProducer.prototype["getPriority"] = MessageProducer.prototype.getPriority;
  MessageProducer.prototype["getTimeToLive"] = MessageProducer.prototype.getTimeToLive;
  MessageProducer.prototype["send"] = MessageProducer.prototype.send;
  MessageProducer.prototype["setDeliveryMode"] = MessageProducer.prototype.setDeliveryMode;
  MessageProducer.prototype["setPriority"] = MessageProducer.prototype.setPriority;
  MessageProducer.prototype["setTimeToLive"] = MessageProducer.prototype.setTimeToLive;

  export default MessageProducer;

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
import Message from "./Message"; 
import TextMessage from "./TextMessage"; 
import ObjectMessage from "./ObjectMessage";
import MapMessage from "./MapMessage";
import BytesMessage from "./BytesMessage";
import Topic from "./Topic";
import Queue from "./Queue";
import TemporaryTopic from "./TemporaryTopic";
import TemporaryQueue from "./TemporaryQueue"; 
import MessageProducer from "./MessageProducer";
import TopicSubscriber from "./TopicSubscriber";
import MessageConsumer from "./MessageConsumer";
import JMSException from "./JMSException";
import IllegalStateException from "./IllegalStateException";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link Session} object that works as a context for producing
   * and consuming messages.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Connection} connection connection on which the session must
   * work.
   * @param {Boolean} transacted flag that specifies if the session is
   * transacted.
   * @param {String} acknowledgeMode specifies the type of acknowledge
   * to be used for messages. Can be <code>"PRE_ACK"</code>, <code>"AUTO_ACK"</code>,
   * <code>"CLIENT_ACK"</code>, <code>"DUPS_OK"</code> or <code>"INDIVIDUAL_ACK"</code>.
   * If session is transacted the acknowledgeMode is ignored. See JMS Extender
   * documentation for more information.
//JSDOC_IGNORE_END
   *
   * @exports Session
   * @class Class that works as a context for producing
   * and consuming messages.
   */
  var Session= function(connection, transacted, acknowledgeMode) {
    this.connection= connection;
    this.transacted= transacted;
    this.acknowledgeMode= this.transacted ? "TRANSACTED" : acknowledgeMode;

    this.localGuid= "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
          var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
          return v.toString(16);
      });

    this.acknowledgeTimer= null;
    this.messagesToBeAcknowledged= [];

    this.open= true;
    this.running= false;
    this.producers= [];
    this.consumers= [];
  };

  Session.prototype= {

    /**
     * Indicates whether the session is in transacted mode.
     * @returns {Boolean}
     */
    getTransacted: function() {
      return this.transacted;
    },

    /**
     * Returns the acknowledgement mode of the session. The acknowledgement mode is
     * set at the time that the session is created.
     * @returns {String}
     */
    getAcknowledgeMode: function() {
      return this.acknowledgeMode;
    },

    /**
     * Creates a {@link MessageConsumer} for the specified destination, using a message
     * selector.
     * @returns {MessageConsumer}
     *
     * @param {Destination} destination destination from which the consumer must
     * receive messages.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     * @param {Boolean} noLocal specifies if this consumer must receive or not messages
     * published by its own connection.
     */
    createConsumer: function(destination, messageSelector, noLocal) {
      var consumer= new MessageConsumer(this, destination, null, false, (noLocal != null) ? noLocal : false, false, messageSelector, null);
      this.consumers.push(consumer);

      if (this.running)
        consumer.start();

      return consumer;
    },

    /**
     * Creates shared a {@link MessageConsumer} for the specified topic,
     * using the specified subscription name and a message selector. See JMS
     * specifications for differences between shared and non shared consumers.
     * @returns {MessageConsumer}
     *
     * @param {Topic} topic topic from which the consumer must
     * receive messages.
     * @param {String} sharedSubscriptionName name of the shared subscription.
     * See JMS specifications for more information.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     */
    createSharedConsumer: function(topic, sharedSubscriptionName, messageSelector) {
      if (this.connection.clientId == null)
        throw new JMSException("Connection client ID not set");

      var consumer= new MessageConsumer(this, topic, sharedSubscriptionName, false, false, true, messageSelector, null);
      this.consumers.push(consumer);

      if (this.running)
        consumer.start();

      return consumer;
    },

    /**
     * Creates a new durable {@link MessageConsumer} for receiving
     * messages on a specific {@link Topic}. See JMS specifications for
     * differences between durable and non durable consumers.
     * @returns {MessageConsumer}
     *
     * @param {Topic} topic topic from which the subscriber must receive
     * messages.
     * @param {String} name name of the subscription. See JMS
     * specifications for more information.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     * @param {Boolean} noLocal specifies if this consumer must receive or not messages
     * published by its own connection.
     */
    createDurableConsumer: function(topic, name, messageSelector, noLocal) {
      return this.createDurableSubscriber(topic, name, messageSelector, noLocal);
    },

    /**
     * Creates a new shared durable {@link MessageConsumer} for the specified topic,
     * using the specified subscription name and a message selector. See JMS
     * specifications for differences between shared, non shared, durable and
     * non durable consumers.
     * @returns {MessageConsumer}
     *
     * @param {Topic} topic topic from which the consumer must
     * receive messages.
     * @param {String} name name of the subscription.
     * See JMS specifications for more information.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     */
    createSharedDurableConsumer: function(topic, name, messageSelector) {
      if (this.connection.clientId == null)
        throw new JMSException("Connection client ID not set");

      var consumer= new MessageConsumer(this, topic, name, true, false, true, messageSelector, null);
      this.consumers.push(consumer);

      if (this.running)
        consumer.start();

      return consumer;
    },

    /**
     * Creates a {@link MessageProducer} to send messages to the specified destination.
     * @returns {MessageProducer}
     *
     * @param {Destination} destination the Destination to send to.
     */
    createProducer: function(destination) {

      // Default QoS values
      var defaultDeliveryMode= "PERSISTENT";
      var defaultPriority= 4;
      var defaultTimeToLive= 0;

      var producer= new MessageProducer(this, destination, defaultDeliveryMode, defaultPriority, defaultTimeToLive);
      this.producers.push(producer);

      return producer;
    },

    /**
     * Creates a new durable {@link TopicSubscriber} object for receiving
     * messages on a specific {@link Topic}. See JMS specifications for
     * differences between durable and non durable subscribers.
     * @returns {TopicSubscriber}
     *
     * @param {Topic} topic topic from which the subscriber must receive
     * messages.
     * @param {String} name name of the durable subscription. See JMS
     * specifications for more information.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     * @param {Boolean} noLocal specifies if this consumer must receive or not messages
     * published by its own connection.
     */
    createDurableSubscriber: function(topic, name, messageSelector, noLocal) {
      if (this.connection.clientId == null)
        throw new JMSException("Connection client ID not set");

      var subscriber= new TopicSubscriber(this, topic, name, true, (noLocal != null) ? noLocal : false, false, messageSelector, null);
      this.consumers.push(subscriber);

      return subscriber;
    },

    /**
     * Unsubscribes a durable subscription previously created with the
     * specified name. See JMS specifications for more information on
     * durable subscriptions.
     * <BR/><B>Implementation note</B>: if there's still an open consumer
     * on the subscription, the unsubscribe will be automatically postponed
     * to when the consumer will be closed.
     *
     * @param {String} name name used to identify this subscription.
     */
    unsubscribe: function(name) {
      var actualMessage= {
        "dataAdapterName": this.connection.dataAdapterName,
        "localClientId": this.connection.clientId,
        "localSessionGuid": this.localGuid,
        "destinationType": "TOPIC",
        "subscriptionName": name,
        "messageKind": "UNSUBSCRIBE"
       };

      // Use session GUID as sequence identifier, to guarantee proper message serialization
      var sequenceId= this.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");
      this.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, null, true);
    },

    /**
     * Creates a new {@link Topic} object with the specified topic name.
     * @returns {Topic}
     *
     * @param {String} topicName name of the topic.
     */
    createTopic: function(topicName) {
      return new Topic(topicName);
    },

    /**
     * Creates a new {@link Queue} object with the specified queue name.
     * @returns {Queue}
     *
     * @param {String} queueName name of the queue.
     */
    createQueue: function(queueName) {
      return new Queue(queueName);
    },

    /**
     * Creates a {@link Message} object. The {@link Message} class is the root class
     * of all JMS messages. A Message object holds all the standard message header
     * information. It can be sent when a message containing only header information
     * is sufficient.
     * @returns {Message}
     */
    createMessage: function() {
      if (!this.open)
        throw new IllegalStateException("Session has been closed");

      // Treat it as a 0-length text message
      var message= new Message(this, "TEXT_MSG");

      return message;
    },

    /**
     * Creates a new {@link TextMessage} with the specified string as its
     * payload.
     * @returns {TextMessage}
     *
     * @param {String} text desired string payload for the message.
     */
    createTextMessage: function(text) {
      if (!this.open)
        throw new IllegalStateException("Session has been closed");

      var message= new TextMessage(this);
      message.setText(text);

      return message;
    },

    /**
     * Creates a new {@link ObjectMessage} with the specified object and class
     * fully-qualified name as its payload.
     * @returns {ObjectMessage}
     *
     * @param {Object} object desired object payload for the message.
     * @param {String} classFQN fully-qualified class name of the payload
     * object.
     */
    createObjectMessage: function(object, classFQN) {
      if (!this.open)
        throw new IllegalStateException("Session has been closed");

      var message= new ObjectMessage(this);
      message.setObject(object);
      message.setClassFQN(classFQN);

      return message;
    },

    /**
     * Creates a new empty {@link MapMessage}.
     * @returns {MapMessage}
     */
    createMapMessage: function() {
      if (!this.open)
        throw new IllegalStateException("Session has been closed");

      var message= new MapMessage(this);

      return message;
    },

    /**
     * Creates a new empty {@link BytesMessage}.
     * @returns {BytesMessage}
     */
    createBytesMessage: function() {
      if (!this.open)
        throw new IllegalStateException("Session has been closed");

      var message= new BytesMessage(this);

      return message;
    },

    /**
     * Creates a {@link TemporaryQueue} object. Its lifetime will be that of the
     * {@link Connection} unless it is deleted earlier.
     * <BR/><B>Implementation note</B>: due to limitations of Javascript this
     * method can't return a temp queue synchronously, the queue will be
     * delivered asynchronously through the specified callback.
     * @returns {TemporaryQueue}
     *
     * @param {Function} onTempQueueCreated the callback that will be invoked
     * when the temp queue is created. Takes one argument: the {@link TemporaryQueue} object.
     * @param {Function} onTempQueueFailed the callback that will be invoked
     * when the temp queue creation fails. Takes one argument: an exception.
     */
    createTemporaryQueue: function(onTempQueueCreated, onTempQueueFailed) {

      // Compute operation ID
      var operationId= "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
        return v.toString(16);
      });

      // Store operation outcome callback
      var that= this;
      this.connection.addOutcomeCallback(operationId, {
        callback: function(outcome) {
          var tempQueue= new TemporaryQueue(outcome, that);

          try {

            // Call user callback
            onTempQueueCreated(tempQueue);

          } catch (err) {

            // Log the error
            try {
              console.log("Session: exception while calling temp queue callback: " + err);
            } catch (err2) {}
          }
        },

        onException: function(exceptionType, exceptionReason, exceptionErrorCode) {
          var exception= null;

          switch (exceptionType) {
            case "GENERIC_EXCEPTION":
              exception= new JMSException(exceptionReason, exceptionErrorCode);
              break;

            default:
              break;
          }

          try {
            // Call user callback
            if (typeof onTempQueueFailed == 'function') {
              onTempQueueFailed(exception);
            } else{
              console.log("Session: provided onTempQueueFailed is not a valid callback");
            }
          } catch (err) {

            // Log the error
            try {
              console.log("Session: exception while calling temp queue exception callback: " + err);
            } catch (err2) {}
          }
        }
      });

      // Prepare and send delete message
      var actualMessage= {
        "dataAdapterName": this.connection.dataAdapterName,
        "localClientId": this.connection.clientId,
        "localSessionGuid": this.localGuid,
        "destinationType": "QUEUE",
        "ackMode": this.acknowledgeMode, // Specify ack mode, in case this is the first message for the session
        "operationId": operationId,
        "messageKind": "CREATE_TEMP_QUEUE"
      };

      // Use session GUID as sequence identifier, to guarantee proper message serialization
      var sequenceId= this.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");
      this.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, null, true);
    },

    /**
     * Creates a {@link TemporaryTopic} object. Its lifetime will be that of the
     * {@link Connection} unless it is deleted earlier.
     * <BR/><B>Implementation note</B>: due to limitations of Javascript this
     * method can't return a temp topic synchronously, the topic will be
     * delivered asynchronously through the specified callback.
     * @returns {TemporaryTopic}
     *
     * @param {Function} onTempTopicCreated the callback that will be invoked
     * when the temp topic is created. Takes one argument: the {@link TemporaryQueue} object.
     * @param {Function} onTempTopicFailed the callback that will be invoked
     * when the temp topic creation fails. Takes one argument: an exception.
     */
    createTemporaryTopic: function(onTempTopicCreated, onTempTopicFailed) {

      // Compute operation ID
      var operationId= "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == "x" ? r : (r&0x3|0x8);
        return v.toString(16);
      });

      // Store operation outcome callback
      var that= this;
      this.connection.addOutcomeCallback(operationId, {
        callback: function(outcome) {
          var tempTopic= new TemporaryTopic(outcome, that);

          try {

            // Call user callback
            onTempTopicCreated(tempTopic);

          } catch (err) {

            // Log the error
            try {
              console.log("Session: exception while calling temp topic callback: " + err);
            } catch (err2) {}
          }
        },

        onException: function(exceptionType, exceptionReason, exceptionErrorCode) {
          var exception= null;

          switch (exceptionType) {
            case "GENERIC_EXCEPTION":
              exception= new JMSException(exceptionReason, exceptionErrorCode);
              break;

            default:
              break;
          }

          try {
            // Call user callback
            if (typeof onTempTopicFailed == 'function') {
              onTempTopicFailed(exception);
            } else{
              console.log("Session: provided onTempTopicFailed is not a valid callback");
            }

          } catch (err) {

            // Log the error
            try {
              console.log("Session: exception while calling temp topic exception callback: " + err);
            } catch (err2) {}
          }
        }
      });

      // Prepare and send delete message
      var actualMessage= {
        "dataAdapterName": this.connection.dataAdapterName,
        "localClientId": this.connection.clientId,
        "localSessionGuid": this.localGuid,
        "destinationType": "QUEUE", // Must always be QUEUE, if we say TOPIC it could be created on the shared session
        "ackMode": this.acknowledgeMode, // Specify ack mode, in case this is the first message for the session
        "operationId": operationId,
        "messageKind": "CREATE_TEMP_TOPIC"
      };

      // Use session GUID as sequence identifier, to guarantee proper message serialization
      var sequenceId = this.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");
      this.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, null, true);
    },

    /**
     * Commits all messages done in this transaction.
     */
    commit: function() {
      if (!this.transacted)
        throw new IllegalStateException("Session is not transacted");

      // Prepare and send commit message
      var actualMessage= {
        "dataAdapterName": this.connection.dataAdapterName,
        "localClientId": this.connection.clientId,
        "localSessionGuid": this.localGuid,
        "destinationType": "QUEUE", // Must always be QUEUE, if we say TOPIC it could commit the shared session
        "messageKind": "COMMIT"
      };

      // Use session GUID as sequence identifier, to guarantee proper message serialization
      var sequenceId= this.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");
      this.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, null, true);
    },

    /**
     * Rolls back any messages done in this transaction.
     */
    rollback: function() {
      if (!this.transacted)
        throw new IllegalStateException("Session is not transacted");

      // Clear local consumer queues
      for (var i= 0; i < this.consumers.length; i++) {
        var consumer= this.consumers[i];

        consumer.clearQueuedMessages();
      }

      // Prepare and send rollback message
      var actualMessage= {
        "dataAdapterName": this.connection.dataAdapterName,
        "localClientId": this.connection.clientId,
        "localSessionGuid": this.localGuid,
        "destinationType": "QUEUE", // Must always be QUEUE, if we say TOPIC it could recover the shared session
        "messageKind": "ROLLBACK"
      };

      // Use session GUID as sequence identifier, to guarantee proper message serialization
      var sequenceId= this.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");
      this.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, null, true);
    },

    /**
     * Stops message delivery in this session, and restarts message
     * delivery with the oldest unacknowledged message. Redelivered
     * messages do not have to be delivered in exactly their original
     * delivery order. See JMS specifications for more information.
     */
    recover: function() {
      if (this.transacted)
        throw new IllegalStateException("Session is transacted");

      // Empty local consumer queues
      for (var i= 0; i < this.consumers.length; i++) {
        var consumer= this.consumers[i];

        consumer.clearQueuedMessages();
      }

      // Prepare and send recover message
      var actualMessage= {
        "dataAdapterName": this.connection.dataAdapterName,
        "localClientId": this.connection.clientId,
        "localSessionGuid": this.localGuid,
        "destinationType": "QUEUE", // Must always be QUEUE, if we say TOPIC it could recover the shared session
        "messageKind": "RECOVER"
      };

      // Use session GUID as sequence identifier, to guarantee proper message serialization
      var sequenceId= this.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");
      this.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, null, true);
    },

    /**
     * Closes the session. Once closed, any other method call will result
     * in an {@link IllegalStateException}. A call to {@link Session#close} on a
     * session that has already been closed is ignored.
     */
    close: function() {
      if (!this.open)
        return;

      this.open= false;
      this.running= false;

      // Close all the producers
      while (this.producers.length > 0) {
        var producer= this.producers.shift();

        producer.close();
      }

      // Close all the consumers
      while (this.consumers.length > 0) {
        var consumer= this.consumers.shift();

        consumer.close();
      }

      // Remove session from connection's session list
      var index= this.connection.sessions.indexOf(this);
      if (index >= 0)
        this.connection.sessions.splice(index, 1);
    },

//JSDOC_IGNORE_START
    start: function() {
      if (this.running)
        return;

      this.running= true;

      // Start all the consumers (producers are not restartable)
      for (var i= 0; i < this.consumers.length; i++) {
        var consumer= this.consumers[i];

        consumer.start();
      }
    },

    stop: function() {
      if (!this.running)
        return;

      this.running= false;

      // Stop all the consumers (producers are not restartable)
      for (var i= 0; i < this.consumers.length; i++) {
        var consumer= this.consumers[i];

        consumer.stop();
      }
    },

    acknowledgeMessages: function() {

      // Clear the timer
      this.acknowledgeTimer= null;

      if (this.messagesToBeAcknowledged.length > 0) {

        var messagesToBeAcknowledged= [];
        switch (this.acknowledgeMde) {
          case "DUPS_OK":
          case "CLIENT_ACK":

            // Acknowledge just the last message
            var message= this.messagesToBeAcknowledged.pop()
            messagesToBeAcknowledged.add(message);
            break;

          case "INDIVIDUAL_ACK":

            // Acknowledge all the pending messages
            messagesToBeAcknowledged= this.messagesToBeAcknowledged;
            break;

          default:

            // Nothing to do in the other cases
            break;
        }

        // Clear the pending message list
        this.messagesToBeAcknowledged= [];

        // Acknowledge selected messages
        for (message in messagesToBeAcknowledged) {
          try {
            message.acknowledgeMessage();

          } catch (err) {

            // Log the error
            try {
              console.log("Session: exception while acknowledging message: " + err);
            } catch (err2) {}
          }
        }
      }
    }
//JSDOC_IGNORE_END
  };

  Session.prototype["close"] = Session.prototype.close;
  Session.prototype["commit"] = Session.prototype.commit;
  Session.prototype["createBytesMessage"] = Session.prototype.createBytesMessage;
  Session.prototype["createConsumer"] = Session.prototype.createConsumer;
  Session.prototype["createDurableSubscriber"] = Session.prototype.createDurableSubscriber;
  Session.prototype["createMapMessage"] = Session.prototype.createMapMessage;
  Session.prototype["createMessage"] = Session.prototype.createMessage;
  Session.prototype["createObjectMessage"] = Session.prototype.createObjectMessage;
  Session.prototype["createProducer"] = Session.prototype.createProducer;
  Session.prototype["createQueue"] = Session.prototype.createQueue;
  Session.prototype["createTemporaryQueue"] = Session.prototype.createTemporaryQueue;
  Session.prototype["createTemporaryTopic"] = Session.prototype.createTemporaryTopic;
  Session.prototype["createTextMessage"] = Session.prototype.createTextMessage;
  Session.prototype["createTopic"] = Session.prototype.createTopic;
  Session.prototype["getAcknowledgeMode"] = Session.prototype.getAcknowledgeMode;
  Session.prototype["getTransacted"] = Session.prototype.getTransacted;
  Session.prototype["recover"] = Session.prototype.recover;
  Session.prototype["rollback"] = Session.prototype.rollback;
  Session.prototype["unsubscribe"] = Session.prototype.unsubscribe;

  export default Session;

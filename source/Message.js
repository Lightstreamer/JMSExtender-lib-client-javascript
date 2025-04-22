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


  /**
   * This method is not meant to be used directly.
   * Creates a {@link Message} object that holds the information needed to
   * send a JMS message on the JMS Extender.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this message will be
   * sent on.
   * @param {String} messageKind specifies the kind of message, e.g. the
   * type of payload for the message. It can be <code>"TEXT_MSG"</code>,
   * <code>"OBJECT_MSG"</code>, <code>"MAP_MSG"</code> or <code>"BYTES_MSG"</code>.
   * See JMS Extender documentation for more information.
//JSDOC_IGNORE_END
   *
   * @exports Message
   * @class Class that holds the information needed to send
   * a JMS message on the JMS Extender. A {@link Message} object holds
   * information like:<ul>
   * <li>message persistence,
   * <li>message priority and TTL,
   * <li>message properties,
   * <li>message destination and payload.
   * </ul>
   */
  var Message= function(session, messageKind) {
    this.session= session;
    this.messageKind= messageKind;
    this.deliveryMode= null;
    this.deliveryTime= 0;
    this.priority= null;
    this.type= null;
    this.expiration= null;
    this.correlationId= null;
    this.properties= {};
    this.classFQN= null;
    this.body= null;
    this.replyDestination= null;
    this.destination= null;
    this.consumer= null;
    this.messageId= null;
    this.timestamp= null;
    this.redelivered= false;
  };

  Message.prototype= {

    /**
     * Acknowledges this message. If message's session is implicitly
     * acknowledging messages this call will be ignored.
     * <BR/><B>Implementation note</B>: causes a message to be sent to the
     * JMS Extender that will acknowledge the message on the JMS broker.
     */
    acknowledge: function() {
      switch (this.session.acknowledgeMode) {
        case "CLIENT_ACK":

          // Let the session acknolwedge the last message received
          this.session.acknowledgeMessages();
          break;

        case "INDIVIDUAL_ACK":

          // Acknowledge only this message
          this.acknowledgeMessage();

          // Remove this message from the session's pending list
          var index= this.session.messagesToBeAcknowledged.indexOf(this);
          if (index >= 0)
            this.session.messagesToBeAcknowledged.splice(index, 1);
          break;

        default:

          // Nothing to do in the other cases
          break;
      }
    },

    /**
     * Clears the message body (e.g. the payload). Message properties
     * and specifications remain unaltered.
     */
    clearBody: function() {
      this.body= null;
    },

    /**
     * Clears the message properties. Message body (e.g. payload) and
     * specifications remain unaltered.
     */
    clearProperties: function() {
      this.properties= {};
    },

    /**
     * Sets a property value with the specified name into the message.
     * <BR/>Note that property values must be one of recognized Java
     * primitives, e.g. integer, double, string, etc. Use of a custom
     * object may raise an exception on the JMS Extender and cause the
     * message to be lost.
     *
     * @param {String} name name of property.
     * @param {Object} value value of the property.
     */
    setObjectProperty: function(name, value) {
      this.properties[name]= value;
    },

    /**
     * Returns the value of the property with the specified name.
     * @returns {Object}
     */
    getObjectProperty: function(name) {
      return this.properties[name];
    },

    /**
     * Returns the destination a reply should be sent to.
     * @returns {Destination}
     */
    getJMSReplyTo: function() {
      return this.replyDestination;
    },

    /**
     * Sets the destination a replay should be sent to.
     *
     * @param {Destination} destination the destination a reply should be
     * sent to.
     */
    setJMSReplyTo: function(destination) {
      this.replyDestination= destination;
    },

    /**
     * Gets an indication of whether this message is being redelivered.
     * @returns {Boolean}
     */
    getJMSRedelivered: function() {
      return this.redelivered;
    },

    /**
     * Specifies whether this message is being redelivered.
     * <BR/>This field is set at the time the message is delivered.
     * This method can be used to change the value for a message that has
     * already been received.
     *
     * @param {Boolean} redelivered an indication of whether this message
     * is being redelivered
     */
    setJMSRedelivered: function(redelivered) {
      this.redelivered= redelivered;
    },

    /**
     * Sets the DeliveryMode value for this message. It can either be
     * <code>"PERSISTENT"</code> or <code>"NON_PERSISTENT"</code>.
     *
     * @param {String} deliveryMode the delivery mode for this message
     */
    setJMSDeliveryMode: function(deliveryMode) {
      this.deliveryMode= deliveryMode;
    },

    /**
     * Gets the DeliveryMode value specified for this message.
     * @returns {String}
     */
    getJMSDeliveryMode: function() {
      return this.deliveryMode;
    },

    /**
     * Sets the message's delivery time value.<BR/>
     * This method is for use by JMS providers only to set this field when a message is sent.
     *
     * @param {Number} deliveryTime the message delivery time.
     */
    setJMSDeliveryTime: function(deliveryTime) {
      this.deliveryTime= deliveryTime;
    },

    /**
     * Gets the message's delivery time value.<BR/>
     * When a message is sent, the JMSDeliveryTime header field is left
     * unassigned. After completion of the send or publish method, it holds
     * the delivery time of the message. This is the the difference, measured
     * in milliseconds, between the delivery time and midnight, January 1, 1970 UTC.
     * @returns {Number}
     */
    getJMSDeliveryTime: function() {
      return this.deliveryTime;
    },

    /**
     * Sets the priority level for this message.
     *
     * @param {Number} priority the priority of this message
     */
    setJMSPriority: function(priority) {
      this.priority= priority;
    },

    /**
     * Gets the message priority level.
     * @returns {Number}
     */
    getJMSPriority: function() {
      return this.priority;
    },

    /**
     * Sets the message type.
     * <BR/>Some JMS brokers use a message repository that contains the definitions
     * of messages sent by applications. The JMSType header field may reference a
     * message's definition in the provider's repository.
     * <BR/>See JMS specs for more information.
     *
     * @param {String} type the message type
     */
    setJMSType: function(type) {
      this.type= type;
    },

    /**
     * Gets the message type identifier supplied by the client when the message was
     * sent.
     * @returns {String}
     */
    getJMSType: function() {
      return this.type;
    },

    /**
     * Sets the message's expiration value.
     * <BR/>This field is set at the time the message is delivered.
     * This method can be used to change the value for a message that has
     * already been received.
     *
     * @param {Number} expiration the message's expiration time
     */
    setJMSExpiration: function(expiration) {
      this.expiration= expiration;
    },

    /**
     * Gets the message's expiration value.
     * <BR/>This is the sum of the time-to-live value specified by the client and
     * the GMT at the time of the send or publish.
     * <BR/>If the time-to-live is specified as zero, JMSExpiration is set to zero
     * to indicate that the message does not expire.
     * @returns {Number}
     */
    getJMSExpiration: function() {
      return this.expiration;
    },

    /**
     * Sets the correlation ID for the message.
     * <BR/>A client can use the JMSCorrelationID header field to link one message
     * with another. A typical use is to link a response message with its request
     * message.
     * <BR/>See JMS specs for more information.
     *
     * @param {String} correlationId the message ID of a message being referred to
     */
    setJMSCorrelationID: function(correlationId) {
      this.correlationId= correlationId;
    },

    /**
     * Gets the correlation ID for the message.
     * @returns {String}
     */
    getJMSCorrelationID: function() {
      return this.correlationId;
    },

    /**
     * Sets the Destination object for this message.
     * <BR/>This field is set at the time the message is delivered.
     * This method can be used to change the value for a message that has
     * been received.
     *
     * @param {Destination} destination the destination for this message
     */
    setJMSDestination: function(destination) {
      this.destination= destination;
    },

    /**
     * Gets the Destination object for this message.
     * @returns {Destination}
     */
    getJMSDestination: function() {
      return this.destination;
    },

    /**
     * Sets the message ID.
     * <BR/>This field is set at the time the message is delivered.
     * This method can be used to change the value for a message that has
     * already been received.
     *
     * @param {String} messageId the ID of the message
     */
    setJMSMessageID: function(messageId) {
      this.messageId= messageId;
    },

    /**
     * Gets the message ID.
     * <BR/>The JMSMessageID header field contains a value that uniquely identifies
     * each message sent by a provider.
     * @returns {String}
     */
    getJMSMessageID: function() {
      return this.messageId;
    },

    /**
     * Sets the message timestamp.
     * <BR/>This field is set at the time the message is delivered.
     * This method can be used to change the value for a message that has
     * already been received.
     *
     * @param {Number} timestamp the timestamp for this message
     */
    setJMSTimestamp: function(timestamp) {
      this.timestamp= timestamp;
    },

    /**
     * Gets the message timestamp.
     * <BR/>The JMSTimestamp header field contains the time a message was handed off
     * to a provider to be sent.
     * <BR/>See JMS specs for more information.
     * @returns {Number}
     */
    getJMSTimestamp: function() {
      return this.timestamp;
    },

//JSDOC_IGNORE_START
    acknowledgeMessage: function() {

      // Prepare acknowledge command
      var actualMessage= {
        "dataAdapterName": this.session.connection.dataAdapterName,
        "localClientId": this.session.connection.clientId,
        "localSessionGuid": this.session.localGuid,
        "destinationType": this.destination.destinationType,
        "destinationName": this.destination.destinationName,
        "subscriptionName": this.consumer.subscriptionName,
        "durable": this.consumer.durable,
        "noLocal": this.consumer.noLocal,
        "shared": this.consumer.shared,
        "ackMode": this.session.acknowledgeMode,
        "messageKind": "ACKNOWLEDGE",
        "messageId": this.messageId
      };

      // Use session GUID as sequence identifier, to guarantee proper message serialization
      var sequenceId= this.session.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");
      this.session.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, null, true);
    },

    setProperties: function(properties) {
      this.properties= {};

      for (var property in properties)
        this.properties[property]= properties[property];
    },

    addProperties: function(properties) {
      for (var property in properties)
        this.properties[property]= properties[property];
    }
//JSDOC_IGNORE_END
  };

  Message.prototype["acknowledge"] = Message.prototype.acknowledge;
  Message.prototype["clearBody"] = Message.prototype.clearBody;
  Message.prototype["clearProperties"] = Message.prototype.clearProperties;
  Message.prototype["getJMSCorrelationID"] = Message.prototype.getJMSCorrelationID;
  Message.prototype["getJMSDeliveryMode"] = Message.prototype.getJMSDeliveryMode;
  Message.prototype["getJMSDestination"] = Message.prototype.getJMSDestination;
  Message.prototype["getJMSExpiration"] = Message.prototype.getJMSExpiration;
  Message.prototype["getJMSMessageID"] = Message.prototype.getJMSMessageID;
  Message.prototype["getJMSPriority"] = Message.prototype.getJMSPriority;
  Message.prototype["getJMSRedelivered"] = Message.prototype.getJMSRedelivered;
  Message.prototype["getJMSReplyTo"] = Message.prototype.getJMSReplyTo;
  Message.prototype["getJMSTimestamp"] = Message.prototype.getJMSTimestamp;
  Message.prototype["getJMSType"] = Message.prototype.getJMSType;
  Message.prototype["getObjectProperty"] = Message.prototype.getObjectProperty;
  Message.prototype["setJMSCorrelationID"] = Message.prototype.setJMSCorrelationID;
  Message.prototype["setJMSDeliveryMode"] = Message.prototype.setJMSDeliveryMode;
  Message.prototype["setJMSDestination"] = Message.prototype.setJMSDestination;
  Message.prototype["setJMSExpiration"] = Message.prototype.setJMSExpiration;
  Message.prototype["setJMSMessageID"] = Message.prototype.setJMSMessageID;
  Message.prototype["setJMSPriority"] = Message.prototype.setJMSPriority;
  Message.prototype["setJMSRedelivered"] = Message.prototype.setJMSRedelivered;
  Message.prototype["setJMSReplyTo"] = Message.prototype.setJMSReplyTo;
  Message.prototype["setJMSTimestamp"] = Message.prototype.setJMSTimestamp;
  Message.prototype["setJMSType"] = Message.prototype.setJMSType;
  Message.prototype["setObjectProperty"] = Message.prototype.setObjectProperty;

  export default Message;

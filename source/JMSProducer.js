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
   * Creates a {@link JMSProducer} object that works for producing messages.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session session on which this producer must work.
//JSDOC_IGNORE_END
   *
   * @exports JMSProducer
   * @class Class that works for producing messages.
   */
  var JMSProducer= function(session) {
    this.session= session;
    this.properties= {};

    this.producer= session.createProducer(null);

    this.type= null;
    this.correlationId= null;
    this.replyDestination= null;

    this.completionListener= null;
  };

  JMSProducer.prototype= {

    /**
     * Sends a message to the specified destination, using any send options,
     * message properties and message headers that have been defined on this
     * JMSProducer.<BR/>
     * This method may be called in different ways:<UL>
     * <LI>The body is a {@link Message} object: the message is sent to the
     *     specified destination, overwriting its options and properties only
     *     with those that have been set on this producer.</LI>
     * <LI>The body is a String: creates and sends a {@link TextMessage} with the body
     *     as payload, using options and properties of this producer.</LI>
     * <LI>The body is an object and classFQN is not specified : creates and
     *     sends a {@link MapMessage} with the body as payload, using options
     *     and properties of this producer.</LI>
     * <LI>The body is an object and classFQN is specified : creates and
     *     sends an {@link ObjectMessage} with the body as payload and classFQN
     *     as its fully qualified class name, using options and properties of
     *     this producer.</LI>
     * <LI>Any other type of body: assumes the body is an array of bytes, and
     *     creates and sends a {@link BytesMessage} with the body as payload,
     *     using options and properties of this producer.</LI>
     * </UL>
     * @returns {JMSProducer}
     *
     * @param {Destination} destination specifies the destination of this message.
     * @param {Message | String | Object} body Message to be sent, or payload of
     * a new message to be created and sent.
     * @param {String} classFQN in case the body is an Object and the message
     * is intended as an {@link ObjectMessage}, specifies the fully qualified
     * name of the object's class.
     */
    send: function(destination, body, classFQN) {
      var message= null;

      if ((typeof body == "object") && (body.acknowledgeMessage != undefined)) {
        message= body;

        // Set message properties
        message.addProperties(this.properties);

        if (this.type != null)
          message.setJMSType(this.type);

        if (this.correlationId != null)
          message.setJMSCorrelationID(this.correlationId);

        if (this.replyDestination != null)
          message.setJMSReplyTo(this.replyDestination);

      } else if (typeof body == "string") {

        // Prepare a text message
        message= this.session.createTextMessage(body);

        // Set message properties
        message.setProperties(this.properties);
        message.setJMSType(this.type);
        message.setJMSCorrelationID(this.correlationId);
        message.setJMSReplyTo(this.replyDestination);

      } else if ((typeof body == "object") && (classFQN == null)) {

        // Prepare a map message
        message= this.session.createMapMessage();

        for (var property in body)
          message.setObject(property, body.property);

        // Set message properties
        message.setProperties(this.properties);
        message.setJMSType(this.type);
        message.setJMSCorrelationID(this.correlationId);
        message.setJMSReplyTo(this.replyDestination);

      } else if ((typeof body == "object") && (classFQN != null)) {

        // Prepare an object message
        message= this.session.createObjectMessage(body, classFQN);

        // Set message properties
        message.setProperties(this.properties);
        message.setJMSType(this.type);
        message.setJMSCorrelationID(this.correlationId);
        message.setJMSReplyTo(this.replyDestination);

      } else {

        // Prepare a bytes message
        message= this.session.createBytesMessage();

        if (body != null)
          message.writeBytes(body);

        // Set message properties
        message.setProperties(this.properties);
        message.setJMSType(this.type);
        message.setJMSCorrelationID(this.correlationId);
        message.setJMSReplyTo(this.replyDestination);
      }

      // Send the message
      this.producer.send(message, destination, this.completionListener);

      return this;
    },

    /**
     * Sets the producer's default delivery mode.
     * @returns {JMSProducer}
     *
     * @param {String} deliveryMode specifies if by default messages must be
     * delivered persistently or not persistently. It can either be
     * <code>"PERSISTENT"</code> or <code>"NON_PERSISTENT"</code>.
     * See JMS specifications for more information.
     */
    setDeliveryMode: function(deliveryMode) {
      this.producer.setDeliveryMode(deliveryMode);

      return this;
    },

    /**
     * Gets the producer's default delivery mode.
     * @returns {String}
     */
    getDeliveryMode: function() {
      return this.producer.getDeliveryMode();
    },

    /**
     * Sets the producer's default priority.
     * @returns {JMSProducer}
     *
     * @param {Number} priority specifies the default level of priority for
     * messages sent with this producer. See JMS specifications for more
     * information.
     */
    setPriority: function(priority) {
      this.producer.setPriority(priority);

      return this;
    },

    /**
     * Gets the producer's default priority.
     * @returns {Number}
     */
    getPriority: function() {
      return this.producer.getPriority();
    },

    /**
     * Sets the default length of time in milliseconds from its dispatch time
     * that a produced message should be retained by the message system.
     * @returns {JMSProducer}
     *
     * @param {Number} timeToLive specifies the default time to live for
     * messages sent with this producer. Time to live directly influences
     * message expiration. See JMS specifications for more information.
     */
    setTimeToLive: function(timeToLive) {
      this.producer.setTimeToLive(timeToLive);

      return this;
    },

    /**
     * Gets the default length of time in milliseconds from its dispatch time
     * that a produced message should be retained by the message system.
     * @returns {Number}
     */
    getTimeToLive: function() {
      return this.producer.getTimeToLive();
    },

    /**
     * Sets the minimum length of time in milliseconds that must elapse after
     * a message is sent before the JMS provider may deliver the message to a
     * consumer.
     * @returns {JMSProducer}
     *
     * @param {Number} deliveryDelay the delivery delay in milliseconds.
     */
    setDeliveryDelay: function(deliveryDelay) {
      this.producer.setDeliveryDelay(deliveryDelay);

      return this;
    },

    /**
     * Gets the minimum length of time in milliseconds that must elapse after
     * a message is sent before the JMS provider may deliver the message to a
     * consumer.
     * @returns {Number}
     */
    getDeliveryDelay: function() {
      return this.producer.getDeliveryDelay();
    },

    /**
     * Specifies the {@link CompletionListener} to be called when the message
     * has been successfully sent, or in case an error occurs.
     * @returns {JMSProducer}
     *
     * @param {CompletionListener} completionListener the listener to be called
     * when the message has been successfully sent, or in case an error occurs.
     */
    setAsync: function(completionListener) {
      this.completionListener= completionListener;

      return this;
    },

    /**
     * Get the {@link CompletionListener} that has previously been configured.
     * @returns {CompletionListener}
     */
    getAsync: function() {
      return this.completionListener;
    },

    /**
     * Specifies that messages sent using this JMSProducer will have the
     * specified property set to the specified value.
     * @returns {JMSProducer}
     *
     * @param {String} name the name of the property.
     * @param {Object} value the object property value to set.
     */
    setObjectProperty: function(name, value) {
      this.properties[name]= value;

      return this;
    },

    /**
     * Clears any message properties set on this JMSProducer.
     * @returns {JMSProducer}
     */
    clearProperties: function() {
      this.properties= {};

      return this;
    },

    /**
     * Indicates whether a message property with the specified name has been
     * set on this JMSProducer.
     * @returns {Boolean}
     *
     * @param {String} name the name of the property.
     */
    propertyExists: function(name) {
      return (this.properties[name] != null);
    },

    /**
     * Returns the message property with the specified name that has been set
     * on this JMSProducer.
     * @returns {Object}
     *
     * @param {String} name the name of the property.
     */
    getObjectProperty: function(name) {
      return this.properties[name];
    },

    /**
     * Specifies that messages sent using this JMSProducer will have their
     * JMSCorrelationID header value set to the specified correlation ID.
     * @returns {JMSProducer}
     *
     * @param {String} correlationId the message ID of a message being referred to.
     */
    setJMSCorrelationID: function(correlationID) {
      this.correlationId= correlationID;

      return this;
    },

    /**
     * Returns the JMSCorrelationID header value that has been set on this
     * JMSProducer.
     * @returns {String}
     */
    getJMSCorrelationID: function() {
      return this.correlationId;
    },

    /**
     * Specifies that messages sent using this JMSProducer will have their
     * JMSType header value set to the specified message type.
     * @returns {JMSProducer}
     *
     * @param {String} type the message type
     */
    setJMSType: function(type) {
      this.type= type;

      return this;
    },

    /**
     * Returns the JMSType header value that has been set on this JMSProducer.
     * @returns {String}
     */
    getJMSType: function() {
      return this.type;
    },

    /**
     * Specifies that messages sent using this JMSProducer will have their
     * JMSReplyTo header value set to the specified Destination object.
     * @returns {JMSProducer}
     *
     * @param {Destination} replyTo Destination to which to send a response
     * to this message.
     */
    setJMSReplyTo: function(replyTo) {
      this.replyDestination= replyTo;

      return this;
    },

    /**
     * Returns the JMSReplyTo header value that has been set on this
     * JMSProducer.
     * @returns {Destination}
     */
    getJMSReplyTo: function() {
      return this.replyDestination;
    }
  };

  JMSProducer.prototype["send"] = JMSProducer.prototype.send;
  JMSProducer.prototype["setDeliveryMode"] = JMSProducer.prototype.setDeliveryMode;
  JMSProducer.prototype["getDeliveryMode"] = JMSProducer.prototype.getDeliveryMode;
  JMSProducer.prototype["setPriority"] = JMSProducer.prototype.setPriority;
  JMSProducer.prototype["getPriority"] = JMSProducer.prototype.getPriority;
  JMSProducer.prototype["setTimeToLive"] = JMSProducer.prototype.setTimeToLive;
  JMSProducer.prototype["getTimeToLive"] = JMSProducer.prototype.getTimeToLive;
  JMSProducer.prototype["setDeliveryDelay"] = JMSProducer.prototype.setDeliveryDelay;
  JMSProducer.prototype["getDeliveryDelay"] = JMSProducer.prototype.getDeliveryDelay;
  JMSProducer.prototype["setAsync"] = JMSProducer.prototype.setAsync;
  JMSProducer.prototype["getAsync"] = JMSProducer.prototype.getAsync;
  JMSProducer.prototype["setObjectProperty"] = JMSProducer.prototype.setObjectProperty;
  JMSProducer.prototype["clearProperties"] = JMSProducer.prototype.clearProperties;
  JMSProducer.prototype["propertyExists"] = JMSProducer.prototype.propertyExists;
  JMSProducer.prototype["getObjectProperty"] = JMSProducer.prototype.getObjectProperty;
  JMSProducer.prototype["setJMSCorrelationID"] = JMSProducer.prototype.setJMSCorrelationID;
  JMSProducer.prototype["getJMSCorrelationID"] = JMSProducer.prototype.getJMSCorrelationID;
  JMSProducer.prototype["setJMSType"] = JMSProducer.prototype.setJMSType;
  JMSProducer.prototype["getJMSType"] = JMSProducer.prototype.getJMSType;
  JMSProducer.prototype["setJMSReplyTo"] = JMSProducer.prototype.setJMSReplyTo;
  JMSProducer.prototype["getJMSReplyTo"] = JMSProducer.prototype.getJMSReplyTo;

  export default JMSProducer;

import TextMessage from "./TextMessage";
import ObjectMessage from "./ObjectMessage";
import MapMessage from "./MapMessage";
import BytesMessage from "./BytesMessage";
import Topic from "./Topic";
import Queue from "./Queue";
import IntArrayConverter from "./IntArrayConverter";
import {Subscription} from "lightstreamer-client-stub";
import IllegalStateException from "./IllegalStateException";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link MessageConsumer} object that receives messages from a
   * specific {@link Destination}.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this consumer will
   * receive messages on.
   * @param {Destination} destination specifies the destination this
   * consumer will receive messages from.
   * @param {String} subscriptionName specifies the optional name of
   * a durable subscription. Should be specified only if the
   * {@link Destination} is a topic and the consumer is meant to be a
   * durable subscriber.
   * @param {Boolean} durable specifies if this consumer is for a durable subscription.
   * @param {Boolean} noLocal specifies if this consumer must receive or not messages
   * published by its own connection.
   * @param {Boolean} shared specifies if this consumer is shared between multiple
   * connections.
   * @param {String} messageSelector specifies the optional selector, e.g.
   * the rule to be applied to messages being received to filter them or not.
   * See JMS specifications for more information on message selectors.
//JSDOC_IGNORE_END
   *
   * @exports MessageConsumer
   * @class Class that receives messages from a specific
   * {@link Destination}. The consumer will deliver messages asynchronously to its
   * {@link MessageListener} as soon as it is set.
   */
  var MessageConsumer= function(session, destination, subscriptionName, durable, noLocal, shared, messageSelector) {
    this.session= session;
    this.destination= destination;
    this.subscriptionName= subscriptionName;
    this.durable= durable;
    this.noLocal= noLocal;
    this.shared= shared;
    this.messageSelector= messageSelector;
    this.messageListener= null;

    this.messageQueue= [];
    this.open= true;

    this.group= {
      "dataAdapterName": this.session.connection.dataAdapterName,
      "localClientId": this.session.connection.clientId,
      "localSessionGuid": this.session.localGuid,
      "destinationType": this.destination.destinationType,
      "destinationName": this.destination.destinationName,
      "subscriptionName": this.subscriptionName,
      "durable": this.durable,
      "noLocal": this.noLocal,
      "shared": this.shared,
      "ackMode": this.session.acknowledgeMode
    };

    if (this.messageSelector != null) {
      this.group["selector"] = encodeURIComponent(this.messageSelector);
    }

    this.subscription= new Subscription("RAW", JSON.stringify(this.group),
      [ "dataAdapterName", "destinationType", "destinationName", "replyDestinationType",
      "replyDestinationName", "messageRedelivered", "messageId", "messageKind",
      "type", "priority", "expiration", "deliveryMode", "correlationId",
      "messageProperties", "classFQN", "payload", "timestamp", "deliveryTime" ]);

    this.subscription.setDataAdapter(this.session.connection.dataAdapterName);
    this.subscription.setRequestedSnapshot("no");

    var that= this;
    this.subscription.addListener({
      onItemUpdate: function(updateInfo) {
        try {
          var replyDestinationType= updateInfo.getValue("replyDestinationType");
          var replyDestinationName= updateInfo.getValue("replyDestinationName");
          var messageId= updateInfo.getValue("messageId");
          var messageKind= updateInfo.getValue("messageKind");
          var messageRedelivered= (updateInfo.getValue("messageRedelivered") == "true");
          var messageProperties= updateInfo.getValue("messageProperties");
          var classFQN= updateInfo.getValue("classFQN");
          var payload= updateInfo.getValue("payload");
          var timestamp= updateInfo.getValue("timestamp");
          var type= updateInfo.getValue("type");
          var expiration= updateInfo.getValue("expiration");
          var priority= updateInfo.getValue("priority");
          var correlationId= updateInfo.getValue("correlationId");
          var deliveryMode= updateInfo.getValue("deliveryMode");
          var deliveryTime= updateInfo.getValue("deliveryTime");

          var message= null;
          switch (messageKind) {
            case "TEXT_MSG":
              message= new TextMessage(that.session);
              message.body= payload;
              break;

            case "OBJECT_MSG":
              message= new ObjectMessage(that.session);
              message.body= JSON.parse(payload);
              message.classFQN= classFQN;
              break;

            case "MAP_MSG":
              message= new MapMessage(that.session);
              message.body= JSON.parse(payload);
              break;

            case "BYTES_MSG":
              message= new BytesMessage(that.session);
              message.body= IntArrayConverter.fromBase64(payload);
              message.readMode= true;
              break;

            default:
              break;
          }

          if (message == null)
            return;

          message.messageId= messageId;
          message.properties= (messageProperties.length > 0) ? JSON.parse(messageProperties) : {};
          message.destination= that.destination;
          message.consumer= that;
          message.timestamp= timestamp;
          message.redelivered= messageRedelivered;
          message.deliveryMode= deliveryMode;
          message.priority= priority;
          message.type= type;
          message.expiration= expiration;
          message.correlationId= correlationId;

          if (deliveryTime != null)
            message.setJMSDeliveryTime(parseInt(deliveryTime));

          if (replyDestinationType != null) {
            if (replyDestinationType == "TOPIC") {
              message.replyDestination= new Topic(replyDestinationName);

            } else if (replyDestinationType == "QUEUE") {
              message.replyDestination= new Queue(replyDestinationName);
            }
          }

          if (that.messageListener != null) {
            try {

              // Call client callback
              that.messageListener["onMessage"](message);

            } catch (err) {

              // Log the error
              try {
                console.log("MessageConsumer: exception while forwarding message to the listener: " + err);
              } catch (err2) {}
            }

            // Apply acknowledgement
            that.applyAcknowledgeMode(message);

          } else {

            // Add message to local queue
            that.messageQueue.push(message);
          }

        } catch (err) {

          // Log the error
          try {
            console.log("MessageConsumer: exception while processing message: " + err);
          } catch (err2) {}
        }
      }
    });
  };

  MessageConsumer.prototype= {

    /**
     * Gets this message consumer's message selector expression.
     * @returns {String}
     */
    getMessageSelector: function() {
      return this.messageSelector;
    },

    /**
     * Gets the message consumer's {@link MessageListener}.
     * @returns {MessageListener}
     */
    getMessageListener: function() {
      return this.messageListener;
    },

    /**
     * Sets the consumer's {@link MessageListener}. As soon as it is set, any
     * message that is received will be forwarded to the listener in its
     * {@link MessageListener#onMessage} event.
     *
     * @param {MessageListener} messageListener the message listener meant
     * to receive messages from this consumer.
     */
    setMessageListener: function(messageListener) {
      if (!this.open)
        throw new IllegalStateException("Consumer has been closed");

      this.messageListener= messageListener;

      // Send read command if session is running
      if (this.session.running)
        this.readNext();
    },

    /**
     * Receives the next message if one is immediately available.
     * @returns {Message}
     */
     receiveNoWait: function() {
      if (!this.open)
        throw new IllegalStateException("Consumer has been closed");

      if (this.messageQueue.length > 0) {

        // Get first message from local queue
        var messages= this.messageQueue.splice(0, 1);
        var message= messages[0];

        // Apply acknowledge mode
        this.applyAcknowledgeMode(message);

        // Return the message
        return message;

      } else {

        // Send read command if session is running
        if (this.session.running)
          this.readNext();
      }
     },

//JSDOC_IGNORE_START
    /*
     * Internal function to apply acknowledge mode and act accordingly
     * on a specific message
     */
    applyAcknowledgeMode: function(message) {
      switch (this.session.acknowledgeMode) {
        case "PRE_ACK":

          // Nothing to do, the message has already been
          // acknowledged on the adapter
          break;

        case "AUTO_ACK":

          // Ask to read the next message, the message
          // will be acknowledged automatically by the adapter
          this.readNext();
          break;

        case "CLIENT_ACK":

          // Save message for later acknowledge and read the next message
          this.session.messagesToBeAcknowledged.push(message);
          this.readNext();
          break;

        case "TRANSACTED":

          // Ask to read the next message, the message
          // will be acknowledged upon commit
          this.readNext();
          break;

        case "DUPS_OK":

          // Message will be acknowledge at lazy time
          this.session.messagesToBeAcknowledged.push(message);

          // Sets the timer just once
          var that= this;
          if (this.session.acknowledgeTimer == null) {
            this.session.acknowledgeTimer= setTimeout(function() {
              that.session.acknowledgeMessages();
            }, 150);
          }
          break;

        case "INDIVIDUAL_ACK":

          // Save message for later acknowledge
          this.session.messagesToBeAcknowledged.push(message);
          break;
      }
    },

    /*
     * Internal function to stimulate reading of next message
     * for this same destination
     */
    readNext: function() {

      // Avoid a "consumer closed" async exception if
      // the consumer has been closed already
      if (!this.open)
        return;

      // Some acknowledge modes do not need a read command
      switch (this.session.acknowledgeMode) {
        case "AUTO_ACK":
        case "CLIENT_ACK":
        case "TRANSACTED": {

          // Prepare read command
          var actualMessage= {
            "dataAdapterName": this.session.connection.dataAdapterName,
            "localClientId": this.session.connection.clientId,
            "localSessionGuid": this.session.localGuid,
            "destinationType": this.destination.destinationType,
            "destinationName": this.destination.destinationName,
            "subscriptionName": this.subscriptionName,
            "durable": this.durable,
            "noLocal": this.noLocal,
            "shared": this.shared,
            "ackMode": this.session.acknowledgeMode,
            "messageKind": "READ_NEXT"
          };

          // Use session GUID as sequence identifier, to guarantee proper message serialization
          var sequenceId= this.session.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");
          this.session.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, null, true);
          break;
        }
      }
    },
//JSDOC_IGNORE_END

    /**
     * Closes the consumer. Once closed, the consumer will not deliver
     * any more messages.
     * <BR/><B>Implementation note</B>: underlying subscription is
     * unsubscribed and deleted.
     */
    close: function() {
      if (!this.open)
        return;

      this.open= false;

      this.messageListener= null;

      if (this.subscription.isSubscribed())
        this.session.connection.lsClient.unsubscribe(this.subscription);

      this.subscription= null;

      // Remove consumer from session's consumer list
      var index= this.session.consumers.indexOf(this);
      if (index >= 0)
        this.session.consumers.splice(index, 1);
    },

//JSDOC_IGNORE_START
    start: function() {
      if (!this.open)
        throw new IllegalStateException("Consumer has been closed");

      if (!this.subscription.isSubscribed())
        this.session.connection.lsClient.subscribe(this.subscription);

      // Send read command
      if (this.messageListener != null)
        this.readNext();
    },

    stop: function() {
      if (!this.open)
        throw new IllegalStateException("Consumer has been closed");

      if (this.subscription.isSubscribed())
        this.session.connection.lsClient.unsubscribe(this.subscription);
    },

    clearQueuedMessages: function() {
      this.messageQueue= [];
    }
//JSDOC_IGNORE_END
  };

  MessageConsumer.prototype["close"] = MessageConsumer.prototype.close;
  MessageConsumer.prototype["getMessageListener"] = MessageConsumer.prototype.getMessageListener;
  MessageConsumer.prototype["getMessageSelector"] = MessageConsumer.prototype.getMessageSelector;
  MessageConsumer.prototype["receiveNoWait"] = MessageConsumer.prototype.receiveNoWait;
  MessageConsumer.prototype["setMessageListener"] = MessageConsumer.prototype.setMessageListener;

  export default MessageConsumer;

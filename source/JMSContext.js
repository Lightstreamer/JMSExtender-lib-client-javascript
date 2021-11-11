import Message from "./Message";
import TextMessage from "./TextMessage";
import ObjectMessage from "./ObjectMessage";
import MapMessage from "./MapMessage";
import BytesMessage from "./BytesMessage";
import Topic from "./Topic";
import Queue from "./Queue";
import TemporaryTopic from "./TemporaryTopic";
import TemporaryQueue from "./TemporaryQueue";
import JMSConsumer from "./JMSConsumer";
import JMSProducer from "./JMSProducer";
import JMSException from "./JMSException";
import IllegalStateException from "./IllegalStateException";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link JMSContext} object that works as a simplified context
   * for producing and consuming messages.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Connection} connection connection on which the context must
   * work.
   * @param {Session} session session on which the context must work.
//JSDOC_IGNORE_END
   *
   * @exports JMSContext
   * @class Class that works as a simplified context for producing
   * and consuming messages.
   */
  var JMSContext= function(connection, session) {
    this.connection= connection;
    this.session= session;

    this.used= false;
    this.autoStart= true;
  };

  JMSContext.prototype= {

    /**
     * Creates a new {@link JMSContext} object based on the same connection
     * this JMSContext is based on.
     *
     * @param {String} sessionMode specifies the session mode. Can be one of
     * the following: <code>"TRANSACTED"</code>, <code>"PRE_ACK"</code>,
     * <code>"AUTO_ACK"</code>, <code>"CLIENT_ACK"</code>,
     * <code>"DUPS_OK"</code> or <code>"INDIVIDUAL_ACK"</code>.
     * See JMS Extender documentation for more information.
     * @returns {JMSContext}
     */
    createContext: function(sessionMode) {

      // Create the session
      var session= this.connection.createSession(sessionMode);

      // Wrap new session and current connection in a new context
      return new JMSContext(this.connection, session);
    },

    /**
     * Creates a {@link JMSProducer} to send messages to a destination. The
     * destination is specified on the producer itself.
     * @returns {JMSProducer}
     */
    createProducer: function() {
      return new JMSProducer(this.session);
    },

    /**
     * Gets the client identifier for the connection this JMSContext is based on.
     * See JMS specifications for more information.
     * @returns {String}
     */
    getClientID: function() {
      return this.connection.getClientID();
    },

    /**
     * Sets the client identifier for the connection this JMSContext is based on.
     * See JMS specifications for more information.
     * <BR/><B>Implementation note</B>: scalability considerations apply
     * when the client ID is set, see JMS Extender documentation.
     *
     * @param {String} clientID the unique client identifier
     */
    setClientID: function(clientID) {
      if (this.used)
          throw new IllegalStateException("The context has already been used");

      this.connection.setClientIDInternal(clientID);
    },

    /**
     * Gets the {@link ExceptionListener} object for this connection.
     * @returns {ExceptionListener}
     */
    getExceptionListener: function() {
      return this.connection.getExceptionListener();
    },

    /**
     * Sets an exception listener for the connection this JMSContext is based on.
     * Many common JMS exceptions will be delivered asynchronously through this listener.
     *
     * @param {ExceptionListener} exceptionListener the exception listener
     * meant to receive exceptions.
     */
    setExceptionListener: function(listener) {
      this.connection.setExceptionListener(listener);
    },

    /**
     * Starts (or restarts) the delivery of incoming messages for the connection
     * this JMSContext is based on. A call to {@link JMSContext#start} on a
     * context that has already been started is ignored.
     */
    start: function() {
      this.used= true;

      // Start the underlying connection
      this.connection.start();
    },

    /**
     * Temporarily stops the delivery of incoming messages for the connection
     * this JMSContext is based on. Delivery can be restarted using {@link JMSContext#start}
     * method. A call to {@link JMSContext#stop} on a context that has already
     * been stopped is ignored.
     * <BR/>Stopping a connection has no effect on its ability to send
     * messages.
     * <BR/><B>Implementation note</B>: underlying subscriptions are
     * unsubscribed but their item names are kept for a later restart.
     */
    stop: function() {
      this.used= true;

      // Stop the underlying connection
      this.connection.stop();
    },

    /**
     * Specifies whether the connection this JMSContext is based on will be
     * started automatically when a consumer is created. This is the default
     * behaviour, and it may be disabled by calling this method with a value
     * of <code>false</code>.
     *
     * @param {Boolean} autoStart Whether the connection this JMSContext is
     * based on will be automatically started when a consumer is created.
     */
    setAutoStart: function(autoStart) {
      this.autoStart= autoStart;
    },

    /**
     * Returns whether the connection this JMSContext is based on will be
     * started automatically when a consumer is created.
     * @returns {Boolean}
     */
    getAutoStart: function() {
      return this.autoStart;
    },

    /**
     * Closes the context. All message producers and consumers will be
     * stopped and their subsequent use will cause an
     * {@link IllegalStateException}. A call to {@link JMSContext#close} on a
     * context that has already been closed is ignored.
     * <BR/><B>Implementation note</B>: underlying subscriptions are
     * unsubscribed and deleted. If the connection was created
     * through a ConnectionFactory the underlying {@link EXTERNAL_APIDOC_REFERENCE/LightstreamerClient.html|LightstreamerClient}
     * connection is also disconnected. This means any message being sent
     * (JMS messages, acknowledges, unsubscriptions, etc.) may get lost if the
     * library did not have enough time to deliver them.
     */
    close: function() {
      this.used= true;

      // Close the underlying connection
      this.connection.close();
    },

    /**
     * Creates a new empty {@link BytesMessage}.
     * @returns {BytesMessage}
     */
    createBytesMessage: function() {
      this.used= true;

      return this.session.createBytesMessage();
    },

    /**
     * Creates a new empty {@link MapMessage}.
     * @returns {MapMessage}
     */
    createMapMessage: function() {
      this.used= true;

      return this.session.createMapMessage();
    },

    /**
     * Creates a {@link Message} object. The {@link Message} class is the root class
     * of all JMS messages. A Message object holds all the standard message header
     * information. It can be sent when a message containing only header information
     * is sufficient.
     * @returns {Message}
     */
    createMessage: function() {
      this.used= true;

      return this.session.createMessage();
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
      this.used= true;

      return this.session.createObjectMessage(object);
    },

    /**
     * Creates a new {@link TextMessage} with the specified string as its
     * payload.
     * @returns {TextMessage}
     *
     * @param {String} text desired string payload for the message.
     */
    createTextMessage: function(text) {
      this.used= true;

      return this.session.createTextMessage(text);
    },

    /**
     * Indicates whether the context is in transacted mode.
     * @returns {Boolean}
     */
    getTransacted: function() {
      return this.session.getTransacted();
    },

    /**
     * Returns the session mode of the context. The session mode is
     * set at the time that the context is created.
     * @returns {String}
     */
    getSessionMode: function() {
      return this.session.getAcknowledgeMode();
    },

    /**
     * Commits all messages done in this transaction.
     */
    commit: function() {
      this.used= true;

      this.session.commit();
    },

    /**
     * Rolls back any messages done in this transaction.
     */
    rollback: function() {
      this.used= true;

      this.session.rollback();
    },

    /**
     * Stops message delivery in this context, and restarts message
     * delivery with the oldest unacknowledged message. Redelivered
     * messages do not have to be delivered in exactly their original
     * delivery order. See JMS specifications for more information.
     */
    recover: function() {
      this.used= true;

      this.session.recover();
    },

    /**
     * Creates a {@link JMSConsumer} for the specified destination, using a message
     * selector.
     * @returns {JMSConsumer}
     *
     * @param {Destination} destination destination from which the consumer must
     * receive messages.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     * @param {Boolean} noLocal if true, and the destination is a topic, then
     * the JMSConsumer will not receive messages published to the topic by its
     * own connection. The default value of this argument is false.
     */
    createConsumer: function(destination, messageSelector, noLocal) {
      this.used= true;

      // Create the consumer
      var consumer= this.session.createConsumer(destination, messageSelector, noLocal);

      // Check auto-start
      if (this.autoStart)
        this.start();

      return new JMSConsumer(consumer);
    },

    /**
     * Creates a new {@link Queue} object with the specified queue name.
     * @returns {Queue}
     *
     * @param {String} queueName name of the queue.
     */
    createQueue: function(queueName) {
      this.used= true;

      return this.session.createQueue(queueName);
    },

    /**
     * Creates a new {@link Topic} object with the specified topic name.
     * @returns {Topic}
     *
     * @param {String} topicName name of the topic.
     */
    createTopic: function(topicName) {
      this.used= true;

      return this.session.createTopic(topicName);
    },

    /**
     * Creates a new durable {@link JMSConsumer} object for receiving
     * messages on a specific {@link Topic}. See JMS specifications for
     * differences between durable and non durable consumers.
     * @returns {JMSConsumer}
     *
     * @param {Topic} topic topic from which the consumer must receive
     * messages.
     * @param {String} name name of the durable subscription. See JMS
     * specifications for more information.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     * @param {Boolean} noLocal if true the JMSConsumer will not receive
     * messages published to the topic by its own connection. The default
     * value of this argument is false.
     */
    createDurableConsumer: function(topic, name, messageSelector, noLocal) {
      this.used= true;

      // Create the consumer
      var consumer= this.session.createDurableConsumer(topic, name, messageSelector, noLocal);

      // Check auto-start
      if (this.autoStart)
        this.start();

      return new JMSConsumer(consumer);
    },

    /**
     * Creates a new shared durable {@link JMSConsumer} object for receiving
     * messages on a specific {@link Topic}. See JMS specifications for
     * differences between durable, non durable, shared and non shared consumers.
     * @returns {JMSConsumer}
     *
     * @param {Topic} topic topic from which the consumer must receive
     * messages.
     * @param {String} name name of the shared durable subscription. See JMS
     * specifications for more information.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     */
    createSharedDurableConsumer: function(topic, name, messageSelector) {
      this.used= true;

      // Create the consumer
      var consumer= this.session.createSharedDurableConsumer(topic, name, messageSelector);

      // Check auto-start
      if (this.autoStart)
        this.start();

      return new JMSConsumer(consumer);
    },

    /**
     * Creates a new shared {@link JMSConsumer} object for receiving
     * messages on a specific {@link Topic}. See JMS specifications for
     * differences between shared and non shared consumers.
     * @returns {JMSConsumer}
     *
     * @param {Topic} topic topic from which the consumer must receive
     * messages.
     * @param {String} sharedSubscriptionName name of the shared subscription.
     * See JMS specifications for more information.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     */
    createSharedConsumer: function(topic, sharedSubscriptionName, messageSelector) {
      this.used= true;

      // Create the consumer
      var consumer= this.session.createSharedConsumer(topic, sharedSubscriptionName, messageSelector);

      // Check auto-start
      if (this.autoStart)
        this.start();

      return new JMSConsumer(consumer);
    },

    /**
     * Creates a {@link TemporaryQueue} object. Its lifetime will be that of the
     * {@link Connection} this context is based, unless it is deleted earlier.
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
      this.used= true;

      return this.session.createTemporaryQueue(onTempQueueCreated, onTempQueueFailed);
    },

    /**
     * Creates a {@link TemporaryTopic} object. Its lifetime will be that of the
     * {@link Connection} this context is based on, unless it is deleted earlier.
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
      this.used= true;

      return this.session.createTemporaryTopic(onTempTopicCreated, onTempTopicFailed);
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
      this.used= true;

      this.session.unsubscribe(name);
    },

    /**
     * Acknowledges all messages consumed by the JMSContext's session. This
     * method is for use when the session has an acknowledgement mode of
     * "CLIENT_ACK" or "INDIVIDUAL_ACK". If the session is transacted or has
     * another acknowledgement mode calling this method has no effect.<BR/>
     * This method has identical behaviour to the {@link Message#acknowledge}
     * method on {@link Message}.
     */
    acknowledge: function() {
      this.used= true;

      this.session.acknowledgeMessages();
    }
  };

  JMSContext.prototype["createContext"] = JMSContext.prototype.createContext;
  JMSContext.prototype["createProducer"] = JMSContext.prototype.createProducer;
  JMSContext.prototype["getClientID"] = JMSContext.prototype.getClientID;
  JMSContext.prototype["setClientID"] = JMSContext.prototype.setClientID;
  JMSContext.prototype["getExceptionListener"] = JMSContext.prototype.getExceptionListener;
  JMSContext.prototype["setExceptionListener"] = JMSContext.prototype.setExceptionListener;
  JMSContext.prototype["start"] = JMSContext.prototype.start;
  JMSContext.prototype["stop"] = JMSContext.prototype.stop;
  JMSContext.prototype["setAutoStart"] = JMSContext.prototype.setAutoStart;
  JMSContext.prototype["getAutoStart"] = JMSContext.prototype.getAutoStart;
  JMSContext.prototype["close"] = JMSContext.prototype.close;
  JMSContext.prototype["createBytesMessage"] = JMSContext.prototype.createBytesMessage;
  JMSContext.prototype["createMapMessage"] = JMSContext.prototype.createMapMessage;
  JMSContext.prototype["createMessage"] = JMSContext.prototype.createMessage;
  JMSContext.prototype["createObjectMessage"] = JMSContext.prototype.createObjectMessage;
  JMSContext.prototype["createTextMessage"] = JMSContext.prototype.createTextMessage;
  JMSContext.prototype["getTransacted"] = JMSContext.prototype.getTransacted;
  JMSContext.prototype["getSessionMode"] = JMSContext.prototype.getSessionMode;
  JMSContext.prototype["commit"] = JMSContext.prototype.commit;
  JMSContext.prototype["rollback"] = JMSContext.prototype.rollback;
  JMSContext.prototype["recover"] = JMSContext.prototype.recover;
  JMSContext.prototype["createConsumer"] = JMSContext.prototype.createConsumer;
  JMSContext.prototype["createQueue"] = JMSContext.prototype.createQueue;
  JMSContext.prototype["createTopic"] = JMSContext.prototype.createTopic;
  JMSContext.prototype["createDurableConsumer"] = JMSContext.prototype.createDurableConsumer;
  JMSContext.prototype["createSharedDurableConsumer"] = JMSContext.prototype.createSharedDurableConsumer;
  JMSContext.prototype["createSharedConsumer"] = JMSContext.prototype.createSharedConsumer;
  JMSContext.prototype["createTemporaryQueue"] = JMSContext.prototype.createTemporaryQueue;
  JMSContext.prototype["createTemporaryTopic"] = JMSContext.prototype.createTemporaryTopic;
  JMSContext.prototype["unsubscribe"] = JMSContext.prototype.unsubscribe;
  JMSContext.prototype["acknowledge"] = JMSContext.prototype.acknowledge;

  export default JMSContext;

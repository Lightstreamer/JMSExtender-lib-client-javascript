import Inheritance from "./Inheritance";
import Session from "./Session";
import Queue from "./Queue";
import QueueReceiver from "./QueueReceiver";
import QueueSender from "./QueueSender";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link QueueSession} object that works as a context for sending
   * and receiving messages on a {@link Queue}.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {QueueConnection} queueConnection connection on which the session
   * must wotk.
   * @param {Boolean} transacted flag that specifies if the session is
   * transacted.
   * @param {String} acknowledgeMode specifies the type of acknowledge
   * to be used for messages. Can be <code>"PRE_ACK"</code>, <code>"AUTO_ACK"</code>,
   * <code>"CLIENT_ACK"</code>, <code>"DUPS_OK"</code> or <code>"INDIVIDUAL_ACK"</code>.
   * See JMS Extender documentation for more information.
//JSDOC_IGNORE_END
   *
   * @exports QueueSession
   * @class Class that works as a context for sending
   * and receiving messages on a {@link Queue}.
   * @extends Session
   */
  var QueueSession= function(queueConnection, transacted, acknowledgeMode) {
    this._callSuperConstructor(QueueSession, [queueConnection, transacted, acknowledgeMode]);
  };

  QueueSession.prototype= {

    /**
     * Creates a new {@link QueueReceiver} object for receiving messages on
     * a specific {@link Queue}.
     * @returns {QueueReceiver}
     *
     * @param {Queue} queue queue from which the receiver must receive
     * messages.
     * @param {String} messageSelector specifies the optional selector,
     * e.g. the rule to be applied to messages being received to filter
     * them or not. See JMS specifications for more information on message
     * selectors.
     */
    createReceiver: function(queue, messageSelector) {
      var receiver= new QueueReceiver(this, queue, messageSelector, null);
      this.consumers.push(receiver);

      if (this.running)
        receiver.start();

      return receiver;
    },

    /**
     * Creates a new {@link QueueSender} object for sending messages on
     * a specific {@link Queue}.
     * @returns {QueueSender}
     *
     * @param {Queue} queue queue to which the sender must send messages.
     */
    createSender: function(queue) {

      // Default QoS values
      var defaultDeliveryMode= "PERSISTENT";
      var defaultPriority= 4;
      var defaultTimeToLive= 0;

      var sender= new QueueSender(this, queue, defaultDeliveryMode, defaultPriority, defaultTimeToLive);
      this.producers.push(sender);

      return sender;
    }
  };

  QueueSession.prototype["createReceiver"] = QueueSession.prototype.createReceiver;
  QueueSession.prototype["createSender"] = QueueSession.prototype.createSender;

  Inheritance(QueueSession, Session);
  export default QueueSession;

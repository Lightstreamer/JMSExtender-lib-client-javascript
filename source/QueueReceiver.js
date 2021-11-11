import Inheritance from "./Inheritance";
import MessageConsumer from "./MessageConsumer";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link QueueReceiver} object that receives messages from a
   * specific {@link Queue}.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this receiver will
   * receive messages on.
   * @param {Queue} queue specifies the queue this
   * receiver will receive messages from.
   * @param {String} messageSelector specifies the optional selector, e.g.
   * the rule to be applied to messages being received to filter them or not.
   * See JMS specifications for more information on message selectors.
   * @param {MessageListener} messageListener is the listener that will
   * asynchronously receive messages from this queue.
//JSDOC_IGNORE_END
   *
   * @exports QueueReceiver
   * @class Class that receives messages from a specific {@link Queue}.
   * The receiver will deliver messages asynchronously to its
   * {@link MessageListener}.
   * @extends MessageConsumer
   */
  var QueueReceiver= function(session, queue, messageSelector, messageListener) {
    this._callSuperConstructor(QueueReceiver, [session, queue, null, false, false, false, messageSelector]);
    this.messageListener= messageListener;
  };

  Inheritance(QueueReceiver, MessageConsumer);
  export default QueueReceiver;

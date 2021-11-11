import Inheritance from "./Inheritance";
import MessageProducer from "./MessageProducer";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link QueueSender} object that sends messages to a
   * specific {@link Queue}.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this sender will
   * send messages on.
   * @param {Queue} queue specifies the destination this
   * sender will send messages to.
   * @param {String} deliveryMode specifies if by default messages must be
   * delivered persistently or not persistently. It can either be
   * <code>"PERSISTENT"</code> or <code>"NON_PERSISTENT"</code>.
   * See JMS specifications for more information.
   * @param {Number} priority specifies the default level of priority for
   * messages sent with this sender. See JMS specifications for more
   * information.
   * @param {Number} timeToLive specifies the default time to live for
   * messages sent with this sender. Time to live directly influences
   * message expiration. See JMS specifications for more information.
//JSDOC_IGNORE_END
   *
   * @exports QueueSender
   * @class Class that sends messages to a specific {@link Queue}.
   * @extends MessageProducer
   */
  var QueueSender= function(session, queue, deliveryMode, priority, timeToLive) {
    this._callSuperConstructor(QueueSender, [session, queue, deliveryMode, priority, timeToLive]);
  };

  Inheritance(QueueSender, MessageProducer);
  export default QueueSender;

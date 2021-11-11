import Inheritance from "./Inheritance";
import MessageProducer from "./MessageProducer";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link TopicPublisher} object that sends messages to a
   * specific {@link Topic}.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this publisher will
   * send messages on.
   * @param {Topic} topic specifies the destination this
   * publisher will send messages to.
   * @param {String} deliveryMode specifies if by default messages must be
   * delivered persistently or not persistently. It can either be
   * <code>"PERSISTENT"</code> or <code>"NON_PERSISTENT"</code>.
   * See JMS specifications for more information.
   * @param {Number} priority specifies the default level of priority for
   * messages sent with this publisher. See JMS specifications for more
   * information.
   * @param {Number} timeToLive specifies the default time to live for
   * messages sent with this publisher. Time to live directly influences
   * message expiration. See JMS specifications for more information.
//JSDOC_IGNORE_END
   *
   * @exports TopicPublisher
   * @class Class that sends messages to a specific {@link Topic}.
   * @extends MessageProducer
   */
  var TopicPublisher= function(session, topic, deliveryMode, priority, timeToLive) {
    this._callSuperConstructor(TopicPublisher, [session, topic, deliveryMode, priority, timeToLive]);
  };

  TopicPublisher.prototype= {

    /**
     * Publishes a message. Will use {@link TopicPublisher}'s default delivery
     * mode, priority and time to live if message parameters are not set.
     * <BR/><B>Implementation note</B>: this method is actually an alias for {@link MessageProducer#send}.
     *
     * @param {Message} message the message to be published.
     */
    publish: function(message) {
      this.send(message);
    }
  };

  TopicPublisher.prototype["publish"] = TopicPublisher.prototype.publish;

  Inheritance(TopicPublisher, MessageProducer);
  export default TopicPublisher;

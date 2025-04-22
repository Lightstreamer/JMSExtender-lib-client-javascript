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

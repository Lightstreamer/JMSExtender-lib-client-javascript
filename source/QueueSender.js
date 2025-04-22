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

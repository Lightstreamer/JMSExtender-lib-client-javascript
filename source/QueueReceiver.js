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

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
import Destination from "./Destination";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link Queue} object that holds the name of a JMS queue.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {String} queueName name of the queue.
//JSDOC_IGNORE_END
   *
   * @exports Queue
   * @class A {@link Queue} object holds the name of a JMS queue. Queues offer
   * a point-to-point communication paradigm, where each message is received
   * by at most one receiver, even if more receivers are waiting on the same
   * queue. The exact policies of message dispatching depend on the specific
   * JMS broker.
   * @extends Destination
   */
  var Queue= function(queueName) {
    this._callSuperConstructor(Queue, ["QUEUE", queueName]);
  };

  Queue.prototype= {

    /**
     * Gets the name of this queue.
     * @returns {String}
     */
    getQueueName: function() {
      return this.destinationName;
    }
  };

  Queue.prototype["getQueueName"] = Queue.prototype.getQueueName;

  Inheritance(Queue, Destination);
  export default Queue;

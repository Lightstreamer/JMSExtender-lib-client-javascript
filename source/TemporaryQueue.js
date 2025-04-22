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
import Queue from "./Queue";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link TemporaryQueue} object that holds the name of a JMS queue.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {String} queueName name of the queue.
//JSDOC_IGNORE_END
   *
   * @exports TemporaryQueue
   * @class A {@link TemporaryQueue} object is a unique {@link Queue} object created for the
   * duration of a {@link Connection}. It is a system-defined queue that can be consumed
   * only by the {@link Connection} that created it.
   * @extends Queue
   */
  var TemporaryQueue= function(queueName, session) {
    this.session= session;

    this._callSuperConstructor(TemporaryQueue, [queueName]);
  };

  TemporaryQueue.prototype= {

    /**
     * Deletes this temporary queue.
     */
    deleteTemporaryQueue: function() {

      // Prepare and send delete message
      var actualMessage= {
        "dataAdapterName": this.session.connection.dataAdapterName,
        "localClientId": this.session.connection.clientId,
        "localSessionGuid": this.session.localGuid,
        "destinationType": "QUEUE",
        "destinationName": this.destinationName,
        "messageKind": "DELETE_TEMP_QUEUE"
      };

      // Use session GUID as sequence identifier, to guarantee proper message serialization
      var sequenceId= this.session.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");
      this.session.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, null, true);
    }
  };

  TemporaryQueue.prototype["deleteTemporaryQueue"] = TemporaryQueue.prototype.deleteTemporaryQueue;

  Inheritance(TemporaryQueue, Queue);
  export default TemporaryQueue;

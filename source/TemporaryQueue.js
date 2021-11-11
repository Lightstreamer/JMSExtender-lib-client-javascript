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

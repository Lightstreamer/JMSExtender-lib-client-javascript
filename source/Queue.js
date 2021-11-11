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

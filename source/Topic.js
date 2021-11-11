import Inheritance from "./Inheritance";
import Destination from "./Destination";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link Topic} object that holds the name of a JMS topic.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {String} topicName name of the topic.
//JSDOC_IGNORE_END
   *
   * @exports Topic
   * @class A {@link Topic} object holds the name of a JMS topic. Topics offer
   * a one-to-many communication paradigm, where each message is received
   * by all the subscribers. The exact policies of message dispatching depend
   * on the specific JMS broker.
   * @extends Destination
   */
  var Topic= function(topicName) {
    this._callSuperConstructor(Topic, ["TOPIC", topicName]);
  };

  Topic.prototype= {

    /**
     * Gets the name of this topic.
     * @returns {String}
     */
    getTopicName: function() {
      return this.destinationName;
    }
  }

  Topic.prototype["getTopicName"] = Topic.prototype.getTopicName;

  Inheritance(Topic, Destination);
  export default Topic;

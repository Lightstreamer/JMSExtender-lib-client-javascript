import Inheritance from "./Inheritance";
import Topic from "./Topic";

  /**
   * This method is not meant to be used directly.
   * Creates a {@link TemporaryTopic} object that holds the name of a JMS topic.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {String} topicName name of the topic.
//JSDOC_IGNORE_END
   *
   * @exports TemporaryTopic
   * @class A {@link TemporaryTopic} object is a unique {@link Topic} object created for the
   * duration of a {@link Connection}. It is a system-defined topic that can be consumed
   * only by the {@link Connection} that created it.
   * @extends Topic
   */
  var TemporaryTopic= function(topicName, session) {
    this.session= session;

    this._callSuperConstructor(TemporaryTopic, [topicName]);
  };

  TemporaryTopic.prototype= {

    /**
     * Deletes this temporary topic.
     */
    deleteTemporaryTopic: function() {

      // Prepare and send delete message
      var actualMessage= {
        "dataAdapterName": this.session.connection.dataAdapterName,
        "localClientId": this.session.connection.clientId,
        "localSessionGuid": this.session.localGuid,
        "destinationType": "QUEUE", // Must always be QUEUE, if we say TOPIC it could be deleted on the shared session
        "destinationName": this.destinationName,
        "messageKind": "DELETE_TEMP_TOPIC"
      };

      // Use session GUID as sequence identifier, to guarantee proper message serialization
      var sequenceId= this.session.localGuid.replace(/[^a-zA-Z0-9]+/g, "_");
      this.session.connection.lsClient.sendMessage(JSON.stringify(actualMessage), sequenceId, null, null, true);
    }
  };

  TemporaryTopic.prototype["deleteTemporaryTopic"] = TemporaryTopic.prototype.deleteTemporaryTopic;

  Inheritance(TemporaryTopic, Topic);
  export default TemporaryTopic;

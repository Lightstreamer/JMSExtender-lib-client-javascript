

  /**
   * This method is not meant to be used directly.
   * Creates a {@link Destination} object that holds the name and type
   * of JMS destination, e.g. a topic or queue.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {String} destinationType specifies the type of destination. It
   * can either be <code>"TOPIC"</code> or <code>"QUEUE"</code>.
   * @param {String} destinationName name of the topic or queue referenced
   * by this destination.
//JSDOC_IGNORE_END
   *
   * @exports Destination
   * @class Class that holds the name and type of JMS
   * destination, e.g. a topic or queue.
   */
  var Destination= function(destinationType, destinationName) {
    this.destinationType= destinationType;
    this.destinationName= destinationName;
  };

  export default Destination;

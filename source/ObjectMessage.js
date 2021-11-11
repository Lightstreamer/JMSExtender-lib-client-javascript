import Inheritance from "./Inheritance";
import Message from "./Message";

  /**
   * This method is not meant to be used directly.
   * Creates an {@link ObjectMessage} object that is used to send a message that
   * contains an object as its payload. Contained objects must have a
   * corresponding Java object on the JMS Extender, and their class
   * fully-qualified name must be specified.
   * @constructor
   *
//JSDOC_IGNORE_START
   * @param {Session} session specifies the session this message will be
   * sent on.
//JSDOC_IGNORE_END
   *
   * @exports ObjectMessage
   * @class An {@link ObjectMessage} object is used to send a message that
   * contains an object as its payload. Contained objects must have a
   * corresponding Java object on the JMS Extender, and their class
   * fully-qualified name must be specified.
   * @extends Message
   */
  var ObjectMessage= function(session) {
    this._callSuperConstructor(ObjectMessage, [session, "OBJECT_MSG"]);
  };

  ObjectMessage.prototype= {

    /**
     * Sets the object that must be sent as the payload of this message.
     * <BR/>The fully-qualified class name of the object must be
     * specified using the {@link ObjectMessage#setClassFQN} method.
     *
     * @param {Object} object object to be sent as payload.
     */
    setObject: function(object) {
      this.body= object;
    },

    /**
     * Returns the object that will be sent as the payload of this message.
     * @returns {Object}
     */
    getObject: function() {
      return this.body;
    },

    /**
     * Sets the fully-qualified class name of the object that must be
     * sent as the payload of this message.
     *
     * @param {String} classFQN fully-qualified class name of the object to
     * be sent as payload.
     */
    setClassFQN: function(classFQN) {
      this.classFQN= classFQN;
    },

    /**
     * Returns the fully-qualified class name of the object that will be
     * sent as the payload of this message.
     * @returns {String}
     */
    getClassFQN: function() {
      return this.classFQN;
    }
  };

  ObjectMessage.prototype["getClassFQN"] = ObjectMessage.prototype.getClassFQN;
  ObjectMessage.prototype["setClassFQN"] = ObjectMessage.prototype.setClassFQN;
  ObjectMessage.prototype["getObject"] = ObjectMessage.prototype.getObject;
  ObjectMessage.prototype["setObject"] = ObjectMessage.prototype.setObject;

  Inheritance(ObjectMessage, Message);
  export default ObjectMessage;

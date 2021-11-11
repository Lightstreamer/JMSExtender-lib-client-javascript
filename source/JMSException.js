

  /**
   * This method is not meant to be used directly.
   * Creates a {@link JMSException} with the specified reason and error code.
   * @constructor
   *
   * @exports JMSException
   * @class Interface used to receive asynchronously delivered exceptions.
   * JMS exceptions may be due to a number of different reasons and/or
   * caused by different APIs:<ul>
   * <li>connection exceptions caused by timeouts while communicating with
   *     the JMS broker;
   * <li>argument exceptions caused by passing invalid arguments or
   *     specifying inexistent destination names;
   * <li>authorization exceptions thrown by a server-side hook;
   * <li>etc.
   * </ul>
   * See {@link JMSException#getErrorCode} for a list on known exception
   * error codes.
   */
  var JMSException= function(reason, errorCode) {
    this.reason= reason;
    this.errorCode= errorCode;
  };

  JMSException.prototype= {

    /**
     * Gets the exception message.
     * @returns {String}
     */
    getMessage: function() {
      return this.reason;
    },

    /**
     * Gets the error code. The following error codes are used for specific
     * error conditions on the JMS Extender:<ul>
     * <li>"JMSEXT_CONNECTION_DISABLED": the JMS Connector is not enabled;
     *     when an exception with this error code is reported, contact your
     *     system administrator;
     * <li>"JMSEXT_INVALID_CONNECTOR_NAME": the JMS Connector specified
     *     while connecting does not exist;
     * <li>"JMSEXT_CONNECTION_NOT_AVAILABLE": the JMS Connector is not able to
     *     obtain a connection to the JMS broker; under normal conditions
     *     this exception should never be reported;
     * <li>"JMSEXT_CONNECTION_TIMED_OUT": the connection to the JMS
     *     broker is temporarily not available; when this exception is
     *     reported, a previously requested operation could not be completed,
     *     the JMS Extender will reconnect as soon as possible and the
     *     operation can subsequently be retried;
     * <li>"JMSEXT_INVALID_ACK_MODE": an invalid ack mode has been requested;
     * <li>"JMSEXT_DUPS_OK_NOT_AVAILABLE": a session with ack mode DUPS_OK has
     *     been requested, but the JMS Connector and the underlying JMS
     *     broker do not support it;
     * <li>"JMSEXT_INDIVIDUAL_ACK_NOT_AVAILABLE": a session with ack mode
     *     INDIVIDUAL_ACK has been requested, but the JMS Connector and the
     *     underlying JMS broker do not support it.
     * </ul>
     *
     * @returns {String}
     */
    getErrorCode: function() {
      return this.errorCode;
    }
  };

  JMSException.prototype["getErrorCode"] = JMSException.prototype.getErrorCode;
  JMSException.prototype["getMessage"] = JMSException.prototype.getMessage;

  export default JMSException;

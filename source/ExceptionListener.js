

  /**
   * Creates an {@link ExceptionListener} object used to receive asynchronously
   * delivered exceptions.
   * @constructor
   *
   * @exports ExceptionListener
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
  var ExceptionListener= function() {
  };

  ExceptionListener.prototype= {

    /**
     * Notifies user of a {@link JMSException}. Exceptions may be due to a
     * number of different reasons and/or caused by different APIs. See
     * {@link JMSException#getErrorCode} for a list of known exception
     * error codes.
     *
     * @param {JMSException} exception notified to the listener.
     */
    onException: function(exception) {}
  };

  export default ExceptionListener;

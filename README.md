# Lightstreamer JMS Extender Client SDK

This JavaScript library enables any JavaScript application running in a web browser or a Node.js container to connect to a JMS broker via JMS Extender or Lightstreamer Server with JMS Extender Adapter.

The library is designed to be as class-by-class and method-by-method equivalent to JMS API 2.0 as possible. Some differences still apply, mainly due to JavaScript asynchronous nature. Most notably, some JMS synchronous APIs, like `createConnection`, here require a callback and will be called asynchronously.

Following is an example of a topic connection and subscription:

```
jms.ConnectionFactory.createConnection("http://my.push.server:8080/", "ActiveMQ", null, null, {
        onConnectionCreated: function(conn) {
            conn.setExceptionListener({
                onException: function(exception) {
                    // Handle exceptions here
                }
            });

            var session = conn.createSession(false, "PRE_ACK");
            var topic = session.createTopic("stocksTopic");
            var consumer= session.createConsumer(topic, null);

            consumer.setMessageListener({
                onMessage: function(message) {
                    // Handle messages here
                }
            });

            conn.start();

        },
        onConnectionFailed: function(errorCode, errorMessage) {
            // Handle server errors here, e.g.:
            alert("Server error: " + errorCode + " " + errorMessage);
        }
    });
```

Following is an example of a queue connection and message send:

```
jms.ConnectionFactory.createConnection("http://my.push.server:8080/", "ActiveMQ", null, null, {
        onConnectionCreated: function(conn) {
            conn.setExceptionListener({
                onException: function(exception) {
                    // Handle exceptions here
                }
            });

            var session = conn.createSession(false, "AUTO_ACK");
            var queue = session.createQueue("stocksQueue");
            var producer = session.createProducer(queue, null);

            var msg = session.createTextMessage("some text");
            producer.send(msg);

            conn.start();

        },
        onConnectionFailed: function(errorCode, errorMessage) {
            // Handle server errors here, e.g.:
            alert("Server error: " + errorCode + " " + errorMessage);
        }
    });
```

Please refer to JMS Extender documentation to learn more about the system architecture and how to configure and deploy it.

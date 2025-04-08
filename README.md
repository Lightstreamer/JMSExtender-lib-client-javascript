# Lightstreamer JMS Extender Client SDK

This JavaScript library enables any JavaScript application running in a web browser or a Node.js container to connect to a JMS broker via [JMS Extender](https://lightstreamer.com/products/jms-connector/) or [Lightstreamer Server](https://lightstreamer.com) with JMS Extender Adapter.

The library is designed to be as class-by-class and method-by-method equivalent to [JMS API 2.0](https://jakarta.ee/specifications/messaging/) as possible. Some differences still apply, mainly due to JavaScript asynchronous nature. Most notably, some JMS synchronous APIs, like `createConnection`, here require a callback and will be called asynchronously.

## Quickstart

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

## npm Packages

The library is available as npm package, so you can download and install it through:

```
npm install lightstreamer-jms-web-client
```

or

```
npm install lightstreamer-jms-node-client
```

- [npm Web Package](https://www.npmjs.com/package/lightstreamer-jms-web-client/v/3.0.0)

- [npm Node.js Package](https://www.npmjs.com/package/lightstreamer-jms-node-client/v/3.0.0)

## Building

To build the library, enter the directory `tools` and run the command `node build_web.js` or the command `node build_node.js`. The first time you should also enter the root directory of the project and run the command `npm install` in order to install the dependencies required by the build scripts. The scripts require Node.js version 14 or greater.

The artifacts generated are saved in the directories `tools/dist-web` and `tools/dist-node`.

## Documentation

- [Live demos](https://demos.lightstreamer.com/?p=jmsextender&t=client&lclient=html&lclient=nodejs)

- [Web API Reference](https://lightstreamer.com/sdks/ls-jms-web-client/3.0.0/api/index.html)

- [Node.js API Reference](https://lightstreamer.com/sdks/ls-jms-nodejs-client/3.0.0/api/index.html)

- [General Concepts](https://lightstreamer.com/distros/jmsext/2.1.0/docs/JMS%20Extender%20Documentation.pdf)

## Support

For questions and support please use the [Official Forum](https://forum.lightstreamer.com/). The issue list of this page is **exclusively** for bug reports and feature requests.

## License

[Apache 2.0](https://opensource.org/licenses/Apache-2.0)

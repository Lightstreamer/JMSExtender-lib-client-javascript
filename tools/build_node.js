/*
 * Copyright (C) 2013 Lightstreamer Srl
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const build = require('./rollup_build');
const virtual = require('@rollup/plugin-virtual');
const compiler = require('@ampproject/rollup-plugin-closure-compiler');
const replace = require('@rollup/plugin-replace');
const alias = require('@rollup/plugin-alias');
const path = require('path');

// Syntax: <source dir> <output file name> <version number> <build number>
const args = process.argv.slice(2)
let srcDir, outFile, versionNum, buildNum;
if (args.length != 4) {
    srcDir = '../source'
    outFile = 'dist-node/lightstreamer-jms.js'
    versionNum = '3.0.1-custom'
    buildNum = 1
} else {
    [srcDir, outFile, versionNum, buildNum] = args
}

const externalModules = ['LightstreamerClient','Subscription','SimpleLoggerProvider','ConsoleAppender']
const modules = ['LightstreamerJMS','BytesMessage','CompletionListener','Connection','ConnectionFactory',
'ConnectionListener','Destination','ExceptionListener','JMSConsumer','JMSContext','JMSContextListener',
'JMSException','JMSProducer','MapMessage','Message','MessageConsumer','MessageListener','MessageProducer',
'ObjectMessage','Queue','QueueConnection','QueueConnectionFactory','QueueReceiver','QueueSender',
'QueueSession','Session','TemporaryQueue','TemporaryTopic','TextMessage','Topic','TopicConnection',
'TopicConnectionFactory','TopicPublisher','TopicSession','TopicSubscriber']

const virtual_entrypoint = `
${externalModules.map(m => `import {${m}} from 'lightstreamer-client-node';`).join('\n')}
${modules.map(m => `import ${m} from ${JSON.stringify(`${path.resolve(srcDir, m)}.js`)};`).join('\n')}
export default {
    ${externalModules.map(m => `'${m}': ${m}`).join(',\n')},
    ${modules.map(m => `'${m}': ${m}`).join(',\n')}
};`

const copyright = `
/**
 * @preserve
 * LIGHTSTREAMER - www.lightstreamer.com
 * Lightstreamer JMS Extender Node.js Client
 * Version ${versionNum} build ${buildNum}
 * Copyright (c) Lightstreamer Srl. All Rights Reserved.
 * Contains: ${externalModules.concat(modules).reduce((acc, x, i) => i % 4 == 3 ? (acc + ',\n*  ' + x) : (acc + ', ' + x))}
 * CJS
 */
`

const options = {
    inputOptions: {
        input: 'virtual-entrypoint',
        external: ['lightstreamer-client-node'],
        plugins: [
            replace({
                values: {
                    'version_placeholder': versionNum,
                    'build_placeholder': buildNum,
                    'library_name_placeholder': 'nodejs',
                    'library_tag_placeholder': 'nodejs_client'
                },
                preventAssignment: true
            }),
            virtual({ 
                'virtual-entrypoint': virtual_entrypoint
            }),
            alias({
                entries: [
                    { find: 'lightstreamer-client-stub', replacement: 'lightstreamer-client-node' },
                ]
            }),
            compiler({
                compilation_level: 'ADVANCED',
                warning_level: 'DEFAULT',
                language_in: 'ECMASCRIPT5',
                language_out: 'ECMASCRIPT5',
                externs: 'externs.js'
            })
        ]
    },
    outputOptions: {
        file: outFile,
        format: 'cjs',
        exports: 'default',
        banner: copyright,
    }
}

console.log('Source folder', srcDir)
console.log('Output file', outFile)
console.log('Version', versionNum, 'build', buildNum)

build(options);

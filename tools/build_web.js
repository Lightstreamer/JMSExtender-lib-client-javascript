const build = require('./rollup_build');
const virtual = require('@rollup/plugin-virtual');
const compiler = require('@ampproject/rollup-plugin-closure-compiler');
const nodeResolve = require('@rollup/plugin-node-resolve').nodeResolve;
const replace = require('@rollup/plugin-replace');
const alias = require('@rollup/plugin-alias');
const path = require('path');

// Syntax: <source dir> <output file name> <version number> <build number>
const args = process.argv.slice(2)
let srcDir, outFile, versionNum, buildNum;
if (args.length != 4) {
    srcDir = '../source'
    outFile = 'dist-web/lightstreamer-jms.js'
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
const allModules = externalModules.concat(modules)

const virtual_entrypoint = `
${externalModules.map(m => `import {${m}} from 'lightstreamer-client-web/lightstreamer-core.esm.js';`).join('\n')}
${modules.map(m => `import ${m} from ${JSON.stringify(`${path.resolve(srcDir, m)}.js`)};`).join('\n')}
export default {
    ${externalModules.map(m => `'${m}': ${m}`).join(',\n')},
    ${modules.map(m => `'${m}': ${m}`).join(',\n')}
};`

const copyright = `
/**
 * @preserve
 * LIGHTSTREAMER - www.lightstreamer.com
 * Lightstreamer JMS Extender Web Client
 * Version ${versionNum} build ${buildNum}
 * Copyright (c) Lightstreamer Srl. All Rights Reserved.
 * Contains: ${allModules.reduce((acc, x, i) => i % 4 == 3 ? (acc + ',\n*  ' + x) : (acc + ', ' + x))}
 * UMD
 */
`

const exportVar = 'lightstreamerJMSExports'
const defaultNs = 'jms'
const attributeNs = 'data-jms-ns'

const umdFooter = `
if (typeof define === 'function' && define.amd) {
    define("${defaultNs}", ["module"], function(module) {
        var ns = module.config()['ns'];
        var namespace = (ns ? ns + '/' : (typeof ns === "undefined" ? '${defaultNs}/' : ''));
        ${allModules.map(m => `define(namespace + '${m}', function() { return ${exportVar}['${m}'] });`).join('\n')}
    });
    require(["${defaultNs}"]);
}
else if (typeof module === 'object' && module.exports) {
    ${allModules.map(m => `exports['${m}'] = ${exportVar}['${m}'];`).join('\n')}
}
else {
    var extractNs = function() {
        var scripts = window.document.getElementsByTagName("script");
        for (var i = 0, len = scripts.length; i < len; i++) {
            if ('${attributeNs}' in scripts[i].attributes) {        
                return scripts[i].attributes['${attributeNs}'].value;
            }
        }
        return '${defaultNs}';
    };
    
    var createNs = function(ns, root) {
        if (! ns) {
            return root;
        }
        var pieces = ns.split('.');
        var parent = root || window;
        for (var j = 0; j < pieces.length; j++) {
            var qualifier = pieces[j];
            var obj = parent[qualifier];
            if (! (obj && typeof obj == 'object')) {
                obj = parent[qualifier] = {};
            }
            parent = obj;
        }
        return parent;
    };

    var namespace = createNs(extractNs(), window);
    ${allModules.map(m => `namespace['${m}'] = ${exportVar}['${m}'];`).join('\n')}
}
`

const options = {
    inputOptions: {
        input: 'virtual-entrypoint',
        plugins: [
            replace({
                values: {
                    'version_placeholder': versionNum,
                    'build_placeholder': buildNum,
                    'library_name_placeholder': 'javascript',
                    'library_tag_placeholder': 'javascript_client'
                },
                preventAssignment: true
            }),
            virtual({ 
                'virtual-entrypoint': virtual_entrypoint
            }),
            alias({
                entries: [
                    { find: 'lightstreamer-client-stub', replacement: 'lightstreamer-client-web/lightstreamer-core.esm.js' },
                ]
            }),
            nodeResolve(),
            compiler({
                compilation_level: 'ADVANCED',
                language_in: 'ECMASCRIPT5',
                language_out: 'ECMASCRIPT5',
                externs: 'externs.js',
                warning_level: 'DEFAULT',
                // warning_level: 'VERBOSE',
                // debug: true,
                // formatting: 'PRETTY_PRINT',
            })
        ]
    },
    outputOptions: {
        file: outFile,
        format: 'iife',
        name: exportVar,
        exports: 'default',
        banner: copyright,
        footer: umdFooter
    }
}

console.log('Source folder', srcDir)
console.log('Output file', outFile)
console.log('Version', versionNum, 'build', buildNum)

build(options);

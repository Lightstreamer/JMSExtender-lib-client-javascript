const rollup = require('rollup');

async function build(options) {
    const {inputOptions, outputOptions} = options        
    inputOptions.onwarn = ({ loc, frame, message }) => {
        if (loc) {
            console.warn('WARNING', `${loc.file} (${loc.line}:${loc.column}) ${message}`);
            if (frame) console.warn(frame);
        } else {
            console.warn('WARNING', message);
        }
    };
    const bundle = await rollup.rollup(inputOptions);
    await bundle.generate(outputOptions);
    await bundle.write(outputOptions);
    console.log('Done.')
}

module.exports = build

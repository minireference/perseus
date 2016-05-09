const path = require("path");

const includeEditor = process.env.INCLUDE_EDITORS === "true";
const prod = process.env.NODE_ENV === "production";


// Pass externals as Object to reduce level of magic...
const externalVals = {
    // We inject React libs, underscore, and jQuery into the page in
    // development. These are the paths on `window` (i.e. `"_"` is `window._`
    // or `["React", "__internalReactDOM"]` is
    // `window.React.__internalReactDOM`) to find the modules at.
    "react": "React",
    "react-dom": ["React", "__internalReactDOM"].join('.'),
    "react-addons-create-fragment": ["React", "__internalAddons", "createFragment"].join('.'),
    "react-addons-pure-render-mixin": ["React", "__internalAddons", "PureRenderMixin"].join('.'),

    "underscore": "_",
    "jquery": "jQuery",

    // RCSS and classnames can be required from webapp, but in dev we just want
    // to bundle them.
    "rcss": false,
    "classnames": false,

    // react-components should always be bundled, because we can't require it
    // easily from webapp (yet?). We don't really need to list it here, but
    // it's nice to have a list of all library dependencies.
    "react-components/blur-input.jsx": false,
    "react-components/button-group.jsx": false,
    "react-components/drag-target.jsx": false,
    "react-components/info-tip.jsx": false,
    "react-components/multi-button-group.jsx": false,
    "react-components/sortable.jsx": false,
    "react-components/tex.jsx": false,
    "react-components/tooltip.jsx": false,
};


module.exports = {
    entry: "./src/" + (includeEditor ? "editor-" : "") + "perseus.js",
    output: {
        path: "./build",
        filename: (includeEditor ? "editor-" : "") + "perseus.js",
        library: "Perseus",
        libraryTarget: "var",
    },
    externals: externalVals,
    module: {
        loaders: [
            {
                test: /\.json$/,
                loader: "json-loader",
            },
            {
                test: /\.jsx?$/,
                include: [
                    path.join(__dirname, "src/"),
                    path.join(__dirname, "node_modules/react-components/"),
                ],
                // https://github.com/webpack/webpack/issues/119
                loader: path.join(__dirname, "node/jsx-loader.js"),
            },
            {
                test: /\.jison$/, loader: "jison-loader",
            },
        ],
    },
};

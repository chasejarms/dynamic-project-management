const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api/public",
        createProxyMiddleware({
            target:
                "https://b2ouopcfb7.execute-api.us-east-1.amazonaws.com/Prod/",
            changeOrigin: true,
        })
    );
    app.use(
        "/api/authenticated",
        createProxyMiddleware({
            target:
                "https://tnj4vxar72.execute-api.us-east-1.amazonaws.com/Prod/",
            changeOrigin: true,
        })
    );
};

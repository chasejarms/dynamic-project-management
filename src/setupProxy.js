const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api/public",
        createProxyMiddleware({
            target:
                "https://b2ouopcfb7.execute-api.us-east-1.amazonaws.com/Prod/",
            changeOrigin: true,
            pathRewrite: { "^/api/public": "" },
        })
    );
    app.use(
        "/api/authenticated",
        createProxyMiddleware({
            target:
                "https://tnj4vxar72.execute-api.us-east-1.amazonaws.com/Prod/",
            changeOrigin: true,
            pathRewrite: { "^/api/authenticated": "" },
        })
    );
    app.use(
        "/api/s3Presigned",
        createProxyMiddleware({
            target:
                "https://ticket-files-elastic-project-management-s3-bucket.s3.us-east-1.amazonaws.com",
            changeOrigin: true,
            pathRewrite: { "^/api/s3Presigned": "" },
        })
    );
};

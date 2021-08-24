const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
    app.use(
        "/api/public",
        createProxyMiddleware({
            target:
                "https://mzfc9fiigj.execute-api.us-east-1.amazonaws.com/Prod/",
            changeOrigin: true,
            pathRewrite: { "^/api/public": "" },
        })
    );
    app.use(
        "/api/authenticated",
        createProxyMiddleware({
            target:
                "https://ec366txftb.execute-api.us-east-1.amazonaws.com/Prod/",
            changeOrigin: true,
            pathRewrite: { "^/api/authenticated": "" },
        })
    );
    app.use(
        "/api/s3Presigned",
        createProxyMiddleware({
            target:
                "https://elastic-project-management-company-source-files.s3.us-east-1.amazonaws.com",
            changeOrigin: true,
            pathRewrite: { "^/api/s3Presigned": "" },
        })
    );
};

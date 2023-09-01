var DcErrorReportingSdk = /** @class */ (function () {
    function DcErrorReportingSdk(systemName, enviroment, token) {
        this.apiUrl = 'https://dc-error-reporting.dctec.dev';
        this.hostname = 'dc-error-reporting.dctec.dev';
        this.systemName = systemName;
        this.enviroment = enviroment;
        this.token = token;
    }
    DcErrorReportingSdk.prototype.send = function (error, requestedUrl) {
        try {
            if (!this.token || !this.enviroment || this.enviroment === 'local') {
                return;
            }
            var http = require('http');
            var data = {
                system_name: this.systemName,
                environment: this.enviroment,
                requested_url: requestedUrl,
                error: {
                    name: error.name || error || '',
                    message: error.message || error || '',
                    stack: error.stack || '',
                    response: error.response ? {
                        url: error.response.config ? error.response.config.url : undefined,
                        method: error.response.config ? error.response.config.method : undefined,
                        requestData: error.response.config ? error.response.config.data : undefined,
                        responseData: error.response.data
                    } : undefined
                }
            };
            var options = {
                hostname: this.hostname,
                port: 443,
                path: '/api/error_report',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + this.token
                }
            };
            var req = http.request(options, function (res) {
                var responseData = '';
                res.on('data', function (chunk) {
                    responseData += chunk;
                });
                res.on('end', function () {
                    console.log('Response:', responseData);
                });
            });
            req.on('error', function (error) {
                console.error('Error:', error);
            });
            req.write(JSON.stringify(data));
            req.end();
        }
        catch (error) {
            console.log('error', error);
        }
    };
    return DcErrorReportingSdk;
}());
module.exports = DcErrorReportingSdk;

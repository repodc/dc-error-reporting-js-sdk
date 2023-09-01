"use strict";
class DcErrorReportingSdk {
    constructor(systemName, enviroment, token) {
        this.apiUrl = 'https://dc-error-reporting.dctec.dev';
        this.hostname = 'dc-error-reporting.dctec.dev';
        this.systemName = systemName;
        this.enviroment = enviroment;
        this.token = token;
    }
    send(error, requestedUrl) {
        try {
            if (!this.token || !this.enviroment || this.enviroment === 'local') {
                return;
            }
            const http = require('http');
            const data = {
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
                        responseData: error.response.data,
                    } : undefined,
                },
            };
            const options = {
                hostname: this.hostname,
                port: 443,
                path: '/api/error_report',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
            };
            const req = http.request(options, (res) => {
                let responseData = '';
                res.on('data', (chunk) => {
                    responseData += chunk;
                });
                res.on('end', () => {
                    console.log('Response:', responseData);
                });
            });
            req.on('error', (error) => {
                console.error('Error:', error);
            });
            req.write(JSON.stringify(data));
            req.end();
        }
        catch (error) {
            console.log('error', error);
        }
    }
}
module.exports = DcErrorReportingSdk;

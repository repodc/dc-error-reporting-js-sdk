class DcErrorReportingSdk {
    apiUrl = 'https://dc-error-reporting.dctec.dev';
    hostname = 'dc-error-reporting.dctec.dev';

    systemName;
    environment;
    token;

    constructor(systemName, environment, token) {
        this.systemName = systemName;
        this.environment = environment;
        this.token = token;
    }

    send(error, requestedUrl) {
        try {
            if (!this.token || !this.environment || this.environment === 'local') {
                return;
            }

            const https = require('https');

            const data = {
                system_name: this.systemName,
                environment: this.environment,
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
                path: '/api/error_report',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
            };

            const req = https.request(options, (res) => {
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
        } catch (error) {
            console.log('error', error);
        }
    }
}

module.exports = DcErrorReportingSdk;
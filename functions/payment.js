const axios = require('axios');

exports.handler = async (event, context) => {
    // السماح بطلبات CORS
    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type" }, body: '' };
    }

    try {
        const { paymentId, txid, action } = JSON.parse(event.body);
        const apiKey = "nkvn0ztk0cw5hjavtmdkr1gmductrkt88hk1uyjifz3zw5uob0fn2e1i2tbyzcbh"; // استبدله بمفتاحك من Pi Dashboard

        // 1. مرحلة الموافقة على الدفع (Approve)
        if (action === 'approve') {
            await axios.post(`https://api.minepi.com/v2/payments/${paymentId}/approve`, {}, {
                headers: { 'Authorization': `Key ${apiKey}` }
            });
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Approved" })
            };
        }

        // 2. مرحلة إكمال الدفع (Complete)
        if (action === 'complete') {
            await axios.post(`https://api.minepi.com/v2/payments/${paymentId}/complete`, { txid }, {
                headers: { 'Authorization': `Key ${apiKey}` }
            });
            return {
                statusCode: 200,
                body: JSON.stringify({ message: "Completed" })
            };
        }

        return { statusCode: 400, body: JSON.stringify({ error: "Invalid Action" }) };

    } catch (error) {
        console.error("Pi API Error:", error.response ? error.response.data : error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Internal Server Error" })
        };
    }
};


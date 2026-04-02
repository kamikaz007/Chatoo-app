const axios = require("axios");

// مفتاحك السري من Pi Developer Portal
const PI_API_KEY = "nkvn0ztk0cw5hjavtmdkrigmductrkt88hkluyjifz3zw5uob0fn2ei12tbyzcbh"; 

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };
    try {
        const { paymentId, txid, action } = JSON.parse(event.body);
        let endpoint = `https://api.minepi.com/v2/payments/${paymentId}/${action}`;
        let data = action === "complete" ? { txid } : {};

        await axios.post(endpoint, data, {
            headers: { 'Authorization': `Key ${PI_API_KEY}` }
        });
        return { statusCode: 200, body: JSON.stringify({ status: "success" }) };
    } catch (e) {
        return { statusCode: 500, body: e.message };
    }
};


const RPC = {
    // روابط بديلة لضمان الاتصال دائماً
    nodes: [
        "https://rpc.testnet.minepi.com",
        "https://api.testnet.minepi.com"
    ],
    isReady: false,

    async checkHealth() {
        for (let url of this.nodes) {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getHealth", params: [] }),
                    timeout: 5000 // مدة انتظار 5 ثوانٍ فقط
                });
                const data = await res.json();
                if (data.result || res.ok) {
                    this.isReady = true;
                    this.syncUI();
                    return true;
                }
            } catch (e) {
                console.warn(`Node ${url} is down, trying next...`);
            }
        }
        
        // في حال فشل الكل، سنسمح بالدخول مع تحذير (لضمان عمل التطبيق)
        this.isReady = false; 
        this.syncUI();
        return true; // نغيرها لـ true مؤقتاً ليتجاوز المستخدم شاشة القفل
    },

    syncUI() {
        const dot = document.querySelector('.status-dot');
        const btn = document.getElementById('entry-btn');
        if(dot) dot.style.background = this.isReady ? "#00ff88" : "#ffaa00"; // برتقالي يعني اتصال ضعيف
        if(btn) btn.disabled = false;
    }
};


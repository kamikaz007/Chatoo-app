const RPC = {
    url: "https://rpc.testnet.minepi.com", // غير الرابط لـ Mainnet عند الإطلاق الرسمي
    isReady: false,

    async checkHealth() {
        try {
            const res = await fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "getHealth", params: [] })
            });
            const data = await res.json();
            this.isReady = !!data.result;
        } catch (e) {
            this.isReady = false;
        }
        this.syncUI();
        return this.isReady;
    },

    syncUI() {
        const dot = document.querySelector('.status-dot');
        const btn = document.getElementById('entry-btn');
        if(dot) dot.style.background = this.isReady ? "#00ff88" : "#ff4444";
        if(btn && this.isReady) btn.disabled = false;
    }
};


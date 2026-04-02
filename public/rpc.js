const RPC_ENGINE = {
    endpoint: "https://api.mainnet.minepi.com",
    async checkStatus() {
        const rpcDot = document.getElementById('rpc-dot');
        try {
            const response = await fetch(this.endpoint);
            if (response.ok) {
                rpcDot.classList.add('rpc-active');
                return true;
            }
        } catch (e) {
            console.error("RPC Error");
            rpcDot.classList.remove('rpc-active');
        }
    }
};
window.RPC = RPC_ENGINE;


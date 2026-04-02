const Auth = {
    user: { id: null, uid: null, verified: false },

    async init() {
        try {
            await Pi.init({ version: "2.0", sandbox: false });
            const scopes = ['username', 'payments', 'wallet_address'];
            const res = await Pi.authenticate(scopes, (onIncomplete) => {});
            
            this.user.id = res.username;
            this.user.uid = res.uid;
            this.user.verified = true;

            document.getElementById('user-status').innerHTML = `متصل كـ: <span style="color:#ffd700">${res.username}</span>`;
            RPC.checkHealth(); // فحص الشبكة فور التعرف على المستخدم
        } catch (e) {
            console.error("Auth Fail", e);
            document.getElementById('user-status').innerText = "خطأ في المصادقة. افتح التطبيق من Pi Browser.";
        }
    }
};


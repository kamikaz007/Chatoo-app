const RPC = {
    // رابط الشبكة (يمكنك تغييره إلى الماينيت لاحقاً)
    url: "https://rpc.testnet.minepi.com",

    async checkHealth() {
        const statusDot = document.querySelector('.status-dot');
        const data = {
            jsonrpc: "2.0",
            id: 1,
            method: "getHealth", 
            params: []
        };

        try {
            // استخدام fetch بدلاً من axios لأنها مدعومة طبيعياً في المتصفح
            const response = await fetch(this.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.result) {
                console.log("الشبكة جاهزة:", result.result);
                // تحديث النقطة الخضراء في الواجهة السينمائية
                if(statusDot) {
                    statusDot.style.background = "#00ff88";
                    statusDot.style.boxShadow = "0 0 10px #00ff88";
                }
                return true;
            }
        } catch (error) {
            console.error("فشل الاتصال بالبلوكشين:", error);
            if(statusDot) {
                statusDot.style.background = "#ff4444"; // نقطة حمراء في حال العطل
                statusDot.style.boxShadow = "0 0 10px #ff4444";
            }
            return false;
        }
    }
};

// تشغيل الفحص تلقائياً عند تحميل الملف
RPC.checkHealth();


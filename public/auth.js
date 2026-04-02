const Auth = {
    user: { id: null, uid: null, verified: false },

    async init() {
        const statusElem = document.getElementById('user-status');
        const entryBtn = document.getElementById('entry-btn');

        try {
            // تهيئة الـ SDK مع التأكد من وضع sandbox حسب حاجتك
            await Pi.init({ version: "2.0", sandbox: false }); 
            
            // طلب الصلاحيات - تأكد من طلب 'username'
            const scopes = ['username', 'payments', 'wallet_address'];
            
            const authResult = await Pi.authenticate(scopes, (onIncompletePayment) => {
                console.log("Incomplete payment found", onIncompletePayment);
            });

            // تحديث بيانات المستخدم فور النجاح
            this.user.id = authResult.user.username;
            this.user.uid = authResult.user.uid;
            this.user.verified = true;

            // تحديث الواجهة السينمائية
            statusElem.innerHTML = `متصل كـ: <span style="color:#ffd700">${this.user.id}</span>`;
            
            // تفعيل زر الدخول فوراً
            entryBtn.disabled = false;
            entryBtn.style.background = "var(--primary)"; 
            entryBtn.style.cursor = "pointer";

        } catch (e) {
            console.error("خطأ في المصادقة:", e);
            statusElem.innerText = "فشلت المصادقة.. افتح التطبيق من Pi Browser";
        }
    }
};


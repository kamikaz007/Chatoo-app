const Auth = {
    user: {
        id: null,
        uid: null,
        isVerified: false
    },

    async init() {
        const statusElem = document.getElementById('user-status');
        const entryBtn = document.getElementById('entry-btn');

        try {
            // 1. تهيئة مكتبة Pi SDK بإصدارها الأحدث
            await Pi.init({ version: "2.0", sandbox: false });
            console.log("تم الاتصال بـ Pi Network");

            // 2. طلب المصادقة (Authentication) لجلب البيانات الحقيقية
            // نطلب 'username' للتعريف و 'payments' لتمكين الهدايا الحقيقية
            const scopes = ['username', 'payments'];
            
            const user = await Pi.authenticate(scopes, (payment) => {
                // دالة التعامل مع المدفوعات غير المكتملة
                console.log("Incomplete payment found:", payment);
            });

            // 3. تحديث بيانات المستخدم الحقيقية
            if (user && user.username) {
                this.user.id = user.username;
                this.user.uid = user.uid; // المعرف الفريد للمحفظة
                this.user.isVerified = true;

                statusElem.innerHTML = `مرحباً <span style="color:var(--gold)">${user.username}</span>`;
                console.log("تم جلب المستخدم الحقيقي من الشبكة");
            }

        } catch (e) {
            // 4. وضع الزائر (في حال تعذر الاتصال بالشبكة أو الفتح خارج المتصفح)
            console.error("Authentication Error:", e);
            this.user.id = 'Guest_' + Math.floor(Math.random() * 999);
            statusElem.innerText = "وضع الزائر (محدود الصلاحيات)";
        } finally {
            // إظهار زر الدخول دائماً لضمان عدم تعليق الواجهة
            entryBtn.style.display = 'block';
            entryBtn.innerText = "دخول عالم Chatoo";
        }
    }
};


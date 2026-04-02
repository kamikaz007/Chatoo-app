const App = {
    room: null,
    map: null,
    mapInitialized: false,

    // 1. فتح التطبيق وإخفاء شاشة القفل
    unlock() {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        
        // التأكد من تحميل الخريطة مرة واحدة فقط
        if (!this.mapInitialized) {
            this.initMap();
            this.mapInitialized = true;
        }
    },

    // 2. تهيئة الخريطة السينمائية
    initMap() {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            
            // إنشاء الخريطة
            this.map = L.map('map-canvas', { 
                zoomControl: false,
                attributionControl: false 
            }).setView([latitude, longitude], 16);

            // إضافة الطبقة الداكنة (Dark Mode)
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(this.map);

            // إضافة مؤشر لموقعك الحالي
            L.circle([latitude, longitude], { radius: 50, color: '#8257e5' }).addTo(this.map);

            this.loadVenues(latitude, longitude);
        }, (err) => {
            alert("يرجى تفعيل نظام تحديد المواقع (GPS) لعمل الخريطة");
        });
    },

    // 3. جلب المقاهي المحيطة
    loadVenues(lat, lon) {
        const query = `[out:json];node["amenity"~"cafe|restaurant"](around:2000,${lat},${lon});out;`;
        fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
            .then(r => r.json())
            .then(data => {
                data.elements.forEach(p => {
                    if (p.tags.name) {
                        L.marker([p.lat, p.lon]).addTo(this.map)
                            .on('click', () => this.openChat(p.tags.name));
                    }
                });
            });
    },

    // 4. نظام التنقل (إصلاح مشكلة زر الهدايا والبروفايل)
    showMap() {
        this.closeChat();
        console.log("عرض الخريطة");
    },

    showGifts() {
        alert("🎁 نظام المكافآت: سيتم تفعيل توزيع هدايا Pi قريباً!");
    },

    showProfile() {
        // استخدام بيانات المستخدم من ملف auth.js
        const userName = (Auth && Auth.user) ? Auth.user.id : "زائر";
        alert(`👤 ملفك الشخصي\nالمعرف: ${userName}\nالرصيد: 0.00 ✨`);
    },

    // 5. نظام الدردشة
    openChat(name) {
        this.room = name.replace(/\s+/g, '_');
        document.getElementById('venue-name').innerText = name;
        document.getElementById('modal-chat').classList.add('active');
        this.listen();
    },

    closeChat() {
        document.getElementById('modal-chat').classList.remove('active');
    },

    listen() {
        if (!this.room) return;
        
        db.collection("messages").doc(this.room).collection("chats").orderBy("t", "asc")
            .onSnapshot(snap => {
                const flow = document.getElementById('chat-flow');
                flow.innerHTML = "";
                snap.forEach(doc => {
                    const m = doc.data();
                    const div = document.createElement('div');
                    // مقارنة المعرف مع معرف auth.js لمنع الـ undefined
                    div.className = `msg ${m.u === Auth.user.id ? 'me' : ''}`;
                    div.innerText = m.val;
                    flow.appendChild(div);
                });
                flow.scrollTop = flow.scrollHeight;
            });
    },

    async send() {
        const input = document.getElementById('chat-input');
        const val = input.value.trim();
        
        if (!val || !this.room) return;

        try {
            await db.collection("messages").doc(this.room).collection("chats").add({
                u: String(Auth.user.id), // حماية من خطأ undefined في Pi Browser
                val: String(val),
                t: firebase.firestore.FieldValue.serverTimestamp()
            });
            input.value = "";
        } catch (e) {
            console.error("خطأ في الإرسال:", e);
        }
    }
};


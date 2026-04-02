const App = {
    map: null,
    room: null,

    unlock() {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        this.initMap();
    },

    initMap() {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            this.map = L.map('map-canvas', { zoomControl: false, attributionControl: false }).setView([latitude, longitude], 16);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(this.map);
            this.fetchPlaces(latitude, longitude);
        });
    },

    fetchPlaces(lat, lon) {
        const query = `[out:json];node["amenity"~"cafe|restaurant"](around:1500,${lat},${lon});out;`;
        fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`)
            .then(r => r.json()).then(d => {
                d.elements.forEach(p => {
                    L.marker([p.lat, p.lon]).addTo(this.map).on('click', () => this.openChat(p.tags.name));
                });
            });
    },

    showProfile() {
        // واجهة المحفظة الحقيقية
        alert(`💳 محفظة Pi الحقيقية\n------------------\nالمستخدم: ${Auth.user.id}\nUID: ${Auth.user.uid}\nالشبكة: ${RPC.isReady ? "Mainnet/Testnet Active" : "Disconnected"}`);
    },

    showGifts() {
        alert("🎁 نظام الهدايا: سيتم خصم 1 Pi لإرسال هدية للمتواجدين بالمكان. (قيد التفعيل)");
    },

    openChat(name) {
        this.room = name.replace(/\s+/g, '_');
        document.getElementById('venue-name').innerText = name;
        document.getElementById('modal-chat').classList.add('active');
        this.listen();
    },

    closeChat() { document.getElementById('modal-chat').classList.remove('active'); },

    listen() {
        db.collection("messages").doc(this.room).collection("chats").orderBy("t", "asc")
            .onSnapshot(snap => {
                const f = document.getElementById('chat-flow');
                f.innerHTML = "";
                snap.forEach(doc => {
                    const m = doc.data();
                    const d = document.createElement('div');
                    d.style.cssText = `padding:10px; border-radius:10px; margin:5px; max-width:80%; ${m.u === Auth.user.id ? 'align-self:flex-end; background:var(--primary);' : 'align-self:flex-start; background:#222;'}`;
                    d.innerText = m.val;
                    f.appendChild(d);
                });
                f.scrollTop = f.scrollHeight;
            });
    },

    async send() {
        const i = document.getElementById('chat-input');
        if(!i.value.trim() || !this.room) return;
        await db.collection("messages").doc(this.room).collection("chats").add({
            u: String(Auth.user.id),
            val: String(i.value),
            t: firebase.firestore.FieldValue.serverTimestamp()
        });
        i.value = "";
    },

    showMap() { this.closeChat(); }
};


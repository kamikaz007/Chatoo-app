const App = {
    room: null,
    unlock() {
        document.getElementById('lock-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'flex';
        this.initMap();
    },
    initMap() {
        navigator.geolocation.getCurrentPosition(pos => {
            const { latitude, longitude } = pos.coords;
            const map = L.map('map-canvas', { zoomControl: false }).setView([latitude, longitude], 16);
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);
            const query = '[out:json];node["amenity"~"cafe|restaurant"](around:2000,' + latitude + ',' + longitude + ');out;';
            fetch('https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(query))
                .then(r => r.json()).then(data => {
                    data.elements.forEach(p => {
                        if(p.tags.name) L.marker([p.lat, p.lon]).addTo(map).on('click', () => this.openChat(p.tags.name));
                    });
                });
        });
    },
    openChat(name) {
        this.room = name.replace(/\s+/g, '_');
        document.getElementById('venue-name').innerText = name;
        document.getElementById('modal-chat').classList.add('active');
        this.listen();
    },
    listen() {
        db.collection("messages").doc(this.room).collection("chats").orderBy("t", "asc")
            .onSnapshot(snap => {
                const flow = document.getElementById('chat-flow');
                flow.innerHTML = "";
                snap.forEach(doc => {
                    const m = doc.data();
                    const div = document.createElement('div');
                    div.className = "msg " + (m.u === Auth.user.id ? "me" : "");
                    div.innerText = m.val;
                    flow.appendChild(div);
                });
                flow.scrollTop = flow.scrollHeight;
            });
    },
    async send() {
        const input = document.getElementById('chat-input');
        if(!input.value.trim() || !this.room) return;
        await db.collection("messages").doc(this.room).collection("chats").add({
            u: String(Auth.user.id),
            val: String(input.value),
            t: firebase.firestore.FieldValue.serverTimestamp()
        });
        input.value = "";
    }
};

const firebaseConfig = {
    apiKey: "AIzaSyD9L74WN6V_4lOrIoaQPPtyi_SO-LLtayA",
    authDomain: "chatoo-4566f.firebaseapp.com",
    projectId: "chatoo-4566f",
    appId: "1:724118831864:web:2cca10fa8d290d4288f10d"
};
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    firebase.firestore().enablePersistence().catch(() => {});
}
const db = firebase.firestore();

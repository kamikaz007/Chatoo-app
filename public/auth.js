const Auth = {
    user: { id: 'Pi_User_' + Math.floor(Math.random()*999) },
    async init() {
        try {
            await Pi.init({ version: "2.0", sandbox: false });
            const piUser = await Pi.authenticate(['username'], (p) => {});
            if (piUser && piUser.username) {
                this.user.id = piUser.username;
                document.getElementById('user-status').innerHTML = "متصل: <span style='color:#ffd700'>" + piUser.username + "</span>";
            }
        } catch (e) {
            document.getElementById('user-status').innerText = "وضع الزائر نشط";
        }
        document.getElementById('entry-btn').style.display = 'block';
    }
};

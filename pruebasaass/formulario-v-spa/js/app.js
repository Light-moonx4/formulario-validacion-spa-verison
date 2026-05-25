document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");

    // =========================
    // USUARIOS
    // =========================
    const getUsuarios = () => {
        let almacenados = [];

        try {
            almacenados = JSON.parse(localStorage.getItem("users")) || [];
        } catch {
            almacenados = [];
        }

        const predefinidos = [
            {
                username: "neyder",
                password: "123",
                avatar: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flow_Blender_splash_cropped.png"
            }
        ];

        return [...predefinidos, ...almacenados];
    };

    // =========================
    // FETCH DATA
    // =========================
    const getData = async () => {
        const response = await fetch("http://localhost:3000/micaela");
        return await response.json();
    };

    // =========================
    // CALCULAR EDAD
    // =========================
    const calculateAge = (birthdate) => {
        if (!birthdate) return "N/A";

        const birth = new Date(birthdate);
        if (isNaN(birth.getTime())) return "N/A";

        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();

        const diff = today.getMonth() - birth.getMonth();
        if (diff < 0 || (diff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }

        return age;
    };

    // =========================
    // ROUTER
    // =========================
    const navigate = (ruta) => {
        app.innerHTML = "";

        // ================= LOGIN =================
        if (ruta === "login") {
            app.innerHTML = `
                <div>
                    <form id="loginForm">
                        <label>Username</label>
                        <input type="text" id="usernameIn" required>

                        <label>Password</label>
                        <input type="password" id="passwordIn" required>

                        <button type="submit">LOGIN</button>
                    </form>

                    <button id="registroir">REGISTRARSE</button>
                </div>
            `;

            document.getElementById("loginForm").onsubmit = (e) => {
                e.preventDefault();

                const user = getUsuarios().find(u =>
                    u.username === document.getElementById("usernameIn").value &&
                    u.password === document.getElementById("passwordIn").value
                );

                if (user) {
                    localStorage.setItem("user", JSON.stringify(user));
                    navigate("dashboard");
                } else {
                    alert("Credenciales incorrectas");
                }
            };

            document.getElementById("registroir").onclick = () => navigate("register");
        }

        // ================= REGISTER =================
        else if (ruta === "register") {
            app.innerHTML = `
                <div>
                    <form id="registerForm">
                        <label>Username</label>
                        <input type="text" id="nuevoUsername" required>

                        <label>Password</label>
                        <input type="password" id="nuevaPassword" required>

                        <label>Foto URL</label>
                        <input type="url" id="fotoUrl">

                        <button type="submit">REGISTER</button>
                    </form>

                    <button id="volver">BACK</button>
                </div>
            `;

            document.getElementById("registerForm").onsubmit = (e) => {
                e.preventDefault();

                const users = JSON.parse(localStorage.getItem("users")) || [];

                users.push({
                    username: document.getElementById("nuevoUsername").value,
                    password: document.getElementById("nuevaPassword").value,
                    avatar: document.getElementById("fotoUrl").value || "https://via.placeholder.com/150"
                });

                localStorage.setItem("users", JSON.stringify(users));

                alert("Registrado");
                navigate("login");
            };

            document.getElementById("volver").onclick = () => navigate("login");
        }

        // ================= DASHBOARD =================
        else if (ruta === "dashboard") {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return navigate("login");

            app.innerHTML = `
                <div>
                    <h1>ACCESS GRANTED</h1>

                    <div>
                        <img src="${user.avatar}" width="120">
                        <h2>${user.username}</h2>
                    </div>

                    <button id="cerrar">CERRAR SESIÓN</button>

                    <hr>

                    <button id="new">NEW</button>

                    <section id="formulario" class="hidden">
                        <form id="formData">
                            <input id="nameInput" placeholder="Name">
                            <input id="lastnameInput" placeholder="Lastname">
                            <input id="urlInput" placeholder="URL">
                            <textarea id="descriptionInput"></textarea>

                            <button type="submit">Crear</button>
                        </form>
                    </section>

                    <section id="data"></section>
                </div>
            `;

            // LOGOUT
            document.getElementById("cerrar").onclick = () => {
                if (!confirm("¿Cerrar sesión?")) return;
                localStorage.removeItem("user");
                navigate("login");
            };

            // ================= DASHBOARD LOGIC =================
            initDashboard();
        }
    };

    // =========================
    // DASHBOARD INIT
    // =========================
    const initDashboard = async () => {
        const container = document.getElementById("data");

        const data = await getData();
        container.innerHTML = "";

        data.forEach((item) => {
            const card = document.createElement("div");

            card.innerHTML = `
                <div>
                    <h3>${item.name} ${item.lastname}</h3>
                    <img src="${item.url}" width="100">
                    <p>${item.description}</p>

                    <button class="delete">Eliminar</button>
                    <button class="edit">Editar</button>
                </div>
            `;

            // DELETE
            card.querySelector(".delete").onclick = async () => {
                if (!confirm("¿Eliminar?")) return;

                await fetch(`http://localhost:3000/micaela/${item.id}`, {
                    method: "DELETE"
                });

                card.remove();
            };

            // EDIT
            card.querySelector(".edit").onclick = async () => {
                if (!confirm("¿Editar?")) return;

                const field = prompt("Campo a editar:");
                const value = prompt("Nuevo valor:");

                if (!field || !value) return;

                await fetch(`http://localhost:3000/micaela/${item.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        ...item,
                        [field]: value
                    })
                });
            };

            container.appendChild(card);
        });
    };

    // =========================
    // INICIO APP
    // =========================
    const userLogged = localStorage.getItem("user");
    navigate(userLogged ? "dashboard" : "login");
});
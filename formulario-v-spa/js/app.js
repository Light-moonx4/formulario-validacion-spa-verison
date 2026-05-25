// Esperar a que el DOM esté cargado para evitar que salga en blanco
document.addEventListener("DOMContentLoaded", () => {
    const app = document.getElementById("app");

    const getUsuarios = () => {
        const almacenados = JSON.parse(localStorage.getItem("users")) || [];
        const predefinidos = [
            { username: "neyder", password: "123", avatar: "https://upload.wikimedia.org/wikipedia/commons/b/ba/Flow_Blender_splash_cropped.png" }
        ];
        return [...predefinidos, ...almacenados];//spread
    };

    const navigate = (ruta) => {
        app.innerHTML = ""; // Limpiar pantalla

        if (ruta === "login") {
            app.innerHTML = `
                <div>
                  <form id="loginForm">
                    <label>Username</label>
                    <input type="text" id="usernameIn" required>
                    <label>Password</label>
                    <input type="password" id="passwordIn" required>
                    <button type="submit" id="login">LOGIN</button>
                  </form>
                  <button type="button" id="registroir">REGISTRARSE</button>
                </div>
            `;
            
            document.getElementById("loginForm").onsubmit = (e) => {
                e.preventDefault();
                const userFound = getUsuarios().find(u => 
                    u.username === document.getElementById("usernameIn").value && 
                    u.password === document.getElementById("passwordIn").value
                );
                if (userFound) {
                    localStorage.setItem("user", JSON.stringify(userFound));
                    navigate("dashboard");
                } else {
                    alert("Error de credenciales");
                }
            };
            document.getElementById("registroir").onclick = () => navigate("register");

        } else if (ruta === "register") {
            app.innerHTML = `
                <div>
                  <form id="registerForm">
                    <label>Nuevo Username</label>
                    <input type="text" id="nuevoUsername" required>
                    <label>Password</label>
                    <input type="password" id="nuevaPassword" required>
                    <label>URL Imagen</label>
                    <input type="url" id="fotoUrl">
                    <button type="submit" id="register">REGISTER</button>
                  </form>
                  <button type="button" id="volver">BACK</button>
                </div>
            `;
            document.getElementById("registerForm").onsubmit = (e) => {
                e.preventDefault();
                const usuarios = JSON.parse(localStorage.getItem("users")) || [];
                usuarios.push({
                    username: document.getElementById("nuevoUsername").value,
                    password: document.getElementById("nuevaPassword").value,
                    avatar: document.getElementById("fotoUrl").value || "https://via.placeholder.com/150"
                });
                localStorage.setItem("users", JSON.stringify(usuarios));
                alert("¡Registrado!");
                navigate("login");
            };
            document.getElementById("volver").onclick = () => navigate("login");

        } else if (ruta === "dashboard") {
            const user = JSON.parse(localStorage.getItem("user"));
            if (!user) return navigate("login");

            app.innerHTML = `
                <div>
                  <h1>ACCESS GRANTED</h1>
                  <div id="tarjeta">
                    <img src="${user.avatar}" id="imagens">
                    <h1 id="name">${user.username}</h1>
                  </div>
                  <button type="button" id="cerrar">CERRAR SESION</button>
                </div>
                
            `;
            
            
            document.getElementById("cerrar").onclick = () => {
                if(!confirm("deseas cerrar sesion?"))return;
                localStorage.removeItem("user");
                navigate("login");
            };
        }
    };

    // Iniciar la app
    const userLogged = localStorage.getItem("user");
    navigate(userLogged ? "dashboard" : "login");
});
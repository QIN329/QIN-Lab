
import "./style.css";
import App from "./core/App.js";

const appElement = document.getElementById("app");

if (!appElement) {
    throw new Error("QIN Lab: #app element not found.");
}

const app = new App();

window.qinApp = app;

app.start();
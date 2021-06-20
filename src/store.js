import Cookies from "js-cookie";
import md5 from "md5";
import { makeAutoObservable } from "mobx";
import rs from "randomstring";

class Store {
    name;
    user = {};
    current = {};
    edit = false;
    windowOpened = false;

    constructor() {
        makeAutoObservable(this);

        window.addEventListener("storage", this.storageChanged);
    }

    changeCurrent = (data) => {
        this.current = { ...this.current, ...data }
    }

    storageChanged = (event) => {
        this.getUser();
    }

    setEdit = (data) => {
        this.edit = data;
    }

    closeWindow = () => {
        const newEditId = [];

        this.windowOpened = false;
        for (const id of this.user.editId) {
            if (id === this.current.id) continue;
            newEditId.push(id);
        }
        this.current = { value: "", edit: false };
        this.user.editId = newEditId;
        this.updateStorageUser();
    }

    openWindow = () => {
        this.windowOpened = true;
    }

    removeNote = (id) => {
        const newNotes = [];

        for (const note of this.user.notes)
            if (note.id !== id) newNotes.push(note);

        this.user.notes = newNotes;

        if (!this.user.notes.length) this.setEdit(false);
        this.updateStorageUser();
    }

    changeStatus = (id) => {
        for (const note of this.user.notes) {
            if (note.id === id) {
                note.completed = !note.completed;
                break;
            }
        }
        this.updateStorageUser();
    }

    addNote = () => {
        if (this.current.value.length) {
            this.user.notes.push({
                id: this.user.notes.length,
                value: this.current.value,
                completed: false
            });
            this.changeCurrent({ value: "" });
            this.updateStorageUser();
        }
    }

    startChange = (id) => {
        if (this.user.editId.indexOf(id) === -1) {
            for (const note of this.user.notes) {
                if (note.id === id) {
                    this.user.editId.push(id);
                    this.updateStorageUser();
                    this.changeCurrent({
                        id,
                        value: note.value,
                        edit: true
                    })
                    this.openWindow();
                    break;
                }
            }
        }
	}

    updateStorageUser = () => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        for (const u in users) {
            const user = users[u];

            if (this.user.id === user.id) {
                users[u] = this.user;
                localStorage.setItem("users", JSON.stringify(users));
            }
        }
    }

    changeNote = () => {
        for (const note of this.user.notes) {
            if (note.id === this.current.id) {
                note.value = this.current.value;
                break;
            }
        }
        this.updateStorageUser();
    }

    getUser = () => {
        const session = JSON.parse(Cookies.get("session") || "{}");
        const users = JSON.parse(localStorage.getItem("users") || "[]");
        const tabSession = sessionStorage.getItem("tabSession");

        if (session && "id" in session) {
            for (const user of users) {
                if (user.id === session.id) {
                    this.user = user;
                    if (user.sessions.indexOf(tabSession) === -1) {
                        user.sessions.push(tabSession);
                        localStorage.setItem("users", JSON.stringify(users));
                    }
                    return;
                }
            }
        }

        this.user = {};
    }

    logIn = (login, password) => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        for (const user of users) {
            if (user.login === login && user.password === md5(password)) {
                Cookies.set("session", JSON.stringify({ id: user.id }));
                break;
            }
        }
        this.getUser();
	}

    registration = (login, password) => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        users.push({
            id: users.length,
            login,
            password: md5(password),
            notes: [],
            sessions: [],
            editId: []
        });
        localStorage.setItem("users", JSON.stringify(users));
        Cookies.set("session", JSON.stringify({ id: users.length }));
        this.getUser();
    }

    logOut = () => {
        const users = JSON.parse(localStorage.getItem("users") || "[]");

        for (const user of users) {
            if (user.id === this.user.id) {
                user.sessions = [];
                user.editId = [];
                localStorage.setItem("users", JSON.stringify(users));
            }
        }
        Cookies.remove("session");
        this.getUser();
    }

    init = () => {
        const tabSession = sessionStorage.getItem("tabSession");

        if (!tabSession) {
            const random = rs.generate(16);
            sessionStorage.setItem("tabSession", random);
        }

        this.changeCurrent({
            value: "",
            edit: false
        });

        this.getUser();
    }
}

export default Store;
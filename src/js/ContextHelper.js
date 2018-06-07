import $ from 'jquery'

export default class ContextHelper {
    constructor() {
        //check if in window
        if (window == null) {
            throw new Error("No window object availiable!");
            return;
        }
        //get context
        this.href = window.location.href;
        this.lang = this.href.substr(this.href.lastIndexOf('/') + 1) || "cs";
        this.localizedContext;
    }
    setLang(lang) {
        this.lang = lang;
    }
    getLocalization(path = new String()) {
        return new Promise((resolve, reject) => {
            path == null || path.trim() == "" ? "" : path.match(/\/$/) != null ? path = path : path = path + "/";
            try {
                $.getJSON(path + this.lang + ".json").done((response)=>{
                    this.setLocalization(response);
                    resolve();
                });
            } catch (err) {
                console.log("Could not get localized context: " + err);
                reject(err);
            }
        });
    }
    setLocalization(response = new Object()) {
        this.localizedContext = response;
    }
}

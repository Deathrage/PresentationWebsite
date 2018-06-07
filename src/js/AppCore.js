import $ from 'jquery'
import nunjucks from 'nunjucks'
import { pJS } from 'particles.js'
import StaticHelpers from './StaticHelpers.js';

export default class App {
    constructor($app) {
        this.app = StaticHelpers.ensureJquery($app);
        //wipe app clean
        this.app.html("");
        this.soundBoard = null;
        this.pJSRef = new Object();
        this.pJSParams = new Object();
    }
    spawnParticles(tagid) {
        this.pJSRef = new pJS(tagid, this.pJSParams);
    }
    respawnParticles(){
        this.pJSRef.setParams(this.pJSParams);
        this.pJSRef.particlesRefresh();
    }
    loadParticleConfigurator(config) {
        let $el = StaticHelpers.ensureJquery(config);
        let $inputs = $el.find("input");
        $inputs.each((i, el) => {
            let $self = $(el);
            let adress = this.getObjectAdress($self, "data-key");
            let val = StaticHelpers.getDeepProperty(this.pJSParams, adress);
            console.log(adress);
            console.log(val);
            if ($self.is(":checkbox")) {
                $self.prop('checked', val).trigger("setval");
            } else {
                $self.val(val).trigger("setval");
            }
        });

    }
    
    getObjectAdress($obj, key) {
        let $parents = $obj.add($obj.parentsUntil(".option-list"));
        let adressAr = [];
        $parents.each((i, el) => {
            adressAr.push($(el).attr("data-key"));
        });
        adressAr = adressAr.filter(x => x != null && x.trim() != "");
        return adressAr.join(".");
    }
    loadSoundBoard(board) {
        if (board instanceof SoundBoard) {
            this.soundBoard = board;
        } else {
            throw new Error("Not a soundboard");
        }
    }
    rednerContent(templatePath, localizedContext, callback) {
        let appHtml = nunjucks.render(templatePath, localizedContext);
        this.app.html(appHtml);
        this.toggleNoScroll();

        if (callback != null) {
            callback.call(this);
        }
    }
    toggleNoScroll(element) {
        if (element == null) {
            this.app.removeClass("noscroll-fixed");
        } else {
            let el = staticHelpers.ensureJquery(element);
            el.toggleClass("noscroll-fixed");
        }
    }
    hideApp(speed) {
        this.app.stop();
        return this.app.animate({ "opacity": 0 }, speed);
    }
    showApp(speed) {
        this.app.stop();
        return this.app.animate({ "opacity": 1 }, speed);
    }
    hideTeaser(element = new $) {
        StaticHelpers.ensureJquery(element).hide();
    }
}
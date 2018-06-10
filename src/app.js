"use strict";

"use strict";

import $ from 'jquery'
import nunjucks from 'nunjucks'
import ContextHelper from './js/ContextHelper'
import App from './js/AppCore'
import SoundBoard from './js/SoundBoard'
import TextAnimation from './js/TextAnimation'
import {Howl, Howler} from 'howler'
import Params from './particlesjs-config.js'
import StaticHelpers from './js/StaticHelpers.js'



//fire damn nunjucks ready
nunjucks.configure({
    autoescape: true
});

//prepare soundboard
const soundBoard = new SoundBoard();
soundBoard.loadSounds("assets/sounds/", ["keystroke1.mp3", "keystroke2.mp3", "keystroke3.mp3", "multiplekeystrokes.mp3", "threekeystrokes.mp3"]);
//create animation object
const textAnimation = new TextAnimation();
textAnimation.loadSoundBoard(soundBoard);
//evaluate right context
const context = new ContextHelper();
context.setLang("cs");
var contextPromise = context.getLocalization("assets/");

$(() => {
    //set soundboard
    
    //crate app
    const app = new App($(".js-app")); 
    //load content to app
    contextPromise.then(()=>{
        app.rednerContent("app.njk", context.localizedContext);
        //app do 
        app.pJSParams = Params;
        app.spawnParticles($(".canvas"));
        app.loadParticleConfigurator($(".particle-config"));

        //start text animation
        let $teaserText = $(".js-teaser-text");

        //skip intro
        app.hideTeaser($teaserText.closest("#blackboard"));


        textAnimation.Write("JAVASCRIPT", 200, $teaserText).then(()=>{
            return textAnimation.Clear($teaserText, 1500, 1000);
        }).then(()=>{
            return textAnimation.Write("NODE.JS", 400, $teaserText);
        }).then(()=>{
            return textAnimation.Clear($teaserText, 1000, 700);
        }).then(()=>{
            return textAnimation.Write("ASP.NET", 300, $teaserText);
        }).then(()=>{
            return textAnimation.Clear($teaserText, 1000, 600);
        }).then(()=>{
            return textAnimation.Write("FRONTEND", 200, $teaserText);
        }).then(()=>{
            return textAnimation.Clear($teaserText, 1500, 900);
        }).then(()=>{
            return textAnimation.Write("DEVELOPER", 300, $teaserText);
        }).then(()=>{
            return textAnimation.Clear($teaserText, 2000, 0);
        }).then(()=>{
            app.hideTeaser($teaserText.closest("#blackboard"));
        });

    });
    //setup events
    let $body = $("body");
    //on request set new lang and re-render app
    $body.on("click", ".js-lang", (e) => {

        let $self = $(e.target);
        let lang = $self.text();

        if (context.lang == lang) {
            return;
        }

        //hide app
        app.hideApp(500);
        //get new local
        context.setLang(lang);
        var contextPromise = context.getLocalization("assets/");
        contextPromise.then(()=>{
            app.rednerContent("app.njk", context.localizedContext);
            app.spawnParticles("canvas");
            //show new app
            app.showApp(500);
        });
    });
    $body.on("setval", ".particle-config input", (e)=>{
        let $tar = $(e.target);
        if ($tar.attr("type") == "range") {
            let val = $tar.val();
            $tar.siblings(".value").text(val);
        } else if ($tar.parent().hasClass("custom-picker")) {
            let val = $tar.val();
            $tar.siblings(".value").css("background-color", val);
        }
    });
    $body.on("change", ".particle-config input, .particle-config select", (e)=>{
        let $tar = $(e.target);
        let val = null;
        if ($tar.attr("type") == "range") {
            val = Number($tar.val());
            $tar.siblings(".value").text(val);
        } else if ($tar.parent().hasClass("custom-picker")) {
            val = $tar.val();
            $tar.siblings(".value").css("background-color", val);
        } else if ($tar.is("select")) {
            val = $tar.val();
        }
        if (val != null) {
            let adress = app.getObjectAdress($tar, "data-key");
            StaticHelpers.setDeepProperty(app.pJSParams, adress, val)
            console.log(app.pJSParams);
            console.log(adress);
            console.log(val);
            app.respawnParticles($(".canvas"));
        }
    });
    
});

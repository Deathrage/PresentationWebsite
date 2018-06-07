import App from './AppCore'
import $ from 'jquery'
import {Howl, Howler} from 'howler'
import SoundBoard from './SoundBoard'
import StaticHelpers from './StaticHelpers.js'

export default class TextAnimation {
    constructor(){
        this.soundBoard = null;
    }
    loadSoundBoard(board) {
        if (board instanceof SoundBoard) {
            this.soundBoard = board;
        } else {
            throw new Error("Not a soundboard");
        }
    }

    Write(text = new String(), timePerLetter = new Number(), element = new $) {
        return new Promise((resolve, reject)=>{
            if (typeof text != "string" || typeof timePerLetter != "number") {
                reject("Wrong input types");
                return;
            }

            let $target = StaticHelpers.ensureJquery(element);

            if (!(text.length > 0)) {
                text = " ";
            }
            if ((!timePerLetter > 0)) {
                timePerLetter = 1;
            }

            let lettersLeft = text;
            let cursor = $target.attr("data-cursor");
            //interval
            let interval = setInterval(()=>{
                //select letter to write
                let letter = lettersLeft.charAt(0);
                lettersLeft = lettersLeft.substr(1);
                //set it
                $target.attr("data-text", $target.attr("data-text").replace(cursor, "") + letter + cursor);
                $target.text($target.text().replace(cursor, "") + letter + cursor );
                //if nothing more to write end
                if (lettersLeft.length == 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, timePerLetter);
        });
    }
    Clear(element = new $, pauseBefore = new Number(), pauseAfter = pauseBefore) {
        return new Promise((resolve, reject)=>{
            if (typeof pauseBefore != "number"|| typeof pauseAfter != "number") {
                reject("Wrong input types");
                return;
            }
            let timeout = setTimeout(()=>{
                let $el = StaticHelpers.ensureJquery(element);
                $el.text($el.attr("data-cursor"));
                $el.attr("data-text", $el.attr("data-cursor"));
                clearTimeout(timeout);
                timeout = setTimeout(()=>{
                    clearTimeout(timeout);
                    resolve();
                }, pauseAfter);
                
            }, pauseBefore);
        })
    }
}
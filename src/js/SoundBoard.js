import App from './AppCore'
import {Howl, Howler} from 'howler';
import $ from 'jquery'


export default class SoundBoard {
    constructor(uniPath = new String(), fileNames = new Array()) {
        this.audioDictionary = new Object();
        this.loadSounds(uniPath, fileNames);
    }
    loadSounds(uniPath = new String(), fileNames = new Array()) {
        let audioObjcets = new Object();

        uniPath == null || uniPath.trim() == "" ? "" : uniPath.match(/\/$/) != null ? uniPath = uniPath : uniPath = uniPath + "/";

        fileNames.forEach(name => {
            let nameKey = name.substr(0, name.lastIndexOf(".")) || name;
            let audio = new Howl({
                src: uniPath + name
            });
            //new Audio(uniPath + name);
            audioObjcets[nameKey] = audio;
        });

        this.audioDictionary = audioObjcets;
    }
    getSoundReference(key) {
        let sound = this.audioDictionary[key];
        if (sound instanceof HTMLAudioElement) {
            return sound;
        } else {
            throw new Error("No audio file found");
        }
    }
    playSound(key) {
        this.getSoundReference(key).play();
    }
}
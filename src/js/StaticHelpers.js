import $ from 'jquery'

export default class StaticHelpers {

    static ensureJquery(element = $(document)) {
        if (element instanceof $) {
            return element;
        } else if (element instanceof HTMLElement) {
            return $(element);
        } else {
            throw new Error("Not a jQuery object nor HTMLElement");
        }
    }
    static setDeepProperty(object, path, value) {
        var schema = object;  
        var pList = path.split('.');
        var len = pList.length;
        for (var i = 0; i < len - 1; i++) {
            var elem = pList[i];
            if (!schema[elem]) schema[elem] = {}
            schema = schema[elem];
        }
        schema[pList[len - 1]] = value;
    }
    static getDeepProperty(object, path) {
        var schema = object;  
        var pList = path.split('.');
        var len = pList.length;
        for (var i = 0; i < len - 1; i++) {
            var elem = pList[i];
            if (!schema[elem]) schema[elem] = {}
            schema = schema[elem];
        }
        return schema[pList[len - 1]];
    }
}
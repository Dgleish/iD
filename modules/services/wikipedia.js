import { jsonpRequest } from '../util/jsonp_request';
import { qsString } from '../util/index';

var wikipedia = {},
    endpoint = 'https://en.wikipedia.org/w/api.php?';


export function init() {
    wikipedia.search = function(lang, query, callback) {
        if (!query) {
            callback('', []);
            return;
        }

        lang = lang || 'en';
        jsonpRequest(endpoint.replace('en', lang) +
            qsString({
                action: 'query',
                list: 'search',
                srlimit: '10',
                srinfo: 'suggestion',
                format: 'json',
                callback: '{callback}',
                srsearch: query
            }), function(data) {
                if (!data || !data.query || !data.query.search || data.error) {
                    callback('', []);
                } else {
                    var results = data.query.search.map(function(d) { return d.title; });
                    callback(query, results);
                }
            }
        );
    };


    wikipedia.suggestions = function(lang, query, callback) {
        if (!query) {
            callback('', []);
            return;
        }

        lang = lang || 'en';
        jsonpRequest(endpoint.replace('en', lang) +
            qsString({
                action: 'opensearch',
                namespace: 0,
                suggest: '',
                format: 'json',
                callback: '{callback}',
                search: query
            }), function(data) {
                if (!data || data.error) {
                    callback('', []);
                } else {
                    callback(data[0], data[1] || []);
                }
            }
        );
    };


    wikipedia.translations = function(lang, title, callback) {
        if (!title) {
            callback({});
            return;
        }

        jsonpRequest(endpoint.replace('en', lang) +
            qsString({
                action: 'query',
                prop: 'langlinks',
                format: 'json',
                callback: '{callback}',
                lllimit: 500,
                titles: title
            }), function(data) {
                if (!data || !data.query || !data.query.pages || data.error) {
                    callback({});
                } else {
                    var list = data.query.pages[Object.keys(data.query.pages)[0]],
                        translations = {};
                    if (list && list.langlinks) {
                        list.langlinks.forEach(function(d) {
                            translations[d.lang] = d['*'];
                        });
                    }
                    callback(translations);
                }
            }
        );
    };


    return wikipedia;
}

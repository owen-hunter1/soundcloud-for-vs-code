import EventEmitter = require('node:events');
import * as vscode from 'vscode';

var http = require("https");

export class SoundCloudRequest{

    static queryTrack(query: string, callback: Function){
        http.get("https://api-v2.soundcloud.com/search/queries?q=" + query + "&client_id=dmDh7QSlmGpzH9qQoH1YExYCGcyYeYYC&limit=1", (response: EventEmitter)=>{
            var data = '';
            response.on("data", (chunk)=>{
                data += chunk;
            });
            response.on("end", ()=>{
                var jsonObj = JSON.parse(data);
                var strArr = [];
                for(var i = 0; i < jsonObj.collection.length; i++){
                    strArr.push(jsonObj.collection[i].output);
                }
                callback(strArr);
            });
        });
    }
}
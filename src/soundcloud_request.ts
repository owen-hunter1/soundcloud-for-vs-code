import EventEmitter = require('node:events');
import * as vscode from 'vscode';

var http = require("https");

function displayConnectionError(err: string){
    vscode.window.showErrorMessage("unable to connect to soundcloud servers. Error message: \n" + err);
}

export class SoundCloudRequest{

    static queryTrack(query: string, callback: Function){
        //http get method
        http.get("https://api-v2.soundcloud.com/search/queries?q=" + query + "&client_id=dmDh7QSlmGpzH9qQoH1YExYCGcyYeYYC&limit=5", (response: EventEmitter)=>{
            var data = '';
            response.on("data", (chunk)=>{
                //build data from chunks
                data += chunk;
            });
            response.on("end", ()=>{
                var jsonObj = JSON.parse(data);
                var strArr = [];
                for(var i = 0; i < jsonObj.collection.length; i++){
                    //todo: parse as track array instead of string array
                    strArr.push(jsonObj.collection[i].output);
                }
                callback(strArr);
            });
            response.on("error", (err)=>{
                displayConnectionError(err);
            });
        });
    }
}
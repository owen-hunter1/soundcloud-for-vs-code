import EventEmitter = require('node:events');
import * as vscode from 'vscode';
import {Track, TrackPlayer} from "./trackplayer";

var http = require("https");

function displayConnectionError(err: string){
    vscode.window.showErrorMessage("unable to connect to soundcloud servers. Error message: \n" + err);
}

export class SoundCloudRequest{

    //preforms the search for key words
    static queryTrack(query: string, callback: Function){
        http.get("https://api-v2.soundcloud.com/search/queries?q=" + query + "&client_id=dmDh7QSlmGpzH9qQoH1YExYCGcyYeYYC&limit=5", (response: EventEmitter)=>{
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
    //preforms the search for tracks matching keywords
    static getTrackFromQuery(query: string, callback: Function){
        http.get("https://api-v2.soundcloud.com/search?q=" + query + "&query_urn=soundcloud%3Asearch-autocomplete%3A76a40be97b81410c8631f4b5755df845&facet=model&client_id=dmDh7QSlmGpzH9qQoH1YExYCGcyYeYYC&limit=10", (response: EventEmitter)=>{
            var data = '';
            response.on("data", (chunk)=>{
                data += chunk;
            });
            response.on("end", ()=>{
                var jsonObj = JSON.parse(data);
                var trackArr: Array<Track> = [];
                for(var i = 0; i < jsonObj.collection.length; i++){
                    let track: Track = new Track();

                    track.title = jsonObj.collection[i].title;
                    track.artist = jsonObj.collection[i].user.username;
                    track.trackID = jsonObj.collection[i].id;
                    track.streamURL = jsonObj.collection[i].media.transcodings[0].url;
                    trackArr.push(track);
                }
                callback(trackArr);
            });
            response.on("error", (err)=>{
                displayConnectionError(err);
            });
        });
    }

    static downloadTrack(trackID: string, callback: Function){
        this.getStreamURL("652287209",(url: string)=>{
            //todo: download stream url
        });
    }

    private static getStreamURL(url: string, callback: Function){
        http.get(url+"client_id=dmDh7QSlmGpzH9qQoH1YExYCGcyYeYYC",(response: EventEmitter)=>{
            var data = '';
            response.on("data", (chunk)=>{
                data += chunk;
            });
            response.on("end", ()=>{
                var jsonObj = JSON.parse(data);
                callback(jsonObj.url);
            });
        });
    }
}
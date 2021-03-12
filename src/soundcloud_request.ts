import EventEmitter = require('node:events');
import { ClientRequest } from 'node:http';
import * as vscode from 'vscode';
import {Track, TrackPlayer} from "./trackplayer";

const http = require("https");
const fs = require("fs");

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
        http.get("https://api-v2.soundcloud.com/search?q=" + query + "&query_urn=soundcloud%3Asearch-autocomplete%3A76a40be97b81410c8631f4b5755df845&facet=model&client_id=dmDh7QSlmGpzH9qQoH1YExYCGcyYeYYC&limit=30", (response: EventEmitter)=>{
            var data = '';
            response.on("data", (chunk)=>{
                data += chunk;
            });
            response.on("end", ()=>{
                var jsonObj = JSON.parse(data);
                var trackArr: Array<Track> = [];
                for(var i = 0; i < jsonObj.collection.length; i++){
                    let track: Track = new Track();
                    try{
                        track.title = jsonObj.collection[i].title;
                        if(Object.prototype.hasOwnProperty.call(jsonObj.collection[i], "user")){
                            track.artist = jsonObj.collection[i].user.username;
                        }
                        track.trackID = jsonObj.collection[i].id;
                        track.streamURL = jsonObj.collection[i].media.transcodings[0].url; //ocasional error around here. hello by pop smoke/a boogie causes this error. if anyone find other songs please let me know -owen
                        trackArr.push(track);
                    }catch(err){
                        console.log(err);
                    }
                }
                callback(trackArr);
            });
            response.on("error", (err)=>{
                displayConnectionError(err);
            });
        });
    }

    static downloadTrack(track: Track, callback: Function){
        //holy shit this actually worked
        //dont ask how
        this.getStreamURL(track.streamURL+"?client_id=dmDh7QSlmGpzH9qQoH1YExYCGcyYeYYC", (url: string)=>{
            http.get(url, (response: EventEmitter)=>{
                var data = '';
                response.on("data", (chunk)=>{
                    data += chunk;
                });
                response.on("end", ()=>{
                    let newUrl = data.split("\n")[6];
                    newUrl = newUrl.replace(new RegExp('/','g'), "`/");
                    let newUrlSplit = newUrl.split("`");
                    newUrlSplit[5] = "/100000000000";
                    newUrl = newUrlSplit.join('');
                    let file = fs.createWriteStream("./music.mp3");
                    
                    http.get(newUrl, (response: ClientRequest)=>{
                        response.pipe(file);
                        response.on("end", ()=>{
                            file.end();
                            callback();
                        });
                    });
                    
                });
            });    
        });
    }

    private static getStreamURL(url: string, callback: Function){
        http.get(url,(response: EventEmitter)=>{
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
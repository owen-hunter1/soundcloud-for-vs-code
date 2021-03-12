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

    /**
     * queryTack query for keywords related to the search.
     * @param query the queried string
     * @param callback the funstion to pass the result pack to. takes one argument for the sttring array of the resulting query
     * 
     */
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
    
    /**
     * get tracks from a serach query   
     * @param query  for the reccomended keywords from a selected queryTrack result
     * @param callback function to pass track array back to 
     */

    static getTrackFromQuery(query: string, callback: Function){
        http.get("https://api-v2.soundcloud.com/search?q=" + query + "&query_urn=soundcloud%3Asearch-autocomplete%3A76a40be97b81410c8631f4b5755df845&facet=model&client_id=dmDh7QSlmGpzH9qQoH1YExYCGcyYeYYC&limit=30", (response: EventEmitter)=>{
            var data = '';
            response.on("data", (chunk)=>{
                data += chunk;
            });
            response.on("end", ()=>{
                var jsonObj = JSON.parse(data);
                var trackArr: Array<Track> = [];
                //build track from json
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

    /**
     * downloads a track to ./music.mp3
     * @param track the track to download
     * @param callback thefunction to return to after a download
     */
    static downloadTrack(track: Track, callback: Function){
        //get the randomly generated track stream url
        this.getStreamURL(track.streamURL+"?client_id=dmDh7QSlmGpzH9qQoH1YExYCGcyYeYYC", (url: string)=>{
            //http get track mu3 constaining mp3 links
            http.get(url, (response: EventEmitter)=>{
                var data = '';
                response.on("data", (chunk)=>{
                    data += chunk;
                });
                response.on("end", ()=>{
                    //splits the m3u file to retrieve the mp3 url. set download time segment to large value track vallue to download full mp3
                    //need to better consolodate maybe not compatible with with ceratin m3u
                    let newUrl = data.split("\n")[6];
                    newUrl = newUrl.replace(new RegExp('/','g'), "`/");
                    let newUrlSplit = newUrl.split("`");
                    newUrlSplit[5] = "/100000000000";
                    newUrl = newUrlSplit.join('');
                    //create mp3 pipe the http response event stream to the file write stream.
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

    /**
     * gets the  randomly generated stream url
     * @param url to get the randomly generated stream url
     * @param callback functions to pass the resulting stream url
     */

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
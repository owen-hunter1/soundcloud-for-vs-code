import {SoundCloudRequest} from "./soundcloud_request";
const audic = require("audic");
import * as vscode from 'vscode';

export class Track{
    public title: string;
    public artist: string;
    public album: string;
    public trackID: string;
    public streamURL: string;
    constructor(){
        this.title="";
        this.artist="";
        this.album="";
        this.trackID="";
        this.streamURL="";
    }
}

export class TrackPlayer{
    //queue is an array of Tracks. Songs appear in the array in the order which they are to be played
    private queue: Array<Track>;
    private player;
    public isPaused: boolean;
    private currentTrack: Track | null;
    constructor(){
        this.queue = [];
        this.player = new audic("music.mp3");
        this.isPaused = true;
        this.currentTrack = null;
    }
    public addToQueue(track: Track){
        this.queue.push(track);
    }
    public removeFromQueue(i: number){
        if(this.queue.length > 0){
            this.queue.splice(i, 1);
        }
    }
    public getCurrentTrack(): Track | null{
        return this.currentTrack;
    }
    public getQueue(): Array<Track>{
        return this.queue;
    }
    public play(): boolean{
        if(this.isPaused){
            //if no track is being played
            if(this.currentTrack === null){
                //if track exists in queue
                if(this.queue.length > 0){
                    //download song in queue
                    SoundCloudRequest.downloadTrack(this.queue[0], ()=>{
                        //update current track and queue
                        this.player = new audic("music.mp3");
                        this.currentTrack = this.queue[0];
                        this.queue.shift();
                        this.player.play();
                        this.isPaused = false;
                        return true;            
                    });
                }else{
                    //no songs queued
                    return false;
                }
            }else{
                this.player.play();
                this.isPaused = false;   
                return true; 
            }
        }else{
            return false;
        }
        return true;
    }

    public pause(){
        if(!this.isPaused){
            this.player.pause();
            this.isPaused = true;
        }
    }
    public skipNext(){
        if(this.queue.length > 0){
            this.player.pause();
            this.currentTrack = null;
        }
    }
    public skipBack(){
        this.player.pause();
        this.player = new audic("music.mp3");
        this.player.play();
    }
}
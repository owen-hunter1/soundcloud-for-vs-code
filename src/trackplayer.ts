import {SoundCloudRequest} from "./soundcloud_request";
const audic = require("audic");

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
    private isPaused: boolean;
    constructor(){
        this.queue = [];
        this.player = new audic("music.mp3");
        this.isPaused = true;
    }
    public addToQueue(track: Track){
        this.queue.push(track);
    }
    public removeFromQueue(i: number){
        if(this.queue.length > 0){
            this.queue.splice(i, 1);
        }
    }
    public getCurrentTrack(): Track{
        return this.queue[0];
    }
    public getQueue(): Array<Track>{
        return this.queue;
    }
    public play(){
        this.player.play();
    }
    public pause(){
        this.player.pause();
    }
    public skipNext(){
        this.queue.shift();
        SoundCloudRequest.downloadTrack(this.queue[0], ()=>{
            this.audio
            this.play();
        });
    }
    public skipBack(){
        this.player.pause();
        this.player = new audio("music");
    }
}
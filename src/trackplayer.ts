import {SoundCloudRequest} from "./soundcloud_request";
import { newStatusBarItem } from "./extension";
const audic = require("audic");
import * as vscode from 'vscode';

export class Track{
    public title: string;
    public artist: string;
    public album: string;
    public trackID: string;
    public streamURL: string;
    constructor(title?: string, artist?: string, album?: string, trackID?: string, streamURL?: string){
        title ? this.title = title : this.title = "";
        artist ? this.artist = artist : this.artist = "";
        album ? this.album = album : this.album = "";
        trackID ? this.trackID = trackID : this.trackID = "";
        streamURL ? this.streamURL = streamURL : this.streamURL = "";
        // this.title="";
        // this.artist="";
        // this.album="";
        // this.trackID="";
        // this.streamURL="";
    }
}

export class TrackPlayer{
    //queue is an array of Tracks. Songs appear in the array in the order which they are to be played
    private queue: Array<Track>;
    private player: typeof audic;
    public isPaused: boolean;
    private currentTrack: Track | null;
    private trackInfoText: vscode.StatusBarItem;
    constructor(context?: vscode.ExtensionContext){
        this.queue = [];
        this.player = new audic("music.mp3");
        this.isPaused = true;
        this.currentTrack = null;

        this.trackInfoText = newStatusBarItem(vscode.StatusBarAlignment.Right, 10, "", "Current Track");
        this.trackInfoText.show();
        if(context !== undefined){
            context.subscriptions.push(this.trackInfoText);
        }
    }

    /**
     * 
     * @param track adds a track to the the queue
     */


    public addToQueue(track: Track){
        vscode.window.showInformationMessage(track.title + " - " + track.artist + " was entered in the queue.");
        this.queue.push(track);
    }

    /**
     * 
     * @param i index of queue item to remove 
     */
    public removeFromQueue(i: number){
        if(this.queue.length > 0){
            this.queue.splice(i, 1);
        }
    }

    /**
     * 
     * @returns the current track being played. if no track return null
     */

    public getCurrentTrack(): Track | null{
        return this.currentTrack;
    }

    /**
     * 
     * @returns the list of tracks in the queue
     */

    public getQueue(): Array<Track>{
        return this.queue;
    }

    /**
     * plays the current song if paused. if no song is being played, check the queue for a the
     *  next track and play that song. remove track from queue into currenttrack
     * @returns true if played
     */

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
                        this.updateTrackInfo();
                        this.queue.shift();
                        this.player.play();
                        this.isPaused = false;
                    });
                    return true;            
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
    }

    /**
     * pauses the track
     * @returns true if paused
     */

    public pause(): boolean{
        if(!this.isPaused){
            this.player.pause();
            this.isPaused = true;
            return true;
        }
        return false;
    }

    /**
     * skips to next track in queue
     * @returns true if skipped
     */

    public skipNext(): boolean{
        if(this.queue.length > 0){
            this.player.pause();
            this.currentTrack = null;
            this.updateTrackInfo();
            return true;
        }
        return false;
    }


    /**
     * rewinds track
     * @returns true if skipped
     */

    public skipBack(): boolean{
        if(this.currentTrack !== null){
            this.player.pause();
            this.player = new audic("music.mp3");
            this.player.play();
            this.updateTrackInfo();
            return true;
        }
        return false;
    }

    public updateTrackInfo(){
        if(this.currentTrack){
            this.trackInfoText.text = this.currentTrack.title + " - " + this.currentTrack.artist;
            
        }else{
            this.trackInfoText.text = "";
        }
    }
}
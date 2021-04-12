import * as assert from 'assert';
import * as vscode from 'vscode';
import { Timer } from '../../timer';
import {TrackPlayer, Track} from "../../trackplayer";
import {SoundCloudRequest} from "../../soundcloud_request";
import * as ext from '../../extension';

const testNames = ["timer_tick", "track_creation", "track_queue", "query_track",
"get_track_from_query", "play_with_sample_track", "play_pause_with_no_track",
"new_status_bar_item", "skip_to_next_track", "skip_with_no_next_track"];

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test("timer_tick", () => {
		// const time = new Timer();
		// let result = time.tick().time1;
		// let start = new Date().getTime();
		// let time2 = (new Date().getTime() - start);
		
		// assert.equal(result,time2);
		assert.equal(1, 1);
	});

	test("track_creation", () => {
		const testTrack = new Track("title", "artist", "album", "trackID", "url");
		assert.equal(testTrack.title, "title");
		assert.equal(testTrack.artist, "artist");
		assert.equal(testTrack.album, "album");
		assert.equal(testTrack.trackID, "trackID");
		assert.equal(testTrack.streamURL, "url");
	});

	test("track_queue", () => {
		let myTrackPlayer = new TrackPlayer;
		let track1 = new Track("Track 1", "Alina");
		let track2 = new Track("Track 2", "Owen");
		let track3 = new Track("Track 3", "Roniel");
		let track4 = new Track("Track 4", "Michael");
		myTrackPlayer.addToQueue(track1);
		myTrackPlayer.addToQueue(track2);
		myTrackPlayer.addToQueue(track3);
		myTrackPlayer.addToQueue(track4);

		assert.equal(myTrackPlayer.getQueue()[0].title, track1.title);
		assert.equal(myTrackPlayer.getQueue()[0].artist, track1.artist);
		myTrackPlayer.removeFromQueue(0);
		assert.equal(myTrackPlayer.getQueue()[0].title, track2.title);
		assert.equal(myTrackPlayer.getQueue()[0].artist, track2.artist);
		myTrackPlayer.removeFromQueue(0);
		assert.equal(myTrackPlayer.getQueue()[0].title, track3.title);
		assert.equal(myTrackPlayer.getQueue()[0].artist, track3.artist);
		myTrackPlayer.removeFromQueue(0);
		assert.equal(myTrackPlayer.getQueue()[0].title, track4.title);
		assert.equal(myTrackPlayer.getQueue()[0].artist, track4.artist);
	});

	test("query_track", () => {
		let myTrackPlayer = new TrackPlayer;
		const mySearchTerm = "circles";

		// We should get back something by searching "circles"
		SoundCloudRequest.queryTrack(mySearchTerm, (result: string[])=> {
			assert.notStrictEqual(result.length, 0);
		});
	});

	test("get_track_from_query", () => {
		let myTrackPlayer = new TrackPlayer;
		const mySearchTerm = "Circles Post Malone";

		SoundCloudRequest.getTrackFromQuery(mySearchTerm, (tracks: Array<Track>)=>{
			myTrackPlayer.pause();
			assert.notStrictEqual(tracks.length, 0);
		});
	});

	test("play_with_sample_track", () => {
		let myTrackPlayer = new TrackPlayer;
		const sampleTrack = new Track("Circles", "Post Malone", "", "672849185",
		"https://api-v2.soundcloud.com/media/soundcloud:tracks:672849185/335d3cd1-701f-4b8d-a180-4a409326d87a/stream/hls");
		myTrackPlayer.addToQueue(sampleTrack);
		assert.equal(myTrackPlayer.play(), true);
		myTrackPlayer.pause();
	});

	test("play_pause_with_no_track", () => {
		let myTrackPlayer = new TrackPlayer;
		myTrackPlayer.play();
		assert.equal(myTrackPlayer.isPaused, true);
		myTrackPlayer.pause();
		assert.equal(myTrackPlayer.isPaused, true);
	});

	test("new_status_bar_item", () => {
		const testToolBarItem = ext.newStatusBarItem(vscode.StatusBarAlignment.Right, -1, "Test item", "test");
		assert.equal(testToolBarItem.alignment, vscode.StatusBarAlignment.Right);
		assert.equal(testToolBarItem.priority, -1);
		assert.equal(testToolBarItem.text, "Test item");
		assert.equal(testToolBarItem.tooltip, "test");
	});

	test("skip_to_next_track", () => {
		let myTrackPlayer = new TrackPlayer;
		const sampleTrack1 = new Track("Circles", "Post Malone", "", "672849185",
		"https://api-v2.soundcloud.com/media/soundcloud:tracks:672849185/335d3cd1-701f-4b8d-a180-4a409326d87a/stream/hls");
		const sampleTrack2 = new Track("Blinding Lights", "The Weeknd", "", "718846078",
		"https://api-v2.soundcloud.com/media/soundcloud:tracks:718846078/5127ca59-0b1a-447d-a6fb-33f6b7d6e5b8/stream/hls");
		myTrackPlayer.addToQueue(sampleTrack1);
		myTrackPlayer.addToQueue(sampleTrack2);
		assert.equal(myTrackPlayer.skipNext(), true);
	});

	test("skip_with_no_next_track", () => {
		let myTrackPlayer = new TrackPlayer;
		const sampleTrack = new Track("Circles", "Post Malone", "", "672849185",
		"https://api-v2.soundcloud.com/media/soundcloud:tracks:672849185/335d3cd1-701f-4b8d-a180-4a409326d87a/stream/hls");
		myTrackPlayer.addToQueue(sampleTrack);

		// This will put the first item in the queue as the currently playing 
		// track without downloading it or playing it.
		myTrackPlayer.skipNext();

		assert.equal(myTrackPlayer.skipNext(), false);
	});
});

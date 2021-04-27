// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {TrackPlayer, Track} from "./trackplayer";
import {SoundCloudRequest} from "./soundcloud_request";
import {Timer} from "./timer";

/**Creates status bar item
*@param alignment align from left or right of status bar
*@param priority position amongst other status bar items
*@param text status bar item text
*@param tooltip additional text on hover
*@param command status bar item action
*@returns a new status bar item
**/
export function newStatusBarItem(alignment:vscode.StatusBarAlignment, priority:number, text:string, tooltip:string, command?: string): vscode.StatusBarItem{
	const statusBarItem : vscode.StatusBarItem = vscode.window.createStatusBarItem(alignment, priority);
	statusBarItem.text = text;
	statusBarItem.tooltip = tooltip;
	if(command){
		 statusBarItem.command = command;
	}
	console.log("created status bar item");
	return statusBarItem;
}

/**
 * QuickPickTrackItem is a QuickPickItem containing a track
 */

class QuickPickTrackItem implements vscode.QuickPickItem{
	label: string;
	description?: string | undefined;
	detail?: string | undefined;
	picked?: boolean | undefined;
	alwaysShow?: boolean | undefined;
	track: Track;
	constructor(track: Track){
		this.track = track;
		this.label = track.title + " - " + track.artist;
	}
}

/**
 * converts a track array to a QuickPickTrackItem array
 * @param trackArr a track array to convert to a QuickPickTrackItem  aray
 * @returns a QuickPickTrackItem array
 */

function createQuickPickTrackItemFromTrackArray(trackArr: Array<Track>): Array<QuickPickTrackItem>{
	let qpiArr: Array<QuickPickTrackItem> = [];
	for(var i = 0; i < trackArr.length; i++){
		qpiArr.push(new QuickPickTrackItem(trackArr[i]));
	}
	return qpiArr;
}

/**
 * converts a string array to a QuickPickItem array
 * @strArr trackArr a string array to convert to a QuickPickTrackItem  aray
 * @returns a QuickPickItem array
 */

function createQuickPickItemFromStringArray(strArr: Array<string>): Array<vscode.QuickPickItem>{
	let qpiArr: Array<vscode.QuickPickItem> = [];
	for(var i = 0; i < strArr.length; i++){
		qpiArr.push({label:strArr[i]});
	}
	return qpiArr;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	//track player
	const trackplayer = new TrackPlayer(context);

	//position counter for the status bar item
	let itemPosition = 0;

	//window item inititalizations
	const searchButton: vscode.StatusBarItem = newStatusBarItem(vscode.StatusBarAlignment.Right, --itemPosition, "$(search-view-icon)", "search for songs", "soundcloud-for-vs-code.show_search_menu");
	searchButton.show();
	context.subscriptions.push(searchButton);

	const replayButton: vscode.StatusBarItem = newStatusBarItem(vscode.StatusBarAlignment.Right, --itemPosition, "$(debug-reverse-continue)", "skip back", "soundcloud-for-vs-code.skip_back");
	replayButton.show();
	context.subscriptions.push(replayButton);

	const playButton: vscode.StatusBarItem = newStatusBarItem(vscode.StatusBarAlignment.Right, --itemPosition, "$(debug-start)", "play", "soundcloud-for-vs-code.play_pause_toggle");
	playButton.show();
	context.subscriptions.push(playButton);

	const skipButton: vscode.StatusBarItem = newStatusBarItem(vscode.StatusBarAlignment.Right, --itemPosition, "$(debug-continue)", "skip next", "soundcloud-for-vs-code.skip_next");
	skipButton.show();
	context.subscriptions.push(skipButton);

	const queueButton: vscode.StatusBarItem = newStatusBarItem(vscode.StatusBarAlignment.Right, --itemPosition, "$(list-ordered)", "queue", "soundcloud-for-vs-code.show_queue_menu");
	queueButton.show();
	context.subscriptions.push(queueButton);

	//quick pick
	const searchBox:vscode.QuickPick<vscode.QuickPickItem> = vscode.window.createQuickPick();
	searchBox.ignoreFocusOut = true;
	searchBox.placeholder = "Search for a track.";
	searchBox.onDidAccept(()=>{
		searchBox.hide();
		//vscode.window.showInformationMessage(searchBox.selectedItems[0].label);
		SoundCloudRequest.getTrackFromQuery(searchBox.selectedItems[0].label, (tracks: Array<Track>)=>{
			if(tracks.length > 0){
				vscode.window.showQuickPick(createQuickPickTrackItemFromTrackArray(tracks)).then((value)=>{
					if(value){
						trackplayer.addToQueue(value.track);
						if(trackplayer.play()){
							playButton.text = "$(debug-pause)";
							playButton.tooltip = "Pause";
						}
					}
				});
			}else{
				vscode.window.showInformationMessage("No results");
			}
		});
	});

	searchBox.onDidChangeValue(()=>{
		SoundCloudRequest.queryTrack(searchBox.value, (result: string[]) =>{
			result.unshift(searchBox.value.trim());
			searchBox.items = createQuickPickItemFromStringArray(result);
		});
	});
	context.subscriptions.push(searchBox);

	//command initializations
	context.subscriptions.push(vscode.commands.registerCommand("soundcloud-for-vs-code.play_pause_toggle", ()=>{
		if(trackplayer.play()){
			playButton.text = "$(debug-pause)";
			playButton.tooltip = "Pause";
		}
		else{
			playButton.text = "$(debug-start)";
			playButton.tooltip = "Play";
			trackplayer.pause();
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand("soundcloud-for-vs-code.skip_next", ()=>{
		trackplayer.skipNext();
		// if(trackplayer.play()){
		// 	playButton.text = "$(debug-pause)";
		// 	playButton.tooltip = "skip next";
		// }
	}));

	context.subscriptions.push(vscode.commands.registerCommand("soundcloud-for-vs-code.skip_back", ()=>{
		trackplayer.skipBack();
		// playButton.text = "$(debug-pause)";
		// playButton.tooltip = "skip back";
	}));

	context.subscriptions.push(vscode.commands.registerCommand("soundcloud-for-vs-code.show_queue_menu", ()=>{
		const queueBox: vscode.QuickPick<vscode.QuickPickItem> = vscode.window.createQuickPick();
		queueBox.title = "Queue"
		queueBox.placeholder = "Select an item to remove from the queue.";
		var queue = trackplayer.getQueue();
		
		let qpiArr: Array<vscode.QuickPickItem> = [];
		for(var i = 0; i < queue.length; i++){
			const str = (i + 1).toString().concat(". ", queue[i].title, " - ", queue[i].artist);
			qpiArr.push({label:str});
		}
		queueBox.items = qpiArr;

		queueBox.onDidAccept(() => {
			// Remove the item from the queue
			console.log(queueBox.selectedItems[0].label[0]);
			trackplayer.removeFromQueue(+(queueBox.selectedItems[0].label[0]) - 1);
			console.log(trackplayer.getQueue());
			queueBox.hide();
		});


		queueBox.show();
	}));

	context.subscriptions.push(vscode.commands.registerCommand("soundcloud-for-vs-code.show_search_menu", ()=>{
		searchBox.show();
	}));

}
// this method is called when your extension is deactivated
export function deactivate() {}

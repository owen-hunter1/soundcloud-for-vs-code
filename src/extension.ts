// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

/**Creates status bar item
*@param alignment align from left or right of status bar
*@param priority position amongst other status bar items
*@param text status bar item text
*@param tooltip additional text on hover
*@param command status bar item action
*@returns a new status bar item
**/
function newStatusBarItem(alignment:vscode.StatusBarAlignment, priority:number, text:string, tooltip:string, command?: string): vscode.StatusBarItem{
	const statusBarItem : vscode.StatusBarItem = vscode.window.createStatusBarItem(alignment, priority);
	statusBarItem.text = text;
	statusBarItem.tooltip = tooltip;
	if(command){
		 statusBarItem.command = command;
	}
	console.log("created status bar item");
	return statusBarItem;
}


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log("Congratulations, your extension 'soundcloud-for-vs-code' is now active!");

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

	const trackInfoText: vscode.StatusBarItem = newStatusBarItem(vscode.StatusBarAlignment.Right, --itemPosition, "Current Song - Current Artist", "Current Track");
	trackInfoText.show();
	context.subscriptions.push(trackInfoText);

	//command initializations
	context.subscriptions.push(vscode.commands.registerCommand("soundcloud-for-vs-code.play_pause_toggle", ()=>{
		//todo: replace this check with song player class and add song play functionality
		if(playButton.text === "$(debug-start)"){
			vscode.window.showInformationMessage("Playing");
			playButton.text = "$(debug-pause)";
			playButton.tooltip = "pause";
		}else{
			vscode.window.showInformationMessage("Paused");
			playButton.text = "$(debug-start)";
		}
	}));

	context.subscriptions.push(vscode.commands.registerCommand("soundcloud-for-vs-code.skip_next", ()=>{
		//todo: add skip functionality from song player class
		vscode.window.showInformationMessage("Skipped Track");
	}));

	context.subscriptions.push(vscode.commands.registerCommand("soundcloud-for-vs-code.skip_back", ()=>{
		//todo: add skip functionality from song player class
		vscode.window.showInformationMessage("Skipped Back Track");
	}));

	context.subscriptions.push(vscode.commands.registerCommand("soundcloud-for-vs-code.show_queue_menu", ()=>{
		//todo: add queue functionality from queue class
		vscode.window.showInformationMessage("Queue List");
	}));

	context.subscriptions.push(vscode.commands.registerCommand("soundcloud-for-vs-code.show_search_menu", ()=>{
		//todo: add search functionality from search class
		vscode.window.showInformationMessage("Searchbar");
	}));

}
// this method is called when your extension is deactivated
export function deactivate() {}

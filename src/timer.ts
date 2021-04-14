import { time } from 'node:console';
import * as vscode from 'vscode';
import { newStatusBarItem } from "./extension";

export class Timer{
    private timeRemaining: number;
    private totalTime: number;
    private intervalID: ReturnType<typeof setInterval>;
    private timeoutID: ReturnType<typeof setTimeout>;

    private timerText: vscode.StatusBarItem;
    constructor(context?: vscode.ExtensionContext){
        this.timeRemaining = 0;
        this.totalTime = 0;
        this.intervalID = setInterval(() => {}, 0);
        this.timeoutID = setTimeout(() => {}, 0);

        this.timerText = newStatusBarItem(vscode.StatusBarAlignment.Right, 11, "", "Time Remaining");
        this.timerText.text = "0:00 / 0:00";
        this.timerText.show();
        if(context !== undefined){
            context.subscriptions.push(this.timerText);
        }
    }

    /**
     * Starts the timer and sets the time until timeout.
     */
    public startTimer() {
        this.intervalID = setInterval(this.tick.bind(this), 1000)
        this.timeoutID = setTimeout(this.stopTimer.bind(this), (this.timeRemaining + 1) * 1000);
    }

    /**
     * Stops the timer and clears the current countdown.
     */
    public stopTimer() {
        clearInterval(this.intervalID);
        clearTimeout(this.timeoutID);
    }

    /**
     * Changes the current and total time of the timer.
     * @current The current time the timer is at, in seconds.
     * @total The total time until the timer stops, in seconds.
     */
    public setCurrentTime(current: number, total: number) {
        this.timeRemaining = total - current;
        this.totalTime = total;
        this.updateText();
    }

    /**
     * Reduces the time remaining by 1 second and updates the status bar item.
     */
    private tick() {
        this.timeRemaining -= 1;
        this.updateText();

        // let timeStart = new Date().getTime();
        // return {
            
        //     get time1() {
        //         const time1 = Math.ceil((new Date().getTime() - timeStart) / 1000);
        //         return time1;
        //     },
            
        // };
    }

    /**
     * Uses the time remaining and total time to update the status bar text.
     */
    private updateText() {
        const curTimeInSeconds = this.totalTime - this.timeRemaining;
        const curTimeMinutes = Math.floor(curTimeInSeconds / 60);
        const curTimeSeconds = curTimeInSeconds - (curTimeMinutes * 60);

        const totalTimeInSeconds = this.totalTime;
        const totalTimeMinutes = Math.floor(totalTimeInSeconds / 60);
        const totalTimeSeconds = totalTimeInSeconds - (totalTimeMinutes * 60);

        // Add leading a zero for when there are less than 10 seconds left
        let curTimeDisplay;
        if (curTimeSeconds < 10) {
            curTimeDisplay = curTimeMinutes.toString() + ":0" + curTimeSeconds.toString();
        } else {
            curTimeDisplay = curTimeMinutes.toString() + ":" + curTimeSeconds.toString();
        }
        let totalTimeDisplay;
        if (totalTimeSeconds < 10) {
            totalTimeDisplay = totalTimeMinutes.toString() + ":0" + totalTimeSeconds.toString();
        } else {
            totalTimeDisplay = totalTimeMinutes.toString() + ":" + totalTimeSeconds.toString();
        }

        this.timerText.text = curTimeDisplay + " / " + totalTimeDisplay;
    }

    public getTimeRemaining(): number {
        return this.timeRemaining;
    }
    
}

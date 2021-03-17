export class Timer{
    private timeRemaining: number;
    constructor(){
        this.timeRemaining = 0;
        
    }

    public tick() {
        let timeStart = new Date().getTime();
        return {
            
            get time1() {
                const time1 = (new Date().getTime() - timeStart / 1000);
                return time1;
            },
            
        }
    }
    
}

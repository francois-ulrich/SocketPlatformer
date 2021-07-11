import { TICK_RATE } from '../global';

class GameLoop {
    tick: number = 0;

    previous: number = 0;

    tickLengthMs: number = 1000 / TICK_RATE;

    updateFn: Function;

    constructor(updateFn: Function) {
        this.updateFn = updateFn;
        this.previous = this.hrtimeMs();
    }

    hrtimeMs(): number {
        const time = process.hrtime();
        return time[0] * 1000 + time[1] / 1000000
    }

    loop(): void {
        setTimeout(() => { this.loop() }, this.tickLengthMs);

        const now: number = this.hrtimeMs();
        const delta: number = (now - this.previous) / 1000;

        this.updateFn(delta, this.tick);

        this.previous = now
        this.tick++
    }
}

export default GameLoop;
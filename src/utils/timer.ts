/**
 * Runs every "tick" and will callback on each tick and when the given "interval" in seconds reached.
 * Do not forget to release() when no longer needed to clear the timer interval
 */
export class Timer {

  private readonly tick: number;
  private readonly interval: number;
  private readonly onIntervalReached: () => void;
  private readonly onTickCallback?: (progress: number) => void;

  private intervalInstance: any;
  public timePassed = 0;

  /**
   * @param tick
   * How often should the clock tick in milliseconds
   * @param interval
   * Interval of time till next notification in seconds
   * @param onIntervalReached
   * Function to be called when the given interval was reached
   * @param onTickCallback
   * Function that is called on each tick, receives a number showing the progress towards reaching the interval as a percentage
   */
  constructor(
    tick: number,
    interval: number,
    onIntervalReached: () => void,
    onTickCallback?: (progress: number) => void
  ) {
    if (!(tick > 0))
      throw new Error(`Timer received invalid tick value:${tick}`);

    if (!(interval > 0))
      throw new Error(`Timer received invalid interval value:${interval}`);

    if (!onIntervalReached)
      throw new Error(`Timer received no callback function`);

    this.tick = tick;
    this.interval = interval;
    this.onIntervalReached = onIntervalReached;
    this.onTickCallback = onTickCallback;
  }

  start() {
    if (this.intervalInstance) return;

    console.log("started");
    this.intervalInstance = window.setInterval(this.onTick, this.tick);
  }

  pause() {
    if (!this.intervalInstance) return;

    clearInterval(this.intervalInstance);
    this.intervalInstance = null;
  }

  onTick = () => {
    console.log(this.tick, this.timePassed);
    this.timePassed += this.tick;

    if (this.timePassed > this.interval) {
      this.timePassed = 0;
      this.onIntervalReached();
    }
    
    this.callTick()
 };

  reset() {
    this.timePassed = 0;
    this.callTick();
  }

  callTick = () => {
    if (this.onTickCallback) {
      const percentage = (this.timePassed * 100) / this.interval;

      this.onTickCallback(percentage);
    }
  }

  release = () => this.pause();
}

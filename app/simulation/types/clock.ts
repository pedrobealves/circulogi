import type { Node } from "./node";

export interface IntervalReturnType {
  isRunning: any;
  start: () => void;
  stop: () => void;
}

export interface ClockNode extends Node {
  intervalInstance?: IntervalReturnType;
}

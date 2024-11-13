import { getFirebaseApp } from "$lib/firebase.js";
import {
  getPerformance,
  trace,
  type PerformanceTrace,
} from "firebase/performance";

export function startTrace(name: string) {
  const perf = getPerformance(getFirebaseApp());
  const t = trace(perf, name);
  t.start();
  return t;
}

export function stopTrace(t: PerformanceTrace) {
  t.stop();
  return null;
}

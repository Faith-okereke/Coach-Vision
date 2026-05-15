/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

export interface Point {
  x: number;
  y: number;
}

export interface Vector {
  vx: number;
  vy: number;
}

export type BubbleColor = 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';

export interface Bubble {
  id: string;
  row: number;
  col: number;
  x: number;
  y: number;
  color: BubbleColor;
  active: boolean; // if false, popped
  isFloating?: boolean; // For animation
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
}

export interface StrategicHint {
  message: string;
  rationale?: string;
  targetRow?: number;
  targetCol?: number;
  recommendedColor?: BubbleColor;
}

export interface DebugInfo {
  latency: number;
  screenshotBase64?: string;
  promptContext: string;
  rawResponse: string;
  parsedResponse?: any;
  error?: string;
  timestamp: string;
}

export interface AiResponse {
  hint: StrategicHint;
  debug: DebugInfo;
}

export interface VolleyProConfig {
  fpsLimit: number;
  compressionQuality: number;
  visionEngine: 'GROK_1_5' | 'GEMINI_3_FLASH';
  jointThresholds: {
    shoulder: [number, number]; // [min, max]
    elbow: [number, number];
    wrist: [number, number];
  };
}

export const SlingshotConfig: VolleyProConfig = {
  fpsLimit: 30,
  compressionQuality: 0.7,
  visionEngine: 'GEMINI_3_FLASH',
  jointThresholds: {
    shoulder: [140, 180],
    elbow: [150, 175],
    wrist: [45, 90]
  }
};

export interface VolleyAnalysis {
  activity: string;
  jointAngles: {
    shoulder: number;
    elbow: number;
    wrist: number;
    stance?: number;
  };
  ballData?: {
    x: number;
    y: number;
    speed?: string;
  };
  pointOfContact?: string;
  powerScore: number;
  formQuality: 'POOR' | 'FAIR' | 'GOOD' | 'EXCELLENT';
  feedback: string;
  platformStability?: number;
  jumpHeight?: number;
}

export interface RareColorRequest {
  color: string;
  bgColor: string;
  comment: string;
}

export interface FirestoreRareColor {
  id: string;
  color: string;
  bgColor: string;
  comment: string;
}

export interface RareColor {
  color: string;
  bgColor: string;
  comment: string;
}

export interface RareDrop {
  ship: string;
  id: string;
}

export interface RareSettingsResponse {
  drops: Map<string, string>;
  colors: Map<string, RareColor>;
}

export interface Profile {
  name: string;
  message?: string;
}

export interface FirestoreDrop {
  id: string;
  time: Date;
  outcome: string;
  ship: string;
  comment: string;
}

export interface Drop {
  id: string;
  time: Date;
  event: string;
  area: string;
  outcome: string;
  ship: string;
  comment: string;
}

export interface DropRequest {
  event: string;
  area: string;
  outcome: string;
  ship: string;
  comment: string;
}

export interface DropsResponse {
  results: Drop[];
}

export interface EventAreas {
  event: string;
  areas: string[];
}

export interface EventsAreasResponse {
  results: Map<string, string[]>;
}

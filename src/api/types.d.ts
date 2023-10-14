export interface Drop {
  id: number;
  time: string;
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

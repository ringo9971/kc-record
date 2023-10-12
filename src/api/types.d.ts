export interface Drop {
  id: number;
  time: string;
  event: string;
  area: string;
  outcome?: string;
  ship: string;
  comment?: string;
}

export interface DropRequest {
  event: string;
  area: string;
  outcome?: string;
  ship: string;
  comment?: string;
}

export interface DropsResponse {
  results: Drop[];
}

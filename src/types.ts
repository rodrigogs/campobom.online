export type Candidate = {
  id: string;
  name: string;
  viceId?: string;
  photoUrl?: string;
  transients?: {
    vice?: Candidate;
    votes?: number;
    percentage?: number;
  }
}

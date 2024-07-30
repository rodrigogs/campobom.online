export type Candidate = {
  id: string;
  name: string;
  votes?: number;
  vice?: string;
  photoUrl?: string;
  transients?: {
    vice?: Candidate;
  }
}

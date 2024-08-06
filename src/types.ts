export type CandidateType = 'major' | 'vice' | 'null' | 'blank';

export type Candidate = {
  id: string;
  name: string;
  viceId?: string;
  photoUrl?: string;
  type: CandidateType;
  transients?: {
    vice?: Candidate;
    votes?: number;
    percentage?: number;
  }
}

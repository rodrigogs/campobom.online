export type CandidateType = 'MAYOR' | 'VICE' | 'NULL' | 'BLANK';

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

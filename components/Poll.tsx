import {
  Avatar,
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from '@mui/material'
import type { Candidate } from '@/src/types'

export type PollProps = {
  candidates: Candidate[];
  setSelectedCandidateId: (id: string) => void;
};

export function Poll({ candidates, setSelectedCandidateId }: PollProps) {
  return (
    <>
      <FormLabel
        component="legend"
        id="candidates-radio"
        sx={{
          marginBottom: 3,
          textAlign: 'center',
          color: 'white',
          fontSize: '1rem',
        }}
      >
        Em quem você votaria para prefeito de Campo Bom em 2024?
      </FormLabel>
      <FormControl
        component="fieldset"
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <RadioGroup
            aria-labelledby="candidates-radio"
            name="candidates"
            sx={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            onChange={(event) => setSelectedCandidateId(event.target.value)}
          >
            {candidates.map((candidate) => (
              <CandidateOption key={candidate.id} candidate={candidate} />
            ))}
          </RadioGroup>
        </Box>
      </FormControl>
    </>
  )
}

type CandidateOptionProps = {
  candidate: Candidate;
};

const CandidateOption = ({ candidate }: CandidateOptionProps) => {
  const isCenterAligned = isNullOrBlankCandidate(candidate)
  return (
    <FormControlLabel
      value={candidate.id}
      control={<Radio sx={{ color: 'white' }} />}
      label={<CandidateInfo candidate={candidate} />}
      sx={{
        width: '100%',
        padding: 2,
        paddingBottom: isCenterAligned ? 0 : 3,
        textAlign: isCenterAligned ? 'center' : 'left',
      }}
    />
  )
}

const CandidateInfo = ({ candidate }: CandidateOptionProps) => (
  isNullOrBlankCandidate(candidate)
    ? <Typography variant="h6">{candidate.name}</Typography>
    : <CandidateWithDetails candidate={candidate} />
)

const CandidateWithDetails = ({ candidate }: CandidateOptionProps) => (
  <Grid container spacing={2} sx={{ alignItems: 'center' }}>
    <Grid item>
      <Avatar src={`images/${candidate.photoUrl}`} alt={candidate.name} sx={{ width: 60, height: 60 }} />
    </Grid>
    <Grid item>
      <Box>
        <Typography variant="h6">{candidate.name}</Typography>
        {candidate.transients?.vice?.name && (
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            Vice: {candidate.transients.vice.name}
          </Typography>
        )}
      </Box>
    </Grid>
  </Grid>
)

const isNullOrBlankCandidate = (candidate: Candidate) =>
  candidate.type === 'NULL' || candidate.type === 'BLANK'

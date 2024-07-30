import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Avatar, Grid } from '@mui/material'
import logoSvg from './assets/logo.svg'
import { generateClient } from 'aws-amplify/data'
import type { Schema } from '../amplify/data/resource'

const client = generateClient<Schema>()

function Copyright() {
  return (
    <Typography
      variant="body2"
      align="center"
      sx={{
        color: 'text.secondary',
        marginTop: 4,
      }}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://campobom.online">
        Campo Bom Online
      </Link>{' '}
      {new Date().getFullYear()}.
    </Typography>
  )
}

export default function App() {
  type Candidate = {
    id: string,
    name: string,
    votes?: number,
    vice?: string,
    photoUrl?: string,
  }

  const [candidates, setCandidates] = useState<Candidate[]>([])

  useEffect(() => {
    async function fetchCandidates() {
      const { data } = await client.models.Candidate.list()
      const candidates = data as Candidate[]
      for (const candidate of candidates) {
        if (!candidate.photoUrl) {
          // Randomize the photoUrl for now
          candidate.photoUrl = `https://i.pravatar.cc/150?u=${candidate.id}`
        }
        if (!candidate.vice) {
          const vice = candidates.find(c => c.id !== candidate.id)
          candidate.vice = vice?.name
        }
      }
      setCandidates(data as Candidate[])
    }
    fetchCandidates()
  }, [])

  return (
    <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Box sx={{ my: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
        <img src={logoSvg} alt="Election Logo" style={{ width: '5em', height: 'auto', marginBottom: 5 }} />

        <Typography variant="h3" align="center" sx={{ color: 'white' }}>
          Campo Bom
        </Typography>
        <Typography variant="h5" align="center" sx={{ color: 'lime', opacity: 0.7, marginTop: -2, marginBottom: 5, fontFamily: 'Roboto, cursive', paddingLeft: 16 }}>
          Depre
        </Typography>

        <FormControl component="fieldset" sx={{ width: '100%' }}>
          <FormLabel component="legend" id="candidates-radio" sx={{ marginBottom: 2, textAlign: 'center', color: 'white' }}>
            Em quem você votaria para prefeito de Campo Bom em 2024?
          </FormLabel>
          <RadioGroup
            aria-labelledby="candidates-radio"
            defaultValue={candidates.length > 0 ? candidates[0].id : ''} // Pode ser randomizado no futuro
            name="candidates"
            sx={{ width: '100%' }}
          >
            {candidates.map(candidate => (
              <FormControlLabel
                key={candidate.id}
                value={candidate.id}
                control={<Radio sx={{ color: 'white' }} />}
                label={
                  <Grid container spacing={2} alignItems="center" sx={{ padding: 1 }}>
                    <Grid item>
                      <Avatar src={candidate.photoUrl} alt={candidate.name} />
                    </Grid>
                    <Grid item>
                      <Typography variant="body1" sx={{ color: 'white' }}>{candidate.name}</Typography>
                      <Typography variant="body2" color="text.secondary">Vice: {candidate.vice}</Typography>
                    </Grid>
                  </Grid>
                }
                sx={{ width: '100%', justifyContent: 'center', display: 'flex', padding: 1 }}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>
      <Box sx={{ py: 3 }}>
        <Copyright />
      </Box>
    </Container>
  )
}

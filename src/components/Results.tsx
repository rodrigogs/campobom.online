import { useEffect, useState } from 'react'
import { generateClient } from 'aws-amplify/api'
import type { Candidate } from '../types'
import type { Schema } from '../../amplify/data/resource'
import { filterTitulars, normalizeCandidates } from '../candidate-utils'
import { Loader } from './Loader'
import { Box, List, ListItem, ListItemText, Avatar, Grid, CircularProgress } from '@mui/material'

const client = generateClient<Schema>()

const resolvePercentages = (candidates: Candidate[]) => {
  const totalVotes = candidates.reduce((acc, candidate) =>
    acc + (candidate.transients?.votes || 0), 0)
  return candidates.map(candidate => ({
    ...candidate,
    transients: {
      ...candidate.transients,
      percentage: candidate.transients?.votes ? (candidate.transients.votes / totalVotes) * 100 : 0,
    },
  }))
}

const resolveColor = (percentage = 0) => {
  if (percentage < 15) return 'error'
  if (percentage < 30) return 'warning'
  if (percentage < 45) return 'primary'
  return 'success'
}

const CircularAvatar = ({ src, alt, percentage }: { src?: string, alt?: string, percentage?: number }) => (
  <Box position="relative" display="inline-flex">
    <CircularProgress variant="determinate" value={percentage} size={80} color={resolveColor(percentage)} />
    <Box
      position="absolute"
      top={0}
      left={0}
      bottom={0}
      right={0}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Avatar src={src} alt={alt} sx={{ width: 60, height: 60 }} />
    </Box>
  </Box>
)

export function Results() {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<Candidate[]>([])

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const { data } = await client.models.Candidate.list() as { data: Candidate[] }
        const candidates = resolvePercentages(filterTitulars(await normalizeCandidates(data, true)))
        const sortedCandidates = candidates.sort((a, b) => (a.transients?.votes || 0) - (b.transients?.votes || 0)).reverse()
        setResults(sortedCandidates)
      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [])

  if (loading) {
    return <Loader />
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
      }}
    >
      <h3>Resultados</h3>
      <Grid container justifyContent="center" alignItems="center" spacing={2} sx={{ padding: 2 }}>
        <List>
          {results.map((candidate) => (
            <ListItem key={candidate.id}>
              <Grid container alignItems="center" spacing={2} sx={{ padding: 2 }}>
                <Grid item>
                  <CircularAvatar src={candidate.photoUrl} alt={candidate.name} percentage={candidate.transients?.percentage} />
                </Grid>
                <Grid item xs>
                  <ListItemText primary={candidate.name} secondary={`Votos: ${candidate.transients?.votes}`} />
                </Grid>
              </Grid>
            </ListItem>
          ))}
        </List>
      </Grid>
    </Box>
  )
}

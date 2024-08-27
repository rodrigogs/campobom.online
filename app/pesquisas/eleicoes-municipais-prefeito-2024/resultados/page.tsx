'use client'

import '@/components/ConfigureAmplify'
import { Avatar, Box, CircularProgress, Grid, List, ListItem, ListItemText } from '@mui/material'
import { filterTitulars, normalizeCandidates } from '@/app/utils'
import { useCallback, useEffect, useState } from 'react'
import { Authenticated } from '@/components/Authenticated'
import type { Candidate } from '@/src/types'
import { Loader } from '@/components/Loader'
import type { Schema } from '@/amplify/data/resource'
import { generateClient } from 'aws-amplify/api'

const client = generateClient<Schema>()

const resolvePercentages = (candidates: Candidate[]) => {
  const totalVotes = candidates.reduce((acc, candidate) =>
    acc + (candidate.transients?.votes ?? 0), 0)
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

const EleicoesMunicipaisPrefeito2024Results = () => {
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<Candidate[]>([])

  const refresh = useCallback(async () => {
    try {
      setLoading(true)

      const { data } = await client.models.Candidate.list() as { data: Candidate[] }

      const resolvedCandidates = resolvePercentages(filterTitulars(await normalizeCandidates(data, true))) as Candidate[]
      const sortedCandidatesList = resolvedCandidates
        .filter(c => c.type === 'MAYOR' || c.type === 'VICE')
        .sort((a, b) => (a.transients?.votes || 0) - (b.transients?.votes || 0)).reverse()

      const sortedOptions = resolvedCandidates
        .filter(c => c.type === 'NULL' || c.type === 'BLANK')
        .sort((a, b) => (a.type === 'NULL' ? 1 : a.type === 'BLANK' ? 2 : 0) - (b.type === 'NULL' ? 1 : b.type === 'BLANK' ? 2 : 0))

      const titularCandidates = sortedCandidatesList.filter(c => c.type === 'MAYOR')

      setResults([...titularCandidates, ...sortedOptions])
    } catch (error) {
      console.error('Error fetching results:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  client.models.Vote.onCreate().subscribe(() => {
    refresh()
  })

  useEffect(() => {
    const fetchResults = async () => {
      try {
        await refresh()
      } catch (error) {
        console.error('Error fetching results:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [refresh])

  if (loading) {
    return <Loader />
  }

  return <Authenticated>
    {() => (<Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h3>Resultados</h3>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <List>
            {results.map((candidate) => (
              <ListItem key={candidate.id}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>
                    <CircularAvatar
                      src={`/images/${candidate.photoUrl}`}
                      alt={candidate.name}
                      percentage={candidate.transients?.percentage}
                    />
                  </Grid>
                  <Grid item>
                    <ListItemText
                      primary={candidate.name}
                      secondary={`Votos: ${candidate.transients?.votes}`}
                    />
                  </Grid>
                </Grid>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Box>
    )}
  </Authenticated>
}

export default EleicoesMunicipaisPrefeito2024Results

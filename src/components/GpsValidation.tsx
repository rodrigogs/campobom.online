import type React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogTitle, Button, CircularProgress, Box, Container } from '@mui/material'
import { Header } from './Header'
import { GpsFixedOutlined, GpsOff, ReportProblem, ShareLocation } from '@mui/icons-material'
import * as turf from '@turf/turf'

// To create coordinates use: https://geojson.io/#map=12.64/-29.67657/-51.07117/-11.2/16
const polygon = turf.polygon([[
  [-51.05222012055111, -29.70808733027524],
  [-51.01569489084835, -29.68830219485853],
  [-51.03560555075387, -29.645979543358692],
  [-51.08822276187766, -29.654914321822964],
  [-51.09287992427326, -29.679547148377786],
  [-51.08194156438523, -29.686111749890166],
  [-51.08510219303301, -29.703787808723057],
  [-51.05222012055111, -29.70808733027524],
]])

interface GpsValidationProps {
  onValidationResult: (isValid: boolean) => void
}

export const GpsValidation: React.FC<GpsValidationProps> = ({ onValidationResult }) => {
  const [open, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const [locationValidated, setLocationValidated] = useState<boolean | null>(null)
  const [error, setError] = useState<GeolocationPositionError | null>(null)

  const checkLocation = () => {
    setLoading(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = turf.point([position.coords.longitude, position.coords.latitude])
        const isInside = turf.booleanPointInPolygon(userLocation, polygon)
        setLocationValidated(isInside)
        setLoading(false)

        setTimeout(() => {
          onValidationResult(isInside)
          setOpen(false)
        }, 3000)
      },
      (error) => {
        console.error('Error getting location:', error)
        setError(error)
        setLocationValidated(null)
        setLoading(false)

        setTimeout(() => {
          onValidationResult(false)
        }, 3000)
      },
    )
  }

  return (
    <Dialog open={open} onClose={() => {}} fullScreen>
      <Container maxWidth="sm" sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ my: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', flexGrow: 1 }}>
          <Header />
          <DialogTitle align='center'>Validação de Localização</DialogTitle>
          <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80vw', maxWidth: 400, textAlign: 'center' }}>
              <p>Para votar, precisamos validar que você está dentro dos limites do município de Campo Bom.</p>
              <p><strong>Fique tranquilo, sua localização será utilizada apenas para validar se você está apto a votar. Não armazenaremos sua localização.</strong></p>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={checkLocation}
                disabled={loading || locationValidated !== null}
                sx={{ display: 'flex', alignItems: 'center' }}>
                {loading
                  ? <><CircularProgress color='info' size={24} sx={{ mr: 2 }} />Validando...</>
                  : error
                    ? <><ReportProblem color='error' sx={{ mr: 2 }} />Erro ao validar localização</>
                    : locationValidated !== null
                      ? locationValidated === true
                        ? <><GpsFixedOutlined color='success' sx={{ mr: 2 }} />Localização validada</>
                        : <><GpsOff color='warning' sx={{ mr: 2 }} />Localização inválida</>
                      : <><ShareLocation color='info' sx={{ mr: 2 }} />Validar localização</>
                }
              </Button>
            </Box>
          </DialogContent>
        </Box>
      </Container>
    </Dialog>
  )
}

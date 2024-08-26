import { Box, CircularProgress, Dialog, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import type React from 'react'

type AwaiterProps = {
  until: Date;
  children: () => React.ReactNode;
};

export const Awaiter: React.FC<AwaiterProps> = ({ until, children }) => {
  const [isReady, setIsReady] = useState(false)
  const [timeLeft, setTimeLeft] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true) // Novo estado para controlar o loader inicial

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const difference = until.getTime() - now.getTime()
      return difference > 0 ? difference : 0
    }

    const updateTimer = () => {
      setTimeLeft(calculateTimeLeft())
    }

    // Simula um pequeno delay para o cálculo inicial
    setTimeout(() => {
      updateTimer()
      setIsLoading(false) // Desativa o loader após a verificação inicial
    }, 1000) // Simula 1 segundo de carregamento para o cálculo inicial

    const intervalId = setInterval(() => {
      updateTimer()
      if (calculateTimeLeft() === 0) {
        setIsReady(true)
      }
    }, 1000)

    return () => clearInterval(intervalId) // Limpa o intervalo ao desmontar
  }, [until])

  // Converte o tempo restante em formato legível (HH:MM:SS)
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
  }

  if (isReady) {
    return <>{children()}</>
  }

  return (
    <Dialog fullScreen open={!isReady}>
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" flexDirection="column">
        {isLoading ? (
          <CircularProgress /> // Exibe o loader enquanto calcula o tempo restante
        ) : (
          <>
            <Typography variant="h4">Site abrirá em:</Typography>
            <Typography variant="h1" mt={2}>{formatTime(timeLeft)}</Typography>
          </>
        )}
      </Box>
    </Dialog>
  )
}

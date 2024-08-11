import { Box, Typography } from '@mui/material'
import logoSvg from '../assets/logo.svg'

export function Header() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        py: 2,
      }}
    >
      <img
        src={logoSvg}
        alt="Election Logo" style={{
          width: '5em',
          height: 'auto',
          marginBottom: 5,
        }} />

      <Typography variant="h3" align="center">
        Campo Bom
      </Typography>
      {/* <Typography
        variant="h5"
        align="center"
        sx={{
          opacity: 0.7,
          marginTop: -2,
          marginBottom: 2,
          fontFamily: 'Roboto',
          paddingLeft: 16.5,
        }}
      >
        Depre
      </Typography> */}
    </Box>
  )
}

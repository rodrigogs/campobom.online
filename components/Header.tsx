import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import Link from 'next/link'
import { Logout } from './Logout'
import logoSvg from '@/public/images/logo.svg'

export async function Header() {
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
      <Link href="/">
        <Image src={logoSvg} alt="Election Logo" style={{
          width: '5em',
          height: 'auto',
          marginBottom: 5,
        }} />
      </Link>

      <Typography variant="h3" align="center">
        Campo Bom
      </Typography>
      <Typography
        variant="h4"
        align="center"
        color="secondary"
        sx={{
          opacity: 0.7,
          marginTop: -2,
          marginBottom: 2,
          fontFamily: 'Roboto',
          paddingLeft: 20.5,
        }}
      >
        Online
      </Typography>

      {/* {username && (
        <Box
          sx={{
            marginTop: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Logout />
        </Box>
      )} */}
    </Box>
  )
}

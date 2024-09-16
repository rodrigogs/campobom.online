import { BarChart, HowToVote, WhatsApp } from '@mui/icons-material'
import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'

const Home = () => {
  const whatsappGroupInviteLink = 'https://chat.whatsapp.com/KhZghWqdoTgHOIKLK45Xpz'
  const eleicoesMunicipaisPrefeito2024 = '/pesquisas/eleicoes-municipais-prefeito-2024'
  const votarLink = '#'

  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Stack spacing={4} maxWidth={400} width="100%">
          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Participe do nosso grupo do WhatsApp
              </Typography>
              <Button
                fullWidth
                variant='contained'
                color='secondary'
                startIcon={<WhatsApp />}
                href={whatsappGroupInviteLink}
                target="_blank"
              >
                Entre no grupo
              </Button>
            </CardContent>
          </Card>

          <Card elevation={3}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                Pesquisa Eleições Municipais 2024
              </Typography>
              <Stack direction="row" spacing={2}>
                {/* Botão Votar - Indisponível */}
                <Button
                  fullWidth
                  variant='outlined'
                  color='error'
                  startIcon={<HowToVote />}
                  href={votarLink}
                  disabled
                >
                  Votar (Indisponível)
                </Button>

                {/* Botão Ver Resultado */}
                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  startIcon={<BarChart />}
                  href={`${eleicoesMunicipaisPrefeito2024}/resultados`}
                >
                  Ver resultado
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Container>
  )
}

export default Home

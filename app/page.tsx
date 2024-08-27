import '@aws-amplify/ui-react/styles.css'
import { AppBar, Button, Container, Toolbar, Typography } from '@mui/material'

const Home = () => {
  return (
    <Container>
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, paddingRight: 2 }}>
            Eleições 2024
          </Typography>
          <Button color="primary" href='/pesquisas/eleicoes-municipais-prefeito-2024'>
            Acessar Pesquisa
          </Button>
        </Toolbar>
      </AppBar>
    </Container>
  )
}

export default Home

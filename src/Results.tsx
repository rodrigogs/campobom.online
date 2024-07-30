import { Alert } from "@mui/material"

export function Results() {
  return (
    <div>
      <Alert severity="info" sx={{ width: '100%', marginBottom: 2 }}>
        Obrigado por votar! 🎉
      </Alert>
      <h1>Resultados</h1>
    </div>
  )
}

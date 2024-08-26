import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

interface VoteButtonProps {
  handleVote: () => void
  disabled: boolean
}

export const VoteButton: React.FC<VoteButtonProps> = ({ handleVote, disabled }) => (
  <Box width="100%" display="flex" justifyContent="center">
    <Button variant="contained" color="primary" sx={{ marginTop: 2 }} onClick={handleVote} disabled={disabled}>
      Votar
    </Button>
  </Box>
)

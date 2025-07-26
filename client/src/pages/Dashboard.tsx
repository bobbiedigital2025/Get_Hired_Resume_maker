import { useSelector } from 'react-redux';
import { Container, Typography, Box } from '@mui/material';
import { RootState } from '../store';

export const Dashboard: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <Container>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome{user?.name ? `, ${user.name}` : ''}!
        </Typography>
        <Typography variant="body1">
          Let's create your professional resume.
        </Typography>
      </Box>
    </Container>
  );
};

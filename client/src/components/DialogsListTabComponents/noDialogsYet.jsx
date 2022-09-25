import { useMediaQuery, Grid } from '@mui/material';
import NotDialogsYetImage from '../../images/NotDialogsYet.png';

export default function NoDialogsYet (props) {
  const IsWidthMatch = useMediaQuery('(max-width: 585px)');

  return (
    <Grid
      container
      direction='column'
      alignItems='center'
      sx={{
        paddingTop: '5vh'
      }}
    >
      <Grid
        item
        sx={{
          fontSize: '3vh'
        }}
      >
        <img src={NotDialogsYetImage} width={IsWidthMatch ? '100%' : '585px'} alt='' />
      </Grid>
      <Grid
        item sx={{
          marginTop: '1vh',
          fontSize: '3vh',
          fontWeight: '700'
        }}
      >
        No dialogs yet...
      </Grid>
    </Grid>
  );
}

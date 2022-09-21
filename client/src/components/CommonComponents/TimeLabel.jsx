import Moment from 'react-moment';
import { Box } from '@mui/system';

export default function TimeLabel (props) {
  return (
    <Box sx={{
      fontSize: '0.6rem'
    }}
    ><Moment format='D MMM HH:mm'>{props.date}</Moment>
    </Box>
  );
}

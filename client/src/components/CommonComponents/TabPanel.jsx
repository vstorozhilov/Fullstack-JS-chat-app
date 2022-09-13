import { animated } from '@react-spring/web';
import { Box } from '@mui/material';
import PropTypes from 'prop-types';

function TabPanel (props) {
  const { children, value, index, style, ...other } = props;

  return (
    <animated.div
      role='tabpanel'
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={Object.assign(style, {
        position: 'absolute',
        width: 'inherit',
        overflowY: 'scroll',
        height: 'inherit'
      })}
      {...other}
    >
      <Box sx={{
        p: 3,
        width: 'inherit'
      }}
      >
        {children}
      </Box>
    </animated.div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired
};

export default TabPanel;

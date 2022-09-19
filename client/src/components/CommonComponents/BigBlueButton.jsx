import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const StyledBlueButton = styled(Button)(({ theme }) => `
      font-weight: ${theme.typography.fontWeightBold};
      text-transform: none;
      font-size: 2vh;
      width: 90vw;
      height: 7vh;
      border-radius: 10vw;
      background-color: ${theme.palette.primary.dark};
`);

// export function BigBlueButton (props) {
//   return (
//     <StyledBlueButton variant='contained' {...props}>
//       {props.text}
//     </StyledBlueButton>
//   );
// }

export const BigBlueButton = React.forwardRef((props, ref) => {
  return (
    <StyledBlueButton variant='contained' ref={ref} {...props}>
      {props.text}
    </StyledBlueButton>
  );
});

export const CustomButton = React.forwardRef((props, ref) => {
  return <StyledBlueButton {...props} ref={ref} />;
});

export { StyledBlueButton };

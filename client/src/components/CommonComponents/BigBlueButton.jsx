import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';

const StyledBlueButton = styled(Button)(({ theme }) => `
      font-weight: ${theme.typography.fontWeightBold};
      text-transform: none;
      font-size: 1rem;
      height: 3.5rem;
      border-radius: 10vw;
      background-color: ${theme.palette.primary.dark};
`);

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

import React from 'react';
import {styled} from '@mui/material/styles';
import {Button} from '@mui/material';
import { Link } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import { customTheme } from './CustomTheme';
import { useMeasure } from 'react-use-measure'

const StyledBlueButton = styled(Button)(({theme})=>`
      font-family: ${theme.typography.fontFamily};
      font-weight: ${theme.typography.fontWeightBold};
      text-transform: none;
      font-size: 2vh;
      width: 90vw;
      height: 7vh;
      border-radius: 10vw;
      background-color: ${theme.palette.primary.dark};
`)

export function BigBlueButton(props){
    return (
    //<Link  to={props.target}>
      <StyledBlueButton variant="contained" {...props}>
            {props.text}
      </StyledBlueButton>
    //</Link> 
    )
  }

export const CustomButton = React.forwardRef((props, ref)=>{ 
  return <StyledBlueButton {...props} ref={ref}/>
})


export {StyledBlueButton};
import React from 'react';
import {styled} from '@mui/material/styles';
import {TextField} from '@mui/material';

const StyledTextField = styled(TextField)(({width, height, theme})=>`
      width: ${width};
      & .MuiOutlinedInput-input {
            border-radius: 7vw;
            height: ${height};
            font-weight: ${theme.typography.fontWeightBold};
          },
      & .MuiOutlinedInput-root {
            background-color: ${theme.palette.secondary.contrastText};
            border-radius: 7vw;
            padding: 0;

      },
      & .MuiOutlinedInput-notchedOutline {
            border: none;
            border-radius: 7vw
      },
      & .Mui-focused > .MuiOutlinedInput-notchedOutline {
            border: solid 1px #246bfd;
      },
      & .Mui-focused > .MuiOutlinedInput-input {
            background-color: ${theme.palette.action.focus};
      }
`)

export const AppTextField = React.forwardRef((props, ref)=>{
      return <StyledTextField variant="outlined" ref={ref} {...props}/>
})


// export function AppTextField(props){
//     return (
//       <StyledTextField variant="outlined" {...props}/>
//       )
//   }
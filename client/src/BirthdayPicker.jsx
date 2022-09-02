import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AppTextField } from './TextField';
import React from 'react';

export const BirthdayPicker = React.forwardRef((props, ref)=>{
    const {initValue, ...forwardedProps} = props;
    const [value, setValue] = React.useState(initValue);

    return (<LocalizationProvider dateAdapter={AdapterDateFns}>
    <DatePicker
    showToolbar
    ref={ref}
    label={props.label}
    value={value}
    onChange={(newValue) => {
        setValue(newValue);
    }}
    InputAdornmentProps={{position: 'end'}}
    renderInput={(params) => <AppTextField {...params} {...forwardedProps}/>}/>
    </LocalizationProvider>)
})
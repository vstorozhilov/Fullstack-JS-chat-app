import ContactsListItems from '../ContactListTabComponents/ContactsListItems';
import { Grid, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function StartNewDialog (props) {
  const theme = useTheme();

  return (
    <>
      <div
        style={{
          zIndex: '1',
          position: 'absolute',
          width: 'inherit',
          height: 'inherit',
          backgroundColor: '#a7a7a7',
          opacity: '0.8'
        }}
      />
      <Grid
        container
        justifyContent='center'
        alignItems='center'
        sx={{
          height: 'inherit',
          zIndex: '2',
          position: 'absolute',
          width: 'inherit',
          animationDuration: '0.3s',
          animationName: 'slidein',
          animationTimingFunction: 'cubic-bezier(0, 1.05, 0.94, 1.02)',
          '@keyframes slidein': {
            from: {
              opacity: '0',
              marginTop: '100%'
            },
            to: {
              opacity: '1',
              marginTop: '0%'
            }
          }
        }}
      >
        <Grid
          container
          direction='column'
          flexWrap='nowrap'
          hidden={!props.isStartMessagingActive}
          sx={{
            opacity: '1',
            backgroundColor: '#ffffff',
            height: '90vh',
            width: '90vw',
            borderRadius: '3vw'
          }}
        >
          <Grid
            container
            direction='row'
            justifyContent='flex-start'
            alignItems='center'
            columnSpacing={3}
            sx={{
              background: 'linear-gradient(to right, #4f89ff, #2d71fd)',
              paddingTop: '1vh',
              paddingBottom: '1vh',
              marginBottom: '3vh',
              marginLeft: '0',
              width: '100%'
            }}
          >
            <Grid item>
              <CloseIcon
                onClick={() => props.setIsStartMessagingActive(false)}
                fontSize='large'
                sx={{
                  color: '#ffffff'
                }}
              />
            </Grid>
            <Grid
              item sx={{
                fontSize: '3vh',
                fontWeight: theme.typography.fontWeightBold,
                color: theme.palette.secondary.text
              }}
            >
              Choose your contact
            </Grid>
          </Grid>
          <Grid
            item
            sx={{
              overflowY: 'scroll',
              flexGrow: '1'
            }}
          >
            <ContactsListItems isStartingNewDialogWindow />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

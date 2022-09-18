import '../../App.css';
import React, { useState, useEffect, useContext } from 'react';
import { useTransition } from '@react-spring/web';
import { IconButton, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import { authentificationContext } from '../../Routes';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import MyMessage from './MyMessage';
import { RefPeerMessage, PeerMessage } from './PeerMessage';
import { InView } from 'react-intersection-observer';
import CircularProgress from '@mui/material/CircularProgress';

const ObservedComponent = (MessageComponent, props) => {
  const { messageId, ...forwardedProps } = props;
  const { user: { token } } = useContext(authentificationContext);

  function isReadedNotification (inView) {
    if (inView) {
      fetch('/api/dialog', {
        mode: 'cors',
        method: 'POST',
        headers: { Authorization: token },
        body: JSON.stringify({
          action: 'message was readed',
          messageId
        })
      });
    }
  }

  return (
    <InView root={props.root} threshold={0.9} triggerOnce onChange={inView => isReadedNotification(inView)}>
      {({ inView, ref }) => (
        <MessageComponent ref={ref} inView={inView} {...forwardedProps} />
      )}
    </InView>
  );
};

const MessagesContainer = React.forwardRef((props, ref) => {
  const { user: { login } } = useContext(authentificationContext);
  const [isDialogFullyScrolled, setisDialogFullyScrolled] = useState(false);
  const correctMessages = useSelector(state => state.messagesReducer.Messages);
  const transitions = useTransition(Object.values(correctMessages),
    {
      from: { opacity: 0 },
      enter: { opacity: 1 },
      config: { duration: 300 }
    });

  useEffect(() => {
    if (Object.keys(correctMessages).length) {
      console.log('Mounted');
      if (ref.current.offsetHeight + ref.current.scrollTop >=
              ref.current.scrollHeight - 2) {
        setisDialogFullyScrolled(true);
      }
      if (isDialogFullyScrolled) {
        ref.current.scrollTo(0, ref.current.scrollHeight);
      }
    }
  });

  const NotReadedMessagesCount = useSelector(state => (
    Object.values(state.messagesReducer.Messages).filter(item => (item.isReaded === false && item.author !== login))).length
  );

  const LoadingCircular = (props) => (
    <Grid item alignSelf='center' sx={{ marginTop: '10vh' }}>
      <CircularProgress {...props} />
    </Grid>
  );

  return (
    <div
      onScroll={() => {
        if (ref.current.offsetHeight + ref.current.scrollTop >=
              ref.current.scrollHeight - 2) {
          setisDialogFullyScrolled(true);
        } else {
          setisDialogFullyScrolled(false);
        }
      }}
      ref={ref}
      style={{
        position: 'relative',
        flexGrow: '1',
        overflowY: 'scroll',
        scrollBehavior: 'smooth',
        minHeight: '0px'
      }}
    >
      {NotReadedMessagesCount !== 0 || !isDialogFullyScrolled
        ? <Grid
            container
            direction='row'
            justifyContent='center'
            alignItems='center'
            width='fit-content'
            spacing={1}
            sx={{
              position: 'fixed',
              zIndex: '10',
              bottom: '15vh',
              right: '7vw'
            }}
          >
          {NotReadedMessagesCount !== 0
            ? <Grid item>
              <div style={{
                backgroundColor: 'blue',
                borderRadius: '50%',
                textAlign: 'center',
                width: '3vh',
                height: '3vh',
                color: 'white',
                boxShadow: '#868686 0px 0px 10px 0px'
              }}
              >
                {NotReadedMessagesCount}
              </div>
              </Grid>
            : null}
          {!isDialogFullyScrolled && Object.keys(correctMessages).length
            ? <Grid item>
              <IconButton
                onClick={(e) => {
                  ref.current.scrollTo(0, ref.current.scrollHeight);
                }}
                sx={{
                  boxShadow: '0px 0px 10px 0px #252525',
                  backgroundColor: '#ffffff',
                  ':hover': {
                    backgroundColor: '#ffffff'
                  }
                }}
              >
                <KeyboardDoubleArrowDownIcon />
              </IconButton>
            </Grid>
            : null}
        </Grid>
        : null}
      <Grid
        container
        spacing={2}
        direction='column'
        paddingTop='2vh'
        wrap='nowrap'
        sx={{
          marginTop: '0',
          scrollBehavior: 'smooth'
        }}
      >
        {props.isLoadingUpdates
          ? <LoadingCircular size='30vh' thickness='2.0' />
          : transitions((styles, item) => {
            return (login === item.author
              ? <MyMessage
                  styles={item.isReaded ? {} : styles}
                  message={item.content}
                  isReaded={item.isReaded}
                  date={item.date}
                />
              : item.isReaded
                ? <PeerMessage
                    message={item.content}
                    date={item.date}
                  />
                : ObservedComponent(RefPeerMessage, {
                  root: ref.current,
                  styles,
                  message: item.content,
                  messageId: item._id,
                  date: item.date
                }));
          })}
      </Grid>
    </div>
  );
});

export default MessagesContainer;

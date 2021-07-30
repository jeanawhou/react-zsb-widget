import React, { useEffect, useState, useRef, useCallback } from 'react'
import {
  addResponseMessage,
  addUserMessage,
  deleteMessages,
  renderCustomComponent,
  setQuickButtons,
  toggleInputDisabled,
  toggleMsgLoader,
} from 'react-chat-widget';
import { v4 as uuidv4 } from 'uuid';
import { AES, enc } from 'crypto-js';
import { ClientJS } from 'clientjs';
import { DislikeFilled, LikeFilled, WarningOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';
import moment from 'moment';

import { apiService } from '../services/api.service';
import { useStyles } from './ZeroShotBot.styles';

const useZeroShotBot = ({ bot, textColor, color, height }) => {
  const client = new window.ClientJS();
  const classes = useStyles();
  const botRef = useRef();
  const startTimerInterval = useRef();
  const warningInactiveInterval = useRef();
  const [clientFingerPrint, setClientFingerPrint] = useState(null);
  const [currentMessage, setCurrentMessage] = useState(null);
  const [interactionID, setinteractionID] = useState(null);
  const [isExpired, setExpired] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [quickReply, setQuickReply] = useState(null);
  const [sessionID, setSessionID] = useState(null);
  const [ratingsDownCount, setRatingsDownCount] = useState(0);
  const botDetails = JSON.parse(
    AES.decrypt(bot.toString(), '').toString(enc.Utf8)
  );
  const chatWidgetSelector = document.querySelector('.rcw-widget-container');
  let userForm, userName, userEmail, userPhone = null;
  const QUICK_BUTTONS = [
    {
      label: <LikeFilled />,
      value: "Liked",
    },
    {
      label: <DislikeFilled />,
      value: "Unliked",
    },
  ];

  const AGENT_HANDOVER = [
    {
      label: "Request Agent Call Back",
      value: "Request Agent Call Back",
    }
  ]

  useEffect(() => {
    const fingerprint = client.getFingerprint();
    setClientFingerPrint(fingerprint);
    customizeBot();
  }, []);

  const addQuickReply = (quickReplyOptions) => {
    setQuickReply(null);
    let reply_options = quickReplyOptions.sort(
      (a, b) => +b.key + +a.key
    );
    for (const quick_reply of reply_options) {
      quickReply.push({
        label: quick_reply.label,
        value: quick_reply.question
      })
    }
    setQuickButtons(quickReply);
  };

  const connectAgent = () => {
    try {
      chatWidgetSelector.querySelector('input').focus();
      toggleInputDisabled();
      renderCustomComponent(
        FormComponent,
        { message: 'form' },
        false,
        'For Form'
      );
    } catch (err) {
      throw err;
    }
  };

  const connectToAgent = async (message, messageType) => {
    chatWidgetSelector.querySelector('input').focus();
    toggleInputDisabled();
    setQuickButtons([]);
    setQuickReply(null);
    if (messageType === 'quickReply') addUserMessage(message);
    else toggleMsgLoader();
    toggleInputDisabled();
    connectAgent();
  };

  const customizeBot = () => {
    document.documentElement.style.setProperty("--backgroundColor", color);
    document.documentElement.style.setProperty("--height-widget", height);
    document.documentElement.style.setProperty(
      "--backgroundColorReply",
      color + "26"
    );
    document.documentElement.style.setProperty("--textColor", textColor);
    document.documentElement.style.setProperty("--textColorReply", '#000000');
  };

  const handleQuickButtonClicked = async (message) => {
    chatWidgetSelector.querySelector('input').focus();
    if (message === "Liked") logFeedback(1);
    else if (message === "Unliked") logFeedback(0);
    else if (message === "Request Agent Call Back") connectToAgent(message, 'quickReply');
    else {
      let newQuickReply = quickReply.filter((res) => res.value === message) ?
        quickReply.filter((res) => res.value === message)[0].label :
        message;
      handleNewUserMessage(message);
      addUserMessage(newQuickReply);
    }
  };

  const handleCancelSubmit = () => {
    chatWidgetSelector.querySelector('input').focus();
    toggleMsgLoader();
    toggleInputDisabled();
    deleteMessages(1, 'For Form');
    renderCustomComponent(StandardComponent, {
      message: `You've cancelled the form. Anything else I can help you with?`,
      hasError: false,
      isIcon: false,
      time: new Date().toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
    toggleMsgLoader();
  };

  const handleNewUserMessage = async (newMessage) => {
    const { identifier, jid, sentinel, token } = botDetails
    let timeNow = new Date().toLocaleTimeString(navigator.language, {
      hour: '2-digit',
      minute: '2-digit',
    });
    setMessageCount(messageCount + 1);
    setQuickReply(null);
    setQuickButtons([]);
    toggleMsgLoader();
    setinteractionID(uuidv4());
    if (newMessage === 'Request Agent Call Back') return connectToAgent(newMessage, 'typed');
    else {
      try {
        const res = await apiService.askQuestion(
          sentinel,
          jid,
          newMessage,
          token,
          clientFingerPrint,
          sessionID,
          interactionID,
          identifier
        );
        const answerMessage = res.data[0].context;
        if ((res.data[0].kind) === 'answer')
          (answerMessage.callback === 'true') ?
            isAgentHandOver(messageCount,
              new Date().toLocaleTimeString(navigator.language, {
                hour: '2-digit',
                minute: '2-digit',
              }), answerMessage) :
            renderResponse(answerMessage, messageCount, timeNow);
        else if ((res.data[0].kind) === 'default_answer')
          isAgentHandOver(messageCount, timeNow, answerMessage);
      } catch (err) {
        toggleMsgLoader();
        return renderCustomComponent(StandardComponent, {
          message: `Error encountered, try reloading the page or contact the Admin.`,
          hasError: true,
          isIcon: 'false',
          time: timeNow,
        });
      }
    }
  };

  useEffect(() => {
    console.log('userName', userName);
  }, [userName])

  const handleSubmitForm = async () => {
    const { jid, sentinel, token } = botDetails;
    // const { email, name, phone } = userFormDetails;
    userForm = chatWidgetSelector.querySelector('.botFormComponent');
    userName = userForm.querySelector('#name').value;
    userEmail = userForm.querySelector('#email').value;
    userPhone = userForm.querySelector('#phone').value;
    console.log('userForm', userForm);
    try {
      toggleMsgLoader();
      await apiService.logCallback(
        sentinel,
        jid,
        token,
        sessionID,
        userName,
        userEmail,
        userPhone,
      );
      await toggleInputDisabled();
      // renderCustomComponent(FormResponeComponent, { name, email, phone });
      renderCustomComponent(StandardComponent, {
        message:
          `Thank you for that information. Next available agent will connect with you shortly.`,
        hasError: false,
        isIcon: false,
        time: new Date().toLocaleTimeString(navigator.language, {
          hour: '2-digit',
          minute: '2-digit',
        }),
        isFormResponse: true,
        userFields: {
          userName,
          userEmail,
          userPhone
        },
      });
      deleteMessages(1, 'For Form');
      chatWidgetSelector.querySelector('input').focus();
      toggleMsgLoader();
    } catch (err) {
      throw err;
    }
  };

  const changeWidget = () => {
    setOpen(!isOpen);
    if (isOpen === true && isExpired === true) {
      setSessionID(uuidv4())
    } else {
      setExpired(false)
    }

    ['click', 'load', 'scroll', 'mousemove'].forEach((event) => {
      window.addEventListener(event, resetTimer);
    });
    timeChecker();
    return () => {
      clearTimeout(startTimerInterval.current);
      clearInterval(warningInactiveInterval.current);
    };
  };

  const resetTimer = useCallback(() => {
    clearTimeout(startTimerInterval.current);
    clearInterval(warningInactiveInterval.current);
    if (warningInactiveInterval.current && isExpired === true) {
      setSessionID(uuidv4());
      setExpired(false);
    }
    timeChecker();
  }, [isExpired]);

  const timeChecker = () => {
    startTimerInterval.current = setTimeout(() => {
      warningInactive(moment());
    }, 3000);
  };

  const warningInactive = (timeString) => {
    clearTimeout(startTimerInterval.current);
    clearInterval(warningInactiveInterval.current);
    setExpired(false);
    warningInactiveInterval.current = setInterval(() => {
      if (moment.duration(moment().diff(moment(timeString))).minutes() === 5) {
        setExpired(true);
        clearTimeout(startTimerInterval.current);
        clearInterval(warningInactiveInterval.current);
      }
    }, 1000);
  };

  const isAgentHandOver = (messageCount, time, answerMessage) => {
    if (answerMessage && answerMessage.show_text)
      renderCustomComponent(
        StandardComponent,
        { message: answerMessage.show_text, isIcon: false, time },
        false,
        messageCount
      );
    setQuickButtons(AGENT_HANDOVER);
    toggleMsgLoader();
  };

  const renderResponse = (answerMessage, messageCount, time) => {
    console.log('res messageCount', messageCount);
    if (answerMessage && answerMessage.show_text) {
      renderCustomComponent(
        StandardComponent,
        { message: answerMessage.show_text, isIcon: 'false', time },
        false,
        messageCount
      );
      setCurrentMessage(answerMessage.show_text)
      toggleMsgLoader();
      setTimeout(() => {
        botRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 500);
      ((!!answerMessage.quick_reply && answerMessage.quick_reply === 'true')) ?
        addQuickReply(answerMessage.quick_reply_options)
        : setTimeout(() => {
          // NOTE: Disabled quick buttons on first user query
          if (messageCount > 0) setQuickButtons(QUICK_BUTTONS)
          else setQuickButtons([])
        }
          , 2000);

    } else if (answerMessage && answerMessage.text)
      addResponseMessage(answerMessage.text, messageCount);
  };

  const logFeedback = async (feedback) => {
    const { identifier, jid, sentinel, token } = botDetails
    try {
      let time = new Date().toLocaleTimeString(navigator.language, {
        hour: '2-digit',
        minute: '2-digit',
      });
      if (messageCount > 1) {
        deleteMessages(2, messageCount - 1);
      }

      if (feedback === 0) setRatingsDownCount(ratingsDownCount + 1);
      if (feedback === 1) {
        renderCustomComponent(StandardComponent, {
          message: currentMessage,
          isIcon: 'like',
          time,
        })
      } else {
        renderCustomComponent(StandardComponent, {
          message: currentMessage,
          isIcon: 'unlike',
          time: new Date().toLocaleTimeString(navigator.language, {
            hour: '2-digit',
            minute: '2-digit',
          }),
        });
      }

      setQuickButtons([]);
      setQuickReply(null);
      chatWidgetSelector.querySelector('input').focus();
      if (ratingsDownCount > 2) {
        toggleMsgLoader();
        isAgentHandOver(messageCount, time);
        setRatingsDownCount(0);
      }

      await apiService.logFeedback(
        sentinel,
        jid,
        feedback,
        token,
        clientFingerPrint,
        sessionID,
        interactionID,
        identifier
      );
      deleteMessages(1, messageCount);
    } catch (err) {
      throw err;
    }
  };

  const FormComponent = () => {
    return <div className={classes.botFormComponent}>
      Please share your details so we can reach out to you.
      <input
        type="text"
        placeholder="Name"
        required
        id="name"
      />
      <input
        type="email"
        placeholder="Email"
        required
        id="email"
      />
      <input
        type="number"
        placeholder="Phone"
        required
        id="phone"
      />
      <div className={classes.formButtons}>
        <button onClick={handleSubmitForm} id="connectBtn" className="enabledConnect">Connect</button>
        <button onClick={handleCancelSubmit} className="enabledConnect">Cancel</button>
      </div>
    </div>
  }
    ;

  const StandardComponent = ({ message, hasError, isIcon, time, isFormResponse, userFields }) => {
    return (
      <div className={classes.customComponentWrapper}>
        {isFormResponse ? (
          <div className={classes.formResponse}>
            <span className={classes.formResponseTitle}>
              Information:
            </span>
            <div>
              Name: <span>{userFields.userName}</span>
            </div>
            <div>
              Email: <span>{userFields.userEmail}</span>
            </div>
            <div>
              Phone: <span>{userFields.userPhone}</span>
            </div>
          </div>
        ) : null}
        <div className={classes.customComponentMessage}>
          <div className={classes.botCustomComponent} ref={botRef}>
            {hasError ? (
              <>
                <WarningOutlined /> {parse(message)}
              </>
            ) : (
              parse(message)
            )}
          </div>
          <div className={classes.customComponentIcon}>
            {isIcon === 'like' ? (
              <div className="icon"><LikeFilled twoToneColor='yellow' /></div>
            ) : isIcon === 'unlike' ? (
              <div className="icon"><DislikeFilled twoToneColor='yellow' /></div>
            ) : (
              ''
            )}
          </div>
        </div>

        <div className={classes.timeDetails}>{time}</div>
      </div>
    );
  };

  return {
    botDetails,
    setQuickButtons,
    changeWidget,
    handleNewUserMessage,
    handleQuickButtonClicked,
  }
}

export default useZeroShotBot

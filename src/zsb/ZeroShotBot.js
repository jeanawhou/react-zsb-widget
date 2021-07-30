import React from 'react';
import PropTypes from 'prop-types';
import { Widget } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';

import { useStyles } from './ZeroShotBot.styles';
import useZeroShotBot from './hooks';

const ZeroShotBot = ({ bot, backgroundColor, color, height }) => {
  const {
    botDetails,
    setQuickButtons,
    changeWidget,
    handleNewUserMessage,
    handleQuickButtonClicked,
  } = useZeroShotBot({ bot, backgroundColor, color, height });
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.answersContainer}>
        <div className={classes.chatBot}>
          <div onClick={changeWidget}>
            <Widget
              title={botDetails.componentTitle}
              senderPlaceHolder={botDetails.placeHolder}
              handleNewUserMessage={handleNewUserMessage}
              subtitle={botDetails.subtitle}
              profileAvatar={botDetails.profile}
              setQuickButtons={setQuickButtons}
              handleQuickButtonClicked={handleQuickButtonClicked}
              toggleWidget={true}
              showCloseButton={true}
              autofocus={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

ZeroShotBot.defaultProps = {
  color: '#000',
  height: 410,
  textColor: '#fff',
};

ZeroShotBot.propTypes = {
  bot: PropTypes.string.isRequired,
  textColor: PropTypes.string,
  height: PropTypes.string,
  color: PropTypes.string,
};

export default ZeroShotBot;

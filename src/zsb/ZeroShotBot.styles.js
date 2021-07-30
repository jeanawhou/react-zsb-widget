import { makeStyles } from '@material-ui/core/styles';
import 'typeface-roboto';

const cssVariables = {
  primaryColor: '#202225',
  secondaryColor: '#f3f3f3',
  cardShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 8px 0 rgba(0, 0, 0, 0.2)',
  primaryTransparent: 'rgba(33, 35, 38, 0.774)',

  // the higher the number the light the color
  gray0: '#66696F',
  gray1: '#d1d1d1',
  gray2: '#e5e5e5',
  gray3: '#f4f6f8',
  gray4: '#f0f2f5',
  primaryBlue: '#167BE7',
  primaryBlueHover: '#daecfd',
  blue1: '#daecfd',
  red1: '#FFF6F5',
  red10: '#eb6841',

  // Error message colors
  errorText: '#f5222d',
  errorBgColor: '#fff1f0',
  errorBorder: '#ffa39e',

  green0: '#52c41a',
  green1: '#23b576',

  success: '#23b576',
  successHover: '#cce6db',
};

export const useStyles = makeStyles((theme) => ({
  '@keyframes rotate-left': {
    '0%': {
      transform: 'rotate(-45deg)'
    },

    '100%': {
      transform: 'rotate(0)'
    },
  },
  '@keyframes rotate-right': {
    '0%': {
      transform: 'rotate(45deg)'
    },

    '100%': {
      transform: 'rotate(0)'
    },
  },
  '@keyframes fadeUp': {
    '0%': {
      opacity: 0,
      transform: 'translateY(10%)'
    },
    '100%': {
      opacity: 1,
      transform: 'translateY(0%)'
    },
  },
  root: {
    display: 'flex',
    width: '100%',

    '& .rcw-widget-container': {
      fontFamily: 'Roboto'
    },

    '& .rcw-conversation-container.active': {
      animation: '$fadeUp 0.3s linear',

      '& .rcw-close-button': {
        backgroundColor: cssVariables.primaryColor
      },
      '& p': {
        margin: 0,
        marginBottom: 0
      },

      '& .rcw-messages-container': {
        overflowY: 'auto !important',
      },

      '& .rcw-message': {
        fontSize: 14
      },

      '& .rcw-message img': {
        maxWidth: 280
      }
    },

  },
  botFormComponent: {
    '& input': {
      height: 20,
      padding: 5,
      marginTop: 5,
      width: '70%',
      borderRadius: 5,
      border: `1px solid ${cssVariables.gray0}`,
      display: 'flex',
      columnGap: 5,

      '&:active': {
        border: 'none'
      }
    },
  },
  formButtons: {
    display: 'flex',
    rowGap: 5,
    '& button': {
      height: 30,
      borderRadius: 5,
      border: `1px solid ${cssVariables.gray0}`,
      margin: '5px 5px 0px 0px',
      '&:hover': {
        cursor: 'pointer',
      }
    }
  },
  customComponentWrapper: {
    display: 'flex',
    flexDirection: 'column',
    rowGrap: 5
  },
  customComponentIcon: {
    '& .anticon': {
      color: cssVariables.primaryBlue
    }
  },
  customComponentMessage: {
    display: 'flex',
    alignItems: 'center',
    columnGap: 5
  },
  formResponse: {
    display: 'flex',
    rowGap: 5,
    flexDirection: 'column',
    marginBottom: 10,

    '& span': {
      fontWeight: 700
    }
  },
  formResponseTitle: {
    textDecoration: 'underline'
  },
  botCustomComponent: {
    backgroundColor: '#f4f7f9',
    borderRadius: 10,
    padding: 15,
    maxWidth: 290,
    textAlign: 'left',

    '& p:first-child': {
      margin: 0
    },

    '&.error': {
      maxWidth: '100%',
      color: cssVariables.errorBorder,
      fontWeight: 700,
      backgroundColor: cssVariables.errorBgColor,
      border: cssVariables.errorBorder,
    },
  },
  timeDetails: {
    fontSize: 10,
    paddingTop: 5,
  },
  answersContainer: {
    paddingRight: 75,
    flex: '1 1 auto',
    marginBottom: 50
  },
  chatBot: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  chatWidgetLauncher: {
    display: 'flex',
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: 10,
    backgroundColor: cssVariables.primaryColor,
    borderRadius: '50%',
    height: 55,
    width: 55,
    animation: '$rotate-right .5s forwards',
    bottom: 20,

    '&:hover': {
      cursor: 'pointer',
    },
    '&:only-child': {
      width: 60,
      height: 60,
      padding: 5,
      display: 'flex',
      justifyContent: 'center',
      position: 'fixed',
    },

    '&:not(:only-child)': {
      animation: '$rotate-left .5s forwards',
      padding: 10,
      justifyContent: 'center',
      content: `url(../assets/images/close-white.png)`,
    }
  },
}));
import { iOSColors } from 'react-native-typography';

const BEST_SELLER_IMG = require('../assets/best-seller.png');

export default {
  image: {
    success: require('../assets/images/success.json'),
    erorr: require('../assets/images/error.json'),
    loading: require('../assets/images/loading.json')
  },
  fontFamily: {
    bold: 'AvenirNext-Bold',
    medium: 'AvenirNext-Medium',
    mediumItalic: 'AvenirNext-MediumItalic',
    regular: 'AvenirNext-Regular'
  },
  fontSize: {
    small: 12,
    medium: 16,
    subHeader: 20,
    header: 24,
    footer: 14
  },
  color: {
    black: '#323854',
    red: '#f4511e',
    lightBlue: '#0BB237',
    // blackBlue: '#323854',
    blackBlue: '#D1367F',
    gray: iOSColors.gray,
    white: '#FFFFFF',
    lightGray: iOSColors.customGray,
    darkGray: iOSColors.gray,
    customGray: '#FBFBFC',
    placeholder: '#9E9E9E',
    background: '#e0e1e6',
    darkBackground: '#eff2f5',
    customDark: '#E0E0E0',
    lightBorder: '#e0e0e0',
    selectedBorder: '#EA83B4',
    darkBorder: '#eeeeee',
    blackBackground: '#14141E',
    blackLightBackground: '#212128',
    disableButton: iOSColors.gray,
    lightBackground: '#EA83B4',
    lightPink: '#FCDCEB'
  },
  lightHeader: {
    fontFamily: 'AvenirNext-Bold',
    color: '#FFFFFF',
    fontSize: 32
  },

  lightHeaderTitle: {
    fontFamily: 'AvenirNext-Bold',
    fontWeight: '500',
    color: '#FFFFFF',
    fontSize: 20
  },
  blackHeaderTitle: {
    fontFamily: 'AvenirNext-Bold',
    fontWeight: '500',
    color: '#323854',
    fontSize: 20
  },
  greenBigTitle: {
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '400',
    color: iOSColors.green,
    fontSize: 20
  },

  blackEmphasizeTitle: {
    fontFamily: 'AvenirNext-Bold',
    fontSize: 18,
    color: '#323854',
    fontWeight: '600'
  },

  blackTitle: {
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '600',
    color: '#323854',
    fontSize: 16
  },

  buttonText: {
    fontFamily: 'AvenirNext-Medium',
    fontSize: 16,
    color: '#FFFFFF'
  },

  textEmphasize: {
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    color: '#323854',
    fontSize: 16
  },
  superBigTextEmphasize: {
    fontFamily: 'AvenirNext-Bold',
    fontWeight: 'bold',
    color: '#323854',
    fontSize: 40
  },
  textLightEmphasize: {
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    color: iOSColors.white,
    fontSize: 16
  },
  smallTextEmphasize: {
    fontFamily: 'AvenirNext-Bold',
    fontWeight: '600',
    color: '#323854',
    fontSize: 14
  },
  bigTextEmphasize: {
    fontFamily: 'AvenirNext-Bold',
    fontWeight: '600',
    color: '#323854',
    fontSize: 20
  },
  normalDarkText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    color: '#323854'
  },
  normalLightText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 16,
    color: '#FFFFFF'
  },
  placeholderText: {
    fontFamily: 'AvenirNext-Medium',
    color: '#9E9E9E',
    fontSize: 18
  },
  smallPlaceholderText: {
    fontFamily: 'AvenirNext-Medium',
    color: '#9E9E9E',
    fontSize: 14
  },
  noteText: {
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    color: 'red',

  },
  bestSeller: BEST_SELLER_IMG
};

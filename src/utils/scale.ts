import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

const normalize = (size: number) => PixelRatio.roundToNearestPixel(size);

export const scale = (size: number) => normalize((SCREEN_WIDTH / BASE_WIDTH) * size);

export const verticalScale = (size: number) => normalize((SCREEN_HEIGHT / BASE_HEIGHT) * size);

export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

export default scale;

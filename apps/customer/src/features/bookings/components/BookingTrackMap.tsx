import { Ionicons } from '@expo/vector-icons';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Defs, Path, Stop, LinearGradient as SvgGradient } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { proMapPosition } from '../lib/booking.tracking';
import { colors } from '@/theme/colors';

interface BookingTrackMapProps {
  progress: number;
}

const ROUTE = 'M 36 230 C 90 205, 130 175, 175 150 S 250 105, 295 82';

export function BookingTrackMap({ progress }: BookingTrackMapProps) {
  const pos = proMapPosition(progress);
  const pulse = useSharedValue(1);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1.8, { duration: 1500, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 0 }),
      ),
      -1,
    );
  }, [pulse]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
    opacity: 0.45 - pulse.value * 0.2,
  }));

  const routeLen = 300 * progress;

  return (
    <View style={styles.wrap}>
      <Svg width="100%" height="100%" viewBox="0 0 360 320" style={StyleSheet.absoluteFill}>
        <Defs>
          <SvgGradient id="mapBg" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#F0EDE8" />
            <Stop offset="1" stopColor="#E3DDD4" />
          </SvgGradient>
        </Defs>

        <Path d="M0 0 H360 V320 H0 Z" fill="url(#mapBg)" />

        {/* City blocks — Google Maps lite feel */}
        <Path d="M 0 80 H140 V160 H0 Z" fill="rgba(255,255,255,0.55)" />
        <Path d="M 160 40 H280 V130 H160 Z" fill="rgba(255,255,255,0.45)" />
        <Path d="M 200 200 H360 V290 H200 Z" fill="rgba(255,255,255,0.5)" />
        <Path d="M 20 200 H120 V280 H20 Z" fill="rgba(255,255,255,0.4)" />

        {/* Roads */}
        <Path d="M 0 160 H360" stroke="#FFFFFF" strokeWidth={10} />
        <Path d="M 0 160 H360" stroke="#D8D2C8" strokeWidth={4} />
        <Path d="M 140 0 V320" stroke="#FFFFFF" strokeWidth={8} />
        <Path d="M 140 0 V320" stroke="#D8D2C8" strokeWidth={3} />
        <Path d="M 0 240 H200" stroke="#FFFFFF" strokeWidth={7} />
        <Path d="M 0 240 H200" stroke="#D8D2C8" strokeWidth={3} />

        {/* Route — travelled */}
        <Path
          d={ROUTE}
          stroke="rgba(11,110,103,0.2)"
          strokeWidth={6}
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d={ROUTE}
          stroke="#0B6E67"
          strokeWidth={5}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${routeLen} 300`}
        />

        {/* Destination halo */}
        <Circle cx={295} cy={82} r={28} fill="rgba(11,110,103,0.1)" />
        <Circle cx={295} cy={82} r={8} fill="#0B6E67" />
      </Svg>

      {/* Home pin — Zomato style */}
      <View style={[styles.homePin, { right: '12%', top: '22%' }]}>
        <View style={styles.homePinHead}>
          <Ionicons name="home" size={14} color={colors.white} />
        </View>
        <View style={styles.homePinTail} />
      </View>

      {/* Partner marker pulse */}
      <Animated.View
        style={[styles.partnerPulse, pulseStyle, { left: `${pos.x}%`, top: `${pos.y}%` }]}
        pointerEvents="none"
      />

      {/* Partner marker — Swiggy delivery executive */}
      <View style={[styles.partner, { left: `${pos.x}%`, top: `${pos.y}%` }]}>
        <View style={styles.partnerBubble}>
          <Ionicons name="person" size={18} color={colors.white} />
        </View>
        <View style={styles.partnerPointer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: '#EAE6E1',
    overflow: 'hidden',
  },
  homePin: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 2,
  },
  homePinHead: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#0B6E67',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  homePinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#0B6E67',
    marginTop: -2,
  },
  partnerPulse: {
    position: 'absolute',
    width: 48,
    height: 48,
    marginLeft: -24,
    marginTop: -30,
    borderRadius: 24,
    backgroundColor: 'rgba(11,110,103,0.25)',
    zIndex: 1,
  },
  partner: {
    position: 'absolute',
    alignItems: 'center',
    marginLeft: -20,
    marginTop: -26,
    zIndex: 3,
  },
  partnerBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0B6E67',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  partnerPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#0B6E67',
    marginTop: -1,
  },
});

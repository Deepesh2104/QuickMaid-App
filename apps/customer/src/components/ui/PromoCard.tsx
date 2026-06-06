import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';
import { radius, shadow, spacing } from '../../theme/spacing';
import { type } from '../../theme/typography';

interface PromoCardProps {
  title: string;
  subtitle: string;
  cta?: string;
  code?: string;
  onPress?: () => void;
}

export function PromoCard({
  title,
  subtitle,
  cta = 'Claim now',
  code = 'FIRST20',
  onPress,
}: PromoCardProps) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <LinearGradient
        colors={['#084F4A', '#0B6E67']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Limited offer</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>{subtitle}</Text>
          <View style={styles.bottomRow}>
            <View style={styles.codePill}>
              <Text style={styles.codeLabel}>Code</Text>
              <Text style={styles.code}>{code}</Text>
            </View>
            <View style={styles.ctaRow}>
              <Text style={styles.cta}>{cta}</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.white} />
            </View>
          </View>
        </View>

        <View style={styles.deco} pointerEvents="none">
          <View style={styles.decoCircle} />
          <Ionicons name="gift-outline" size={42} color="rgba(255,255,255,0.2)" />
        </View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xl,
    overflow: 'hidden',
    ...shadow.md,
  },
  gradient: {
    flexDirection: 'row',
    minHeight: 148,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    zIndex: 2,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: spacing.sm,
  },
  badgeText: {
    ...type.overline,
    fontSize: 9,
    color: colors.white,
  },
  title: {
    ...type.h3,
    color: colors.white,
    marginBottom: 4,
  },
  sub: {
    ...type.bodySm,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  codePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  codeLabel: {
    ...type.caption,
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
  },
  code: {
    ...type.bodySm,
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cta: {
    ...type.bodySm,
    color: colors.white,
    fontWeight: '600',
  },
  deco: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  decoCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.06)',
    right: -20,
  },
});

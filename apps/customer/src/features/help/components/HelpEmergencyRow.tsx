import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

import { SUPPORT_CONTACT } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function HelpEmergencyRow() {
  const call = () => Linking.openURL(`tel:${SUPPORT_CONTACT.phone.replace(/\s/g, '')}`);
  const wa = () =>
    Linking.openURL(`https://wa.me/${SUPPORT_CONTACT.whatsapp.replace(/\D/g, '')}`);

  return (
    <View style={styles.block}>
      <View style={styles.labelRow}>
        <Ionicons name="alert-circle" size={16} color="#D92D20" />
        <Text style={styles.label}>Need urgent help?</Text>
      </View>

      <View style={styles.row}>
        <Pressable
          style={styles.btn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            call();
          }}
          accessibilityRole="button"
          accessibilityLabel={`Emergency call ${SUPPORT_CONTACT.phone}`}
        >
          <LinearGradient colors={['#FEF3F2', '#FFFFFF']} style={StyleSheet.absoluteFill} />
          <View style={[styles.icon, { backgroundColor: '#FEE4E2' }]}>
            <Ionicons name="call" size={20} color="#D92D20" />
          </View>
          <Text style={styles.btnTitle}>Call now</Text>
          <Text style={styles.btnSub}>{SUPPORT_CONTACT.phone}</Text>
        </Pressable>

        <Pressable
          style={styles.btn}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            wa();
          }}
          accessibilityRole="button"
          accessibilityLabel={`WhatsApp ${SUPPORT_CONTACT.whatsapp}`}
        >
          <LinearGradient colors={['#ECFDF5', '#FFFFFF']} style={StyleSheet.absoluteFill} />
          <View style={[styles.icon, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="logo-whatsapp" size={20} color="#027A48" />
          </View>
          <Text style={styles.btnTitle}>WhatsApp</Text>
          <Text style={styles.btnSub}>Instant reply</Text>
        </Pressable>
      </View>
    </View>
  );
}

const GAP = spacing.sm;
const BTN_W = (layout.screenWidth - layout.pad * 2 - GAP) / 2;

const styles = StyleSheet.create({
  block: {
    marginHorizontal: layout.pad,
    marginBottom: spacing.section,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: spacing.sm,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 13,
    color: '#D92D20',
  },
  row: { flexDirection: 'row', gap: GAP },
  btn: {
    width: BTN_W,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: 4,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  btnTitle: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: colors.ink,
  },
  btnSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
});

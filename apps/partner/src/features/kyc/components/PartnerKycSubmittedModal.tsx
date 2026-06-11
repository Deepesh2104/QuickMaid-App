import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { QmButton } from '@/components/ui/QmButton';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerKycSubmittedModalProps {
  visible: boolean;
  onClose: () => void;
  onViewEarnings?: () => void;
}

export function PartnerKycSubmittedModal({
  visible,
  onClose,
  onViewEarnings,
}: PartnerKycSubmittedModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <LinearGradient colors={['#084F4A', '#0B6E67']} style={styles.hero}>
            <View style={styles.iconRing}>
              <Ionicons name="shield-checkmark" size={32} color={colors.partnerGold} />
            </View>
            <Text style={styles.title}>KYC submitted</Text>
            <Text style={styles.sub}>
              Documents are under review. You will get a notification once payouts unlock — usually within 24–48 hours.
            </Text>
          </LinearGradient>

          <View style={styles.body}>
            <View style={styles.row}>
              <Ionicons name="time-outline" size={16} color={colors.primary} />
              <Text style={styles.rowText}>You can still accept and complete demo jobs</Text>
            </View>
            <View style={styles.row}>
              <Ionicons name="wallet-outline" size={16} color={colors.primary} />
              <Text style={styles.rowText}>Monday payout batch after approval</Text>
            </View>

            <QmButton label="Back to profile" icon="person-outline" onPress={onClose} />
            {onViewEarnings ? (
              <Pressable
                style={styles.secondary}
                onPress={() => {
                  Haptics.selectionAsync();
                  onViewEarnings();
                }}
              >
                <Text style={styles.secondaryText}>View earnings while you wait</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(3,42,40,0.55)',
    justifyContent: 'flex-end',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    ...shadow.lg,
  },
  hero: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(252,211,77,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.white },
  sub: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: 'rgba(255,255,255,0.78)',
    textAlign: 'center',
    lineHeight: 19,
  },
  body: { padding: spacing.lg, gap: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  rowText: { flex: 1, fontFamily: fonts.regular, fontSize: 12, color: colors.inkSecondary, lineHeight: 17 },
  secondary: { alignItems: 'center', paddingVertical: spacing.sm },
  secondaryText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.primary },
});

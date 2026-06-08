import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmInput } from '@/components/ui/QmInput';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import type { PaymentMethod } from '../types/profile.types';
import { ProfilePaymentPreview } from './ProfilePaymentPreview';
import {
  ProfilePremiumDeleteBtn,
  ProfilePremiumSaveBtn,
  ProfilePremiumToggle,
} from './ProfilePremiumParts';

const UPI_APPS = [
  { id: 'gpay', label: 'Google Pay', icon: 'logo-google' as const, detail: 'name@okaxis' },
  { id: 'phonepe', label: 'PhonePe', icon: 'phone-portrait-outline' as const, detail: 'name@ybl' },
  { id: 'paytm', label: 'Paytm', icon: 'wallet-outline' as const, detail: 'name@paytm' },
];

const ICON_MAP = {
  upi: 'phone-portrait-outline' as const,
  card: 'card-outline' as const,
  wallet: 'wallet-outline' as const,
};

const SECURITY = [
  { icon: 'shield-checkmark' as const, label: 'PCI compliant' },
  { icon: 'lock-closed' as const, label: '256-bit SSL' },
  { icon: 'eye-off' as const, label: 'Never stored raw' },
];

interface ProfileEditPaymentModalProps {
  visible: boolean;
  payment?: PaymentMethod;
  onClose: () => void;
  onSave: (pm: Omit<PaymentMethod, 'id'> & { id?: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function ProfileEditPaymentModal({ visible, payment, onClose, onSave, onDelete }: ProfileEditPaymentModalProps) {
  const insets = useSafeAreaInsets();
  const [type, setType] = useState<'upi' | 'card'>('upi');
  const [label, setLabel] = useState('');
  const [detail, setDetail] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      const t = payment?.type === 'card' ? 'card' : 'upi';
      setType(t);
      setLabel(payment?.label ?? (t === 'upi' ? 'Google Pay' : 'HDFC Debit'));
      setDetail(payment?.detail ?? '');
      setIsDefault(payment?.isDefault ?? !payment);
    }
  }, [visible, payment]);

  const close = () => {
    Haptics.selectionAsync();
    onClose();
  };

  const pickUpi = (app: (typeof UPI_APPS)[0]) => {
    Haptics.selectionAsync();
    setType('upi');
    setLabel(app.label);
    setDetail(app.detail);
  };

  const save = async () => {
    if (!label.trim() || !detail.trim()) return;
    setSaving(true);
    await onSave({
      id: payment?.id,
      type,
      label: label.trim(),
      detail: detail.trim(),
      isDefault,
      icon: ICON_MAP[type],
    });
    setSaving(false);
    onClose();
  };

  const remove = async () => {
    if (!payment?.id || !onDelete || payment.type === 'wallet') return;
    setSaving(true);
    await onDelete(payment.id);
    setSaving(false);
    onClose();
  };

  const canDelete = Boolean(payment && onDelete && payment.type !== 'wallet');

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={close}>
      <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
        >
          <LinearGradient colors={['#084F4A', '#0B6E67', '#0F1419']} locations={[0, 0.55, 1]} style={styles.hero}>
            <View style={[styles.heroTop, { paddingTop: insets.top + spacing.sm }]}>
              <Pressable style={styles.closeBtn} onPress={close} accessibilityRole="button" accessibilityLabel="Close">
                <Ionicons name="close" size={20} color={colors.white} />
              </Pressable>
              <View style={styles.heroBadge}>
                <Ionicons name="shield-checkmark" size={12} color="#6EE7B7" />
                <Text style={styles.heroBadgeText}>Secure checkout</Text>
              </View>
            </View>
            <Text style={styles.heroTitle}>{payment ? 'Edit payment' : 'Add payment'}</Text>
            <Text style={styles.heroSub}>Pay after service · UPI · Cards · Wallet</Text>
            <View style={styles.heroFade} pointerEvents="none" />
          </LinearGradient>

          <View style={styles.body}>
            <ProfilePaymentPreview type={type} label={label} detail={detail} isDefault={isDefault} />

            <View style={styles.typeRow}>
              {(['upi', 'card'] as const).map((t) => {
                const on = type === t;
                return (
                  <Pressable
                    key={t}
                    style={[styles.typeTile, on && styles.typeTileOn]}
                    onPress={() => {
                      Haptics.selectionAsync();
                      setType(t);
                      if (!payment) {
                        setLabel(t === 'upi' ? 'Google Pay' : 'HDFC Debit');
                        setDetail('');
                      }
                    }}
                  >
                    <LinearGradient
                      colors={on ? ['#0B6E67', '#084F4A'] : ['#FAFBFC', '#F4F6F8']}
                      style={StyleSheet.absoluteFill}
                    />
                    <Ionicons name={t === 'upi' ? 'phone-portrait-outline' : 'card-outline'} size={22} color={on ? colors.white : colors.muted} />
                    <Text style={[styles.typeLabel, on && styles.typeLabelOn]}>{t === 'upi' ? 'UPI' : 'Card'}</Text>
                    <Text style={[styles.typeSub, on && styles.typeSubOn]}>{t === 'upi' ? 'Instant · No fees' : 'Debit / Credit'}</Text>
                  </Pressable>
                );
              })}
            </View>

            {type === 'upi' && !payment ? (
              <View style={styles.section}>
                <Text style={styles.sectionEyebrow}>QUICK ADD UPI</Text>
                <View style={styles.upiRow}>
                  {UPI_APPS.map((app) => {
                    const on = label === app.label;
                    return (
                      <Pressable key={app.id} style={[styles.upiChip, on && styles.upiChipOn]} onPress={() => pickUpi(app)}>
                        <Ionicons name={app.icon} size={18} color={on ? colors.primaryDark : colors.muted} />
                        <Text style={[styles.upiChipText, on && styles.upiChipTextOn]}>{app.label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ) : null}

            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Payment details</Text>
              <QmInput label="Display name" value={label} onChangeText={setLabel} placeholder="Google Pay / HDFC Debit" />
              <QmInput
                label={type === 'upi' ? 'UPI ID' : 'Card last 4 digits'}
                value={detail}
                onChangeText={setDetail}
                placeholder={type === 'upi' ? 'name@upi' : '4821'}
                keyboardType={type === 'upi' ? 'email-address' : 'number-pad'}
                autoCapitalize="none"
                hint={type === 'upi' ? 'Used to verify at checkout' : 'We never store full card numbers'}
              />
              <ProfilePremiumToggle label="Set as default" sub="Used first at checkout" value={isDefault} onChange={setIsDefault} />
            </View>

            <View style={styles.securityRow}>
              {SECURITY.map((s) => (
                <View key={s.label} style={styles.securityItem}>
                  <Ionicons name={s.icon} size={14} color={colors.primaryDark} />
                  <Text style={styles.securityText}>{s.label}</Text>
                </View>
              ))}
            </View>

            <View style={styles.cashNote}>
              <Ionicons name="cash-outline" size={18} color={colors.primaryDark} />
              <Text style={styles.cashText}>Prefer cash? Pay after every visit — no method required.</Text>
            </View>
          </View>
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          {canDelete ? <ProfilePremiumDeleteBtn label="Remove method" onPress={remove} /> : null}
          <ProfilePremiumSaveBtn
            label={payment ? 'Update method' : 'Add payment method'}
            onPress={save}
            loading={saving}
            disabled={!label.trim() || !detail.trim()}
            icon="shield-checkmark-outline"
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  hero: {
    paddingHorizontal: layout.pad,
    paddingBottom: spacing.xxl + 8,
    gap: spacing.xs,
  },
  heroTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(110,231,183,0.25)',
  },
  heroBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#6EE7B7',
  },
  heroTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 28,
    color: colors.white,
    letterSpacing: -0.8,
  },
  heroSub: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  heroFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
  },
  body: {
    marginTop: -spacing.md,
    paddingHorizontal: layout.pad,
    gap: spacing.lg,
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  typeTile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderRadius: radius.xxl,
    overflow: 'hidden',
    gap: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  typeTileOn: {
    borderColor: colors.primary,
  },
  typeLabel: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
  },
  typeLabelOn: { color: colors.white },
  typeSub: {
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.muted,
  },
  typeSubOn: { color: 'rgba(255,255,255,0.7)' },
  section: { gap: spacing.sm },
  sectionEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 1.2,
  },
  upiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  upiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  upiChipOn: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  upiChipText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: colors.muted,
  },
  upiChipTextOn: {
    color: colors.primaryDark,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    gap: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  formTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  securityItem: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.primaryLight,
  },
  securityText: {
    fontFamily: fonts.semiBold,
    fontSize: 9,
    color: colors.primaryDark,
    textAlign: 'center',
  },
  cashNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: '#FAFBFC',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    marginBottom: spacing.sm,
  },
  cashText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 17,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.md,
    backgroundColor: colors.bg,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.divider,
    gap: spacing.xs,
  },
});

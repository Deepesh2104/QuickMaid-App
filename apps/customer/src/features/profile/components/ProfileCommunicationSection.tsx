import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';

import { HomeSectionHeader } from '@/features/home/components/HomeSectionHeader';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import type { CommunicationPrefs } from '../types/profile.types';

const CHANNELS = [
  { id: 'whatsapp' as const, label: 'WhatsApp', icon: 'logo-whatsapp' as const },
  { id: 'sms' as const, label: 'SMS', icon: 'chatbox-outline' as const },
  { id: 'call' as const, label: 'Call', icon: 'call-outline' as const },
];

interface ProfileCommunicationSectionProps {
  communication: CommunicationPrefs;
  onChange: (next: CommunicationPrefs) => Promise<void>;
}

export function ProfileCommunicationSection({ communication, onChange }: ProfileCommunicationSectionProps) {
  const setChannel = async (id: CommunicationPrefs['preferredChannel']) => {
    Haptics.selectionAsync();
    await onChange({ ...communication, preferredChannel: id, whatsappOptIn: id === 'whatsapp' ? true : communication.whatsappOptIn });
  };

  const toggleWa = async (val: boolean) => {
    Haptics.selectionAsync();
    await onChange({ ...communication, whatsappOptIn: val });
  };

  return (
    <View style={styles.block}>
      <HomeSectionHeader eyebrow="Reach you" title="Communication" subtitle="How we contact you" icon="chatbubbles-outline" compact />

      <View style={styles.card}>
        <View style={styles.waRow}>
          <View style={styles.waLeft}>
            <Ionicons name="logo-whatsapp" size={20} color="#027A48" />
            <View>
              <Text style={styles.waLabel}>WhatsApp updates</Text>
              <Text style={styles.waSub}>Booking alerts & offers</Text>
            </View>
          </View>
          <Switch
            value={communication.whatsappOptIn}
            onValueChange={toggleWa}
            trackColor={{ false: colors.bgMuted, true: '#D1FAE5' }}
            thumbColor={communication.whatsappOptIn ? '#027A48' : colors.mutedLight}
          />
        </View>

        <Text style={styles.channelLabel}>Preferred channel</Text>
        <View style={styles.channelRow}>
          {CHANNELS.map((c) => {
            const on = communication.preferredChannel === c.id;
            return (
              <Pressable
                key={c.id}
                style={[styles.channel, on && styles.channelOn]}
                onPress={() => setChannel(c.id)}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
              >
                <Ionicons name={c.icon} size={16} color={on ? colors.primaryDark : colors.muted} />
                <Text style={[styles.channelText, on && styles.channelTextOn]}>{c.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: spacing.section },
  card: {
    marginHorizontal: layout.pad,
    borderRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
    backgroundColor: colors.bg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  waRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  waLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  waLabel: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  waSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  channelLabel: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  channelRow: { flexDirection: 'row', gap: spacing.sm },
  channel: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSubtle,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.divider,
  },
  channelOn: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  channelText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.muted },
  channelTextOn: { color: colors.primaryDark },
});

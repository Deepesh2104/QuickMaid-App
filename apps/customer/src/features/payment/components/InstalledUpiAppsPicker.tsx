import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import type { UpiAppDef } from '../constants/gateway';
import { useInstalledUpiApps } from '../hooks/useInstalledUpiApps';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

interface InstalledUpiAppsPickerProps {
  selectedId?: string | null;
  onSelect: (app: UpiAppDef) => void;
  onOpenChooser?: () => void;
  compact?: boolean;
}

export function InstalledUpiAppsPicker({
  selectedId,
  onSelect,
  onOpenChooser,
  compact,
}: InstalledUpiAppsPickerProps) {
  const { apps, loading, chooserAvailable } = useInstalledUpiApps(true);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Checking UPI apps on your phone…</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.head}>
        <Ionicons name="phone-portrait-outline" size={16} color={colors.primaryDark} />
        <Text style={styles.title}>
          {apps.length ? 'UPI apps on your phone' : 'Pay with UPI'}
        </Text>
      </View>

      {apps.length > 0 ? (
        <View style={[styles.grid, compact && styles.gridCompact]}>
          {apps.map((app) => {
            const on = selectedId === app.id;
            return (
              <Pressable
                key={app.id}
                style={[styles.tile, compact && styles.tileCompact, on && styles.tileOn]}
                onPress={() => {
                  Haptics.selectionAsync();
                  onSelect(app);
                }}
              >
                <View style={[styles.icon, { backgroundColor: `${app.color}18` }]}>
                  <Ionicons name={app.icon} size={compact ? 18 : 22} color={app.color} />
                </View>
                <Text style={[styles.label, on && styles.labelOn]} numberOfLines={1}>
                  {app.label}
                </Text>
                {on ? <Ionicons name="checkmark-circle" size={14} color="#2563EB" /> : null}
              </Pressable>
            );
          })}
        </View>
      ) : (
        <Text style={styles.empty}>
          Installed UPI apps could not be listed here. Tap below to open the UPI picker on your phone.
        </Text>
      )}

      {chooserAvailable && onOpenChooser ? (
        <Pressable
          style={styles.chooser}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onOpenChooser();
          }}
        >
          <Ionicons name="apps-outline" size={16} color="#2563EB" />
          <Text style={styles.chooserText}>Show all UPI apps on my phone</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: spacing.sm },
  head: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  title: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  loading: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: spacing.sm },
  loadingText: { fontFamily: fonts.medium, fontSize: 12, color: colors.muted },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  gridCompact: { gap: spacing.xs },
  tile: {
    width: '30%',
    minWidth: 96,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(15,20,25,0.08)',
    gap: spacing.xs,
  },
  tileCompact: { width: '23%', minWidth: 72, padding: spacing.sm },
  tileOn: { borderColor: '#2563EB', backgroundColor: '#EFF6FF' },
  icon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  label: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.muted, textAlign: 'center' },
  labelOn: { color: '#1D4ED8', fontFamily: fonts.bold },
  empty: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, lineHeight: 17 },
  chooser: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: radius.xl,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: 'rgba(37,99,235,0.2)',
  },
  chooserText: { fontFamily: fonts.bold, fontSize: 13, color: '#1D4ED8' },
});

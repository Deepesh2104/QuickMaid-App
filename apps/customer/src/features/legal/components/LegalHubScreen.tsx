import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LEGAL_HUB_ITEMS } from '../constants/legal.content';
import { useOpenLegal } from '../hooks/useOpenLegal';
import type { LegalDocId } from '../types/legal.types';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

export function LegalHubScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const openLegal = useOpenLegal();

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#084F4A', '#0B6E67']}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.backBtn} onPress={() => router.back()} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>Support & legal</Text>
            <Text style={styles.title}>Policies</Text>
          </View>
          <View style={styles.backSpacer} />
        </View>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.intro}>
          Transparent rules for bookings, payments, data, and refunds. Tap any document to read the full policy.
        </Text>

        {LEGAL_HUB_ITEMS.map((item) => (
          <Pressable
            key={item.id}
            style={styles.card}
            onPress={() => openLegal(item.id as LegalDocId)}
            accessibilityRole="button"
          >
            <View style={styles.cardIcon}>
              <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.primaryDark} />
            </View>
            <View style={styles.cardCopy}>
              <Text style={styles.cardLabel}>{item.label}</Text>
              <Text style={styles.cardSub}>{item.sub}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.mutedLight} />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  header: { paddingHorizontal: layout.pad, paddingBottom: spacing.xl },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backSpacer: { width: 42 },
  headerCopy: { flex: 1, alignItems: 'center', gap: 2 },
  eyebrow: { fontFamily: fonts.medium, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.white },
  scroll: { padding: layout.pad, gap: spacing.md },
  intro: { fontFamily: fonts.medium, fontSize: 13, color: colors.muted, lineHeight: 19, marginBottom: spacing.xs },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xxl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.lg,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardCopy: { flex: 1, gap: 2 },
  cardLabel: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  cardSub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted },
});

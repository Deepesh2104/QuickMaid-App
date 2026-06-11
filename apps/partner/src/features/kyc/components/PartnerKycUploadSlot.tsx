import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, shadow, spacing } from '@/theme/spacing';

interface PartnerKycUploadSlotProps {
  title: string;
  hint: string;
  icon: 'card-outline' | 'id-card-outline' | 'person-circle-outline' | 'document-text-outline';
  uri?: string;
  loading?: boolean;
  onPick: () => void;
  onPreview?: () => void;
  onClear?: () => void;
}

export function PartnerKycUploadSlot({
  title,
  hint,
  icon,
  uri,
  loading,
  onPick,
  onPreview,
  onClear,
}: PartnerKycUploadSlotProps) {
  const filled = Boolean(uri);

  return (
    <Pressable
      style={[styles.card, filled && styles.cardFilled]}
      onPress={() => {
        if (loading) return;
        Haptics.selectionAsync();
        if (filled && onPreview) onPreview();
        else onPick();
      }}
    >
      {filled && uri ? (
        <>
          <Image source={{ uri }} style={styles.preview} resizeMode="cover" />
          <LinearGradient colors={['transparent', 'rgba(3,42,40,0.75)']} style={styles.previewFade} />
          <View style={styles.previewBadge}>
            <Ionicons name="checkmark-circle" size={14} color={colors.success} />
            <Text style={styles.previewBadgeText}>Uploaded</Text>
          </View>
          <View style={styles.filledActions}>
            {onPreview ? (
              <Pressable
                style={styles.actionBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  Haptics.selectionAsync();
                  onPreview();
                }}
                hitSlop={6}
              >
                <Ionicons name="expand-outline" size={16} color={colors.white} />
              </Pressable>
            ) : null}
            <Pressable
              style={styles.actionBtn}
              onPress={(e) => {
                e.stopPropagation?.();
                Haptics.selectionAsync();
                onPick();
              }}
              hitSlop={6}
            >
              <Ionicons name="camera-outline" size={16} color={colors.white} />
            </Pressable>
            {onClear ? (
              <Pressable
                style={styles.actionBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  Haptics.selectionAsync();
                  onClear();
                }}
                hitSlop={6}
              >
                <Ionicons name="trash-outline" size={16} color={colors.white} />
              </Pressable>
            ) : null}
          </View>
        </>
      ) : (
        <View style={styles.empty}>
          <View style={styles.iconWrap}>
            {loading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <Ionicons name={icon} size={22} color={colors.primary} />
            )}
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.hint}>{hint}</Text>
          <View style={styles.tapPill}>
            <Ionicons name="camera-outline" size={12} color={colors.primaryDark} />
            <Text style={styles.tapText}>Tap to upload</Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 148,
    borderRadius: radius.xl,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: 'rgba(11,110,103,0.16)',
    borderStyle: 'dashed',
    overflow: 'hidden',
    ...shadow.sm,
  },
  cardFilled: {
    borderStyle: 'solid',
    borderColor: 'rgba(16,185,129,0.35)',
    minHeight: 160,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
    gap: spacing.xs,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 15,
    maxWidth: 220,
  },
  tapPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryLight,
  },
  tapText: { fontFamily: fonts.semiBold, fontSize: 11, color: colors.primaryDark },
  preview: { ...StyleSheet.absoluteFill },
  previewFade: { ...StyleSheet.absoluteFill },
  previewBadge: {
    position: 'absolute',
    left: spacing.sm,
    bottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  previewBadgeText: { fontFamily: fonts.bold, fontSize: 10, color: colors.success },
  filledActions: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

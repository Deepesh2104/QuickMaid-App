import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

import { LinearGradient } from 'expo-linear-gradient';

import { type Href, useRouter } from 'expo-router';

import { Pressable, StyleSheet, Text, View } from 'react-native';



import { PartnerOfflineEmpty, PartnerWaitingEmpty } from '@/features/home/components/PartnerHomeSections';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { radius, spacing } from '@/theme/spacing';



interface PartnerRequestsPreviewProps {

  queueCount: number;

  scheduledCount: number;

  isOnline: boolean;

  autoAssign?: boolean;

  zone?: string;

  slotsMismatch?: boolean;

}



export function PartnerRequestsPreview({

  queueCount,

  scheduledCount,

  isOnline,

  autoAssign = true,

  zone,

  slotsMismatch,

}: PartnerRequestsPreviewProps) {

  const router = useRouter();



  const openSchedule = () => {

    Haptics.selectionAsync();

    router.push('/(tabs)/schedule' as Href);

  };



  return (

    <View style={styles.wrap}>

      <View style={styles.head}>

        <View style={styles.titleRow}>

          <View style={styles.headIcon}>

            <Ionicons name="flash" size={14} color={colors.partnerGold} />

          </View>

          <View>

            <Text style={styles.eyebrow}>AUTO DISPATCH</Text>

            <Text style={styles.title}>

              {autoAssign ? 'Seedha Schedule confirm' : 'Incoming offers'}

            </Text>

          </View>

          {scheduledCount > 0 ? (

            <View style={styles.badge}>

              <Text style={styles.badgeText}>{scheduledCount}</Text>

            </View>

          ) : null}

        </View>

        {scheduledCount > 0 ? (

          <Pressable style={styles.viewAllBtn} onPress={openSchedule} hitSlop={8} accessibilityRole="button">

            <Text style={styles.viewAll}>Schedule</Text>

            <Ionicons name="chevron-forward" size={12} color={colors.primaryDark} />

          </Pressable>

        ) : null}

      </View>



      {!isOnline ? (

        <PartnerOfflineEmpty />

      ) : queueCount === 0 && scheduledCount === 0 ? (

        <View style={styles.waitingWrap}>

          <PartnerWaitingEmpty zone={zone} />

          {slotsMismatch ? (

            <Text style={styles.slotHint}>

              Jobs available hain par aapke active slots se match nahi — Slots screen se update karo.

            </Text>

          ) : null}

        </View>

      ) : (

        <Pressable style={styles.statusCard} onPress={openSchedule} accessibilityRole="button">

          <LinearGradient colors={['#E6F4F2', colors.white]} style={StyleSheet.absoluteFill} />

          <View style={styles.statusIcon}>

            <Ionicons name="calendar" size={18} color={colors.primary} />

          </View>

          <View style={styles.statusCopy}>

            <Text style={styles.statusTitle}>

              {scheduledCount > 0

                ? `${scheduledCount} visit${scheduledCount === 1 ? '' : 's'} on Schedule`

                : 'Waiting for next free slot'}

            </Text>

            <Text style={styles.statusSub}>

              {autoAssign

                ? queueCount > 0

                  ? `${queueCount} matching · confirm hote hi Schedule tab par dikhegi`

                  : 'Requests tab nahi — auto jobs seedha Schedule par confirm hoti hain'

                : 'Manual accept mode — Schedule tab check karein'}

            </Text>

          </View>

          <Ionicons name="chevron-forward" size={16} color={colors.mutedLight} />

        </Pressable>

      )}

    </View>

  );

}



const styles = StyleSheet.create({

  wrap: { marginTop: spacing.lg, gap: spacing.sm },

  head: {

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent: 'space-between',

  },

  titleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },

  headIcon: {

    width: 32,

    height: 32,

    borderRadius: 16,

    backgroundColor: colors.partnerGoldBg,

    alignItems: 'center',

    justifyContent: 'center',

  },

  eyebrow: {

    fontFamily: fonts.bold,

    fontSize: 9,

    color: colors.partnerGold,

    letterSpacing: 0.8,

  },

  title: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.ink, letterSpacing: -0.2 },

  badge: {

    minWidth: 20,

    height: 20,

    borderRadius: 10,

    backgroundColor: colors.partnerGold,

    alignItems: 'center',

    justifyContent: 'center',

    paddingHorizontal: 6,

    marginLeft: 4,

  },

  badgeText: { fontFamily: fonts.bold, fontSize: 10, color: colors.white },

  viewAllBtn: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 2,

    backgroundColor: colors.primaryLight,

    paddingHorizontal: 10,

    paddingVertical: 7,

    borderRadius: radius.pill,

  },

  viewAll: { fontFamily: fonts.bold, fontSize: 11, color: colors.primaryDark },

  waitingWrap: { gap: spacing.sm },

  slotHint: {

    fontFamily: fonts.medium,

    fontSize: 11,

    color: colors.warning,

    textAlign: 'center',

    lineHeight: 16,

    paddingHorizontal: spacing.md,

  },

  statusCard: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.md,

    padding: spacing.md,

    borderRadius: radius.xl,

    borderWidth: 1,

    borderColor: 'rgba(11,110,103,0.1)',

    overflow: 'hidden',

  },

  statusIcon: {

    width: 40,

    height: 40,

    borderRadius: 20,

    backgroundColor: colors.primaryLight,

    alignItems: 'center',

    justifyContent: 'center',

  },

  statusCopy: { flex: 1, gap: 3 },

  statusTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },

  statusSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },

});



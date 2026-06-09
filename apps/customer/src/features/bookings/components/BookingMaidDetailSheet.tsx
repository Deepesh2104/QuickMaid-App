import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { BookingStatus } from '@/constants/demo';
import { ProProfileBody } from '@/features/pro/components/ProProfileBody';
import type { MaidProfileDetail } from '../lib/maid.profile';
import { radius, spacing } from '@/theme/spacing';

interface BookingMaidDetailSheetProps {
  visible: boolean;
  maid: MaidProfileDetail;
  bookingStatus: BookingStatus;
  onClose: () => void;
  onMessage?: () => void;
  onTrack?: () => void;
}

export function BookingMaidDetailSheet({
  visible,
  maid,
  bookingStatus,
  onClose,
  onMessage,
  onTrack,
}: BookingMaidDetailSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={[styles.sheet, { maxHeight: '94%', paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <View style={styles.handle} />
        <ProProfileBody
          maid={maid}
          mode="sheet"
          onClose={onClose}
          bookingStatus={bookingStatus}
          onMessage={
            onMessage
              ? () => {
                  onMessage();
                  onClose();
                }
              : undefined
          }
          onTrack={
            onTrack
              ? () => {
                  onTrack();
                  onClose();
                }
              : undefined
          }
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(1,15,14,0.62)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#F4F6F8',
    borderTopLeftRadius: radius.xxl + 8,
    borderTopRightRadius: radius.xxl + 8,
    overflow: 'hidden',
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(15,20,25,0.12)',
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
    zIndex: 10,
  },
});

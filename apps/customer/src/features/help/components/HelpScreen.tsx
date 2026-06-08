import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SUPPORT_CONTACT } from '@/constants/demo';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

import { HelpBody } from './HelpBody';
import { HelpChatWindow } from './HelpChatWindow';
import { HelpHeader } from './HelpHeader';

export function HelpScreen() {
  const insets = useSafeAreaInsets();
  const { chat, topic } = useLocalSearchParams<{ chat?: string; topic?: string }>();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTopic, setChatTopic] = useState<string | undefined>();

  const openChat = (nextTopic?: string) => {
    setChatTopic(nextTopic);
    setChatOpen(true);
  };

  useEffect(() => {
    if (chat === '1') {
      openChat(topic || undefined);
    }
  }, [chat, topic]);

  return (
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <HelpHeader paddingTop={insets.top} />

        <View style={styles.canvas}>
          <View style={styles.sheetBridge} pointerEvents="none" />
          <View style={[styles.lowerSheet, { paddingBottom: insets.bottom + spacing.md }]}>
            <View style={styles.sheetHandle} />
            <HelpBody onOpenChat={openChat} />

            <View style={styles.footer}>
              <Text style={styles.footerBrand}>QuickMaid Help</Text>
              <Text style={styles.footerSub}>
                {SUPPORT_CONTACT.phone} · {SUPPORT_CONTACT.email}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <HelpChatWindow
        visible={chatOpen}
        topic={chatTopic}
        onClose={() => setChatOpen(false)}
      />
    </View>
  );
}

const SHEET_OVERLAP = 18;
const HEADER_TAIL = '#0F1419';

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.bg },
  scroll: { paddingBottom: 0 },
  canvas: {
    backgroundColor: colors.bg,
    marginTop: -SHEET_OVERLAP,
    paddingTop: SHEET_OVERLAP,
  },
  sheetBridge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: SHEET_OVERLAP + radius.xxl + 8,
    backgroundColor: HEADER_TAIL,
    zIndex: 0,
  },
  lowerSheet: {
    backgroundColor: colors.bg,
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    marginTop: 0,
    paddingTop: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: 0,
    borderColor: 'rgba(15,20,25,0.05)',
    zIndex: 1,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bgMuted,
    alignSelf: 'center',
    marginBottom: spacing.lg,
  },
  footer: {
    alignItems: 'center',
    gap: 4,
    marginHorizontal: layout.pad,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  footerBrand: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.muted,
    letterSpacing: 0.4,
  },
  footerSub: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: colors.mutedLight,
    textAlign: 'center',
  },
});

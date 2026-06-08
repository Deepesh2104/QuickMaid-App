import { useState } from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';



import { colors } from '@/theme/colors';

import { radius, spacing } from '@/theme/spacing';



import { PlusBody } from './PlusBody';

import { PlusHeader } from './PlusHeader';

import { PlusStickyCta } from './PlusStickyCta';



export function PlusScreen() {

  const insets = useSafeAreaInsets();

  const [selectedPlan, setSelectedPlan] = useState('plus');



  return (

    <View style={styles.root}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 100 }]}
      >

        <PlusHeader paddingTop={insets.top} />



        <View style={styles.canvas}>

          <View style={styles.sheetBridge} pointerEvents="none" />

          <View style={[styles.lowerSheet, { paddingBottom: insets.bottom + spacing.md }]}>

            <View style={styles.sheetHandle} />

            <PlusBody selectedPlan={selectedPlan} onSelectPlan={setSelectedPlan} />

          </View>

        </View>

      </ScrollView>

      <PlusStickyCta selectedPlan={selectedPlan} />
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

});



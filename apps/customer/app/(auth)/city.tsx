import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AuthScreenLayout } from '../../src/components/ui/AuthScreenLayout';
import { QmButton } from '../../src/components/ui/QmButton';
import { SearchBar } from '../../src/components/ui/SearchBar';
import { CITIES } from '../../src/constants/cities';
import { useAuthFlow } from '../../src/context/AuthFlowContext';
import { colors } from '../../src/theme/colors';
import { radius, shadow, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

export default function CityScreen() {
  const router = useRouter();
  const { city, setCity } = useAuthFlow();
  const selected = CITIES.find((c) => c.name === city) ?? CITIES[0];

  return (
    <AuthScreenLayout
      step={1}
      heroTitle="Choose city"
      heroSub="QuickMaid is live in Raipur. More cities coming soon."
      heroBadge={
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>Now serving Raipur</Text>
        </View>
      }
      formTitle="Select your city"
      formSubtitle="Services and pricing vary by location."
      footer={
        <QmButton
          label="Continue"
          icon="arrow-forward"
          onPress={() => router.push('/(auth)/login')}
          disabled={!selected.live}
        />
      }
    >
      <View style={styles.search}>
        <SearchBar placeholder="Search city" />
      </View>

      {CITIES.map((item) => {
        const isSelected = item.name === city;
        const disabled = !item.live;

        return (
          <Pressable
            key={item.id}
            disabled={disabled}
            onPress={() => setCity(item.name)}
            style={[
              styles.cityCard,
              isSelected && styles.cityCardOn,
              disabled && styles.cityCardOff,
            ]}
          >
            <View style={styles.cityLeft}>
              <Text style={[styles.cityName, isSelected && styles.cityNameOn]}>{item.name}</Text>
              <Text style={styles.state}>{item.state}</Text>
            </View>
            {item.tag && (
              <Text style={[styles.tag, item.live ? styles.tagLive : styles.tagSoon]}>
                {item.tag}
              </Text>
            )}
            <View style={[styles.radio, isSelected && styles.radioOn]}>
              {isSelected && <View style={styles.radioDot} />}
            </View>
          </Pressable>
        );
      })}
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: spacing.md,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4ADE80',
  },
  liveText: {
    ...type.bodySm,
    color: colors.white,
    fontWeight: '600',
  },
  search: {
    marginBottom: spacing.lg,
    marginTop: -spacing.md,
  },
  cityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
    gap: spacing.md,
  },
  cityCardOn: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
    ...shadow.sm,
  },
  cityCardOff: { opacity: 0.5 },
  cityLeft: { flex: 1 },
  cityName: {
    ...type.body,
    fontWeight: '600',
    color: colors.ink,
  },
  cityNameOn: { color: colors.primaryDark },
  state: {
    ...type.caption,
    color: colors.muted,
    marginTop: 2,
  },
  tag: { ...type.overline, fontSize: 9 },
  tagLive: { color: colors.success },
  tagSoon: { color: colors.muted },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: { borderColor: colors.primary },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});

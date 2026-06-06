import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ReactNode, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { AuthScreenLayout } from '../../src/components/ui/AuthScreenLayout';
import { ChoiceChips } from '../../src/components/ui/ChoiceChips';
import { QmButton } from '../../src/components/ui/QmButton';
import { QmInput } from '../../src/components/ui/QmInput';
import { useAuthFlow } from '../../src/context/AuthFlowContext';
import { colors } from '../../src/theme/colors';
import { radius, spacing } from '../../src/theme/spacing';
import { type } from '../../src/theme/typography';

const GENDER_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
  { value: 'other', label: 'Other' },
  { value: 'skip', label: 'Prefer not to say' },
];

const HOME_OPTIONS = [
  { value: '1bhk', label: '1 BHK' },
  { value: '2bhk', label: '2 BHK' },
  { value: '3bhk', label: '3 BHK+' },
  { value: 'villa', label: 'Villa' },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function FormSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export default function SignupScreen() {
  const router = useRouter();
  const {
    city,
    name,
    email,
    gender,
    homeType,
    locality,
    setName,
    setEmail,
    setGender,
    setHomeType,
    setLocality,
  } = useAuthFlow();
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');

  const filledCount = useMemo(() => {
    let n = 0;
    if (name.trim().length >= 2) n += 1;
    if (email.trim() && EMAIL_RE.test(email.trim())) n += 1;
    if (homeType) n += 1;
    if (locality.trim().length >= 3) n += 1;
    if (gender) n += 1;
    return n;
  }, [name, email, homeType, locality, gender]);

  const progress = Math.round((filledCount / 5) * 100);
  const isValid = name.trim().length >= 2 && (!email.trim() || EMAIL_RE.test(email.trim()));

  const continueNext = () => {
    if (name.trim().length < 2) {
      setNameError('Please enter your full name (min. 2 characters)');
      return;
    }
    if (email.trim() && !EMAIL_RE.test(email.trim())) {
      setEmailError('Enter a valid email address');
      return;
    }
    setNameError('');
    setEmailError('');
    router.push('/(auth)/permissions');
  };

  return (
    <AuthScreenLayout
      step={4}
      heroTitle="Your profile"
      heroSub="One last step"
      formTitle="Complete your profile"
      formSubtitle="Add your details for faster bookings."
      footer={
        <QmButton
          label="Continue"
          icon="arrow-forward"
          onPress={continueNext}
          disabled={!isValid}
        />
      }
    >
      <View style={styles.cityRow}>
        <Ionicons name="location" size={14} color={colors.primary} />
        <Text style={styles.cityText}>Serving in {city}</Text>
      </View>

      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Profile completion</Text>
          <Text style={styles.progressPct}>{progress}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${Math.max(progress, 8)}%` }]} />
        </View>
      </View>

      <FormSection title="Personal details">
        <QmInput
          label="Full name *"
          placeholder="e.g. Priya Sharma"
          value={name}
          onChangeText={(t) => {
            setName(t);
            if (nameError) setNameError('');
          }}
          autoCapitalize="words"
          error={nameError}
        />
        <QmInput
          label="Email address"
          placeholder="you@email.com"
          value={email}
          onChangeText={(t) => {
            setEmail(t);
            if (emailError) setEmailError('');
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          error={emailError}
          hint="For receipts and booking updates"
        />
        <ChoiceChips
          label="Gender"
          optional
          options={GENDER_OPTIONS}
          value={gender}
          onChange={setGender}
        />
      </FormSection>

      <FormSection title="Home details">
        <ChoiceChips
          label="Home type"
          options={HOME_OPTIONS}
          value={homeType}
          onChange={setHomeType}
          hint="Pricing depends on home size"
        />
        <QmInput
          label="Society / locality"
          placeholder="e.g. Shankar Nagar, Civil Lines"
          value={locality}
          onChangeText={setLocality}
          autoCapitalize="words"
          hint="Faster address entry on first booking"
        />
      </FormSection>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  cityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: spacing.lg,
    marginTop: -spacing.sm,
  },
  cityText: {
    ...type.bodySm,
    color: colors.primaryDark,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressLabel: {
    ...type.bodySm,
    color: colors.inkSecondary,
    fontWeight: '600',
  },
  progressPct: {
    ...type.bodySm,
    color: colors.primary,
    fontWeight: '700',
  },
  progressTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    ...type.bodySm,
    color: colors.muted,
    fontWeight: '600',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  },
});

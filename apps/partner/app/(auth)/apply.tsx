import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { type Href, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { QmButton } from '@/components/ui/QmButton';
import { PartnerDobInput } from '@/components/ui/PartnerDobInput';
import type { PartnerGender, PartnerMaritalStatus, PartnerTravelMode } from '@/constants/app';
import {
  EMERGENCY_RELATION_OPTIONS,
  EXPERIENCE_OPTIONS,
  LANGUAGE_OPTIONS,
  MARITAL_OPTIONS,
  RAIPUR_ZONES,
  SKILL_OPTIONS,
  TRAVEL_MODE_OPTIONS,
  WORK_RADIUS_OPTIONS,
} from '@/constants/demo';
import { PartnerAuthLayout } from '@/features/auth/components/PartnerAuthLayout';
import { APPLY_STATS, APPLY_STEPS } from '@/features/auth/constants/auth.premium';
import {
  DEFAULT_PREFERRED_SLOT_IDS,
  PREFERRED_SLOTS,
  type PreferredSlotId,
} from '@/features/slots/constants/slots.premium';
import { togglePreferredSlot } from '@/features/slots/lib/slots.utils';
import { useAuthFlow } from '@/context/AuthFlowContext';
import { usePartner } from '@/context/PartnerContext';
import { validateDateOfBirth } from '@/lib/quickmaid-ids';
import { completePartnerRegistration, seedProfileFromApply } from '@/lib/storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { radius, spacing } from '@/theme/spacing';

const GENDER_OPTIONS: { id: PartnerGender; label: string }[] = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'other', label: 'Other' },
];

export default function ApplyScreen() {
  const router = useRouter();
  const { phone } = useAuthFlow();
  const { refresh } = usePartner();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<PartnerGender>('female');
  const [maritalStatus, setMaritalStatus] = useState<PartnerMaritalStatus>('married');
  const [email, setEmail] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [bio, setBio] = useState('');
  const [addressLine, setAddressLine] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [zone, setZone] = useState<string>(RAIPUR_ZONES[0]);
  const [skills, setSkills] = useState<string[]>(['Cleaning']);
  const [languages, setLanguages] = useState<string[]>(['Hindi']);
  const [experienceYears, setExperienceYears] = useState('1-3');
  const [travelMode, setTravelMode] = useState<PartnerTravelMode>('bus');
  const [workRadiusKm, setWorkRadiusKm] = useState(5);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState<string>(EMERGENCY_RELATION_OPTIONS[0]);
  const [upi, setUpi] = useState('');
  const [slotIds, setSlotIds] = useState<PreferredSlotId[]>([...DEFAULT_PREFERRED_SLOT_IDS]);
  const [saving, setSaving] = useState(false);

  const formatted = phone ? `+91 ${phone.replace(/(\d{5})(\d{5})/, '$1 $2')}` : '+91 —';

  const toggleSkill = (s: string) => {
    Haptics.selectionAsync();
    setSkills((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleLanguage = (lang: string) => {
    Haptics.selectionAsync();
    setLanguages((prev) => (prev.includes(lang) ? prev.filter((x) => x !== lang) : [...prev, lang]));
  };

  const toggleSlot = (id: PreferredSlotId) => {
    Haptics.selectionAsync();
    setSlotIds((prev) => togglePreferredSlot(prev, id));
  };

  const validationError = useMemo(() => {
    if (firstName.trim().length < 2) return 'Enter first name (min 2 letters)';
    if (lastName.trim().length < 2) return 'Enter last name (min 2 letters)';
    const dobErr = validateDateOfBirth(dob);
    if (dobErr) return dobErr;
    if (addressLine.trim().length < 5) return 'Enter your complete home address';
    if (!/^\d{6}$/.test(pincode.trim())) return 'Enter valid 6-digit pincode';
    if (skills.length === 0) return 'Select at least one skill';
    if (languages.length === 0) return 'Select at least one language';
    if (!experienceYears) return 'Select your work experience';
    if (emergencyName.trim().length < 2) return 'Enter emergency contact name';
    if (!/^\d{10}$/.test(emergencyPhone.replace(/\D/g, '').slice(-10))) return 'Enter valid emergency mobile';
    if (alternatePhone.trim() && !/^\d{10}$/.test(alternatePhone.replace(/\D/g, '').slice(-10))) {
      return 'Alternate mobile must be 10 digits';
    }
    if (slotIds.length === 0) return 'Keep at least one preferred slot on';
    if (email.trim() && !email.includes('@')) return 'Enter a valid email or leave blank';
    return null;
  }, [firstName, lastName, dob, addressLine, pincode, skills, languages, experienceYears, emergencyName, emergencyPhone, alternatePhone, slotIds, email]);

  const valid = validationError == null;

  const submit = async () => {
    if (!valid) return;
    setSaving(true);
    const profile = seedProfileFromApply({
      firstName,
      lastName,
      dateOfBirth: dob.trim(),
      gender,
      maritalStatus,
      email,
      phone,
      alternatePhone: alternatePhone.replace(/\D/g, '').slice(-10) || undefined,
      zone,
      addressLine,
      landmark,
      pincode,
      skills,
      languages,
      experienceYears,
      travelMode,
      workRadiusKm,
      bio,
      emergencyContact: {
        name: emergencyName.trim(),
        phone: emergencyPhone.replace(/\D/g, '').slice(-10),
        relation: emergencyRelation,
      },
      upiId: upi,
      preferredSlotIds: slotIds,
    });
    await completePartnerRegistration(profile);
    await refresh();
    setSaving(false);
    router.replace('/kyc?welcome=1' as Href);
  };

  return (
    <PartnerAuthLayout
      eyebrow="PARTNER APPLICATION"
      title="Your complete profile"
      subtitle="Maid ID auto-generates · Booking IDs use QM-7 format"
      stats={APPLY_STATS}
      showLogo={false}
      onBack={() => router.back()}
      footer={
        <QmButton
          label="Submit application"
          icon="briefcase"
          onPress={() => void submit()}
          loading={saving}
          disabled={!valid}
        />
      }
    >
      <View style={styles.body}>
        <View style={styles.phoneChip}>
          <Ionicons name="call-outline" size={14} color={colors.primaryDark} />
          <Text style={styles.phoneText}>{formatted}</Text>
        </View>

        <View style={styles.fieldCard}>
          <Text style={styles.sectionTitle}>Personal details</Text>
          <View style={styles.nameRow}>
            <View style={styles.nameCol}>
              <Text style={styles.label}>First name *</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Sunita"
                placeholderTextColor={colors.placeholder}
                autoCapitalize="words"
              />
            </View>
            <View style={styles.nameCol}>
              <Text style={styles.label}>Last name *</Text>
              <TextInput
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Verma"
                placeholderTextColor={colors.placeholder}
                autoCapitalize="words"
              />
            </View>
          </View>
          <Text style={styles.label}>Date of birth *</Text>
          <PartnerDobInput value={dob} onChangeText={setDob} inputStyle={styles.input} />
          <Text style={styles.hint}>Type 28 → auto / → month → year · or tap calendar</Text>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.chips}>
            {GENDER_OPTIONS.map((g) => {
              const on = gender === g.id;
              return (
                <Pressable
                  key={g.id}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setGender(g.id);
                  }}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{g.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.label}>Marital status</Text>
          <View style={styles.chips}>
            {MARITAL_OPTIONS.map((m) => {
              const on = maritalStatus === m.id;
              return (
                <Pressable
                  key={m.id}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => { Haptics.selectionAsync(); setMaritalStatus(m.id); }}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{m.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.label}>Email (optional)</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="name@email.com"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Text style={styles.label}>Alternate mobile (optional)</Text>
          <TextInput
            style={styles.input}
            value={alternatePhone}
            onChangeText={(t) => setAlternatePhone(t.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit number"
            placeholderTextColor={colors.placeholder}
            keyboardType="number-pad"
            maxLength={10}
          />
          <Text style={styles.label}>Short bio (optional)</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={bio}
            onChangeText={setBio}
            placeholder="e.g. 5 yrs experience · punctual & trusted"
            placeholderTextColor={colors.placeholder}
            multiline
            maxLength={120}
          />
        </View>

        <View style={styles.fieldCard}>
          <Text style={styles.sectionTitle}>Home & work zone</Text>
          <Text style={styles.label}>Full home address *</Text>
          <TextInput
            style={[styles.input, styles.inputMulti]}
            value={addressLine}
            onChangeText={setAddressLine}
            placeholder="Flat / house, street, landmark"
            placeholderTextColor={colors.placeholder}
            multiline
          />
          <Text style={styles.label}>Landmark</Text>
          <TextInput
            style={styles.input}
            value={landmark}
            onChangeText={setLandmark}
            placeholder="Near City Mall, main road…"
            placeholderTextColor={colors.placeholder}
          />
          <Text style={styles.label}>Pincode *</Text>
          <TextInput
            style={styles.input}
            value={pincode}
            onChangeText={(t) => setPincode(t.replace(/\D/g, '').slice(0, 6))}
            placeholder="492001"
            placeholderTextColor={colors.placeholder}
            keyboardType="number-pad"
            maxLength={6}
          />
          <Text style={styles.label}>Primary work zone *</Text>
          <View style={styles.chips}>
            {RAIPUR_ZONES.map((z) => {
              const on = zone === z;
              return (
                <Pressable
                  key={z}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setZone(z);
                  }}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{z}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldCard}>
          <Text style={styles.sectionTitle}>Work profile</Text>
          <Text style={styles.label}>Skills *</Text>
          <View style={styles.chips}>
            {SKILL_OPTIONS.map((s) => {
              const on = skills.includes(s);
              return (
                <Pressable
                  key={s}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => toggleSkill(s)}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{s}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.label}>Languages *</Text>
          <View style={styles.chips}>
            {LANGUAGE_OPTIONS.map((lang) => {
              const on = languages.includes(lang);
              return (
                <Pressable
                  key={lang}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => toggleLanguage(lang)}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{lang}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.label}>Experience *</Text>
          <View style={styles.chips}>
            {EXPERIENCE_OPTIONS.map((exp) => {
              const on = experienceYears === exp.id;
              return (
                <Pressable
                  key={exp.id}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => { Haptics.selectionAsync(); setExperienceYears(exp.id); }}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{exp.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.label}>How you travel to jobs</Text>
          <View style={styles.chips}>
            {TRAVEL_MODE_OPTIONS.map((t) => {
              const on = travelMode === t.id;
              return (
                <Pressable
                  key={t.id}
                  style={[styles.chip, styles.chipRow, on && styles.chipOn]}
                  onPress={() => { Haptics.selectionAsync(); setTravelMode(t.id); }}
                >
                  <Ionicons name={t.icon} size={12} color={on ? colors.primaryDark : colors.muted} />
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{t.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={styles.label}>Max work radius</Text>
          <View style={styles.chips}>
            {WORK_RADIUS_OPTIONS.map((km) => {
              const on = workRadiusKm === km;
              return (
                <Pressable
                  key={km}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => { Haptics.selectionAsync(); setWorkRadiusKm(km); }}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{km} km</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldCard}>
          <Text style={styles.sectionTitle}>Emergency contact *</Text>
          <Text style={styles.hint}>Required for your safety on field visits</Text>
          <Text style={styles.label}>Contact name *</Text>
          <TextInput
            style={styles.input}
            value={emergencyName}
            onChangeText={setEmergencyName}
            placeholder="Full name"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="words"
          />
          <Text style={styles.label}>Mobile *</Text>
          <TextInput
            style={styles.input}
            value={emergencyPhone}
            onChangeText={(t) => setEmergencyPhone(t.replace(/\D/g, '').slice(0, 10))}
            placeholder="10-digit number"
            placeholderTextColor={colors.placeholder}
            keyboardType="number-pad"
            maxLength={10}
          />
          <Text style={styles.label}>Relation *</Text>
          <View style={styles.chips}>
            {EMERGENCY_RELATION_OPTIONS.map((rel) => {
              const on = emergencyRelation === rel;
              return (
                <Pressable
                  key={rel}
                  style={[styles.chip, on && styles.chipOn]}
                  onPress={() => { Haptics.selectionAsync(); setEmergencyRelation(rel); }}
                >
                  <Text style={[styles.chipText, on && styles.chipTextOn]}>{rel}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldCard}>
          <Text style={styles.label}>Preferred slots *</Text>
          <Text style={styles.hint}>Jobs only match your active time windows</Text>
          <View style={styles.slotList}>
            {PREFERRED_SLOTS.map((slot) => {
              const on = slotIds.includes(slot.id);
              return (
                <Pressable
                  key={slot.id}
                  style={[styles.slotChip, on && styles.slotChipOn]}
                  onPress={() => toggleSlot(slot.id)}
                >
                  <Ionicons
                    name={slot.icon}
                    size={14}
                    color={on ? colors.primaryDark : colors.muted}
                  />
                  <View style={styles.slotChipCopy}>
                    <Text style={[styles.slotChipLabel, on && styles.slotChipLabelOn]}>{slot.label}</Text>
                    <Text style={styles.slotChipSub}>{slot.sub}</Text>
                  </View>
                  <Text style={[styles.slotChipState, on && styles.slotChipStateOn]}>{on ? 'On' : 'Off'}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.fieldCard}>
          <Text style={styles.label}>UPI for payouts</Text>
          <TextInput
            style={styles.input}
            value={upi}
            onChangeText={setUpi}
            placeholder="name@upi"
            placeholderTextColor={colors.placeholder}
            autoCapitalize="none"
          />
          <Text style={styles.hint}>Add now or later from Profile — needed before first Monday payout</Text>
        </View>

        <View style={styles.idPreview}>
          <Ionicons name="id-card-outline" size={16} color={colors.primary} />
          <Text style={styles.idPreviewText}>
            Maid ID format: MD-{'{6-digit timestamp}'} — unique, generated on submit
          </Text>
        </View>

        <View style={styles.stepsCard}>
          {APPLY_STEPS.map((step, index) => (
            <View key={step.title}>
              {index > 0 ? <View style={styles.stepDivider} /> : null}
              <View style={styles.stepRow}>
                <View style={styles.stepIcon}>
                  <Ionicons name={step.icon} size={14} color={colors.primaryDark} />
                </View>
                <View style={styles.stepCopy}>
                  <Text style={styles.stepTitle}>{step.title}</Text>
                  <Text style={styles.stepSub}>{step.sub}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
    </PartnerAuthLayout>
  );
}

const styles = StyleSheet.create({
  body: { gap: spacing.md },
  phoneChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  phoneText: { fontFamily: fonts.bold, fontSize: 12, color: colors.primaryDark },
  fieldCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
  },
  sectionTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: spacing.xs,
  },
  nameRow: { flexDirection: 'row', gap: spacing.sm },
  nameCol: { flex: 1, gap: spacing.xs },
  label: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  input: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    backgroundColor: colors.bgSubtle,
  },
  inputMulti: { minHeight: 72, textAlignVertical: 'top' },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 15,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  chipText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  chipTextOn: { color: colors.primaryDark },
  slotList: { gap: spacing.sm },
  slotChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.bgSubtle,
    borderWidth: 1,
    borderColor: colors.border,
  },
  slotChipOn: {
    backgroundColor: colors.primaryLight,
    borderColor: 'rgba(11,110,103,0.25)',
  },
  slotChipCopy: { flex: 1, gap: 1, minWidth: 0 },
  slotChipLabel: { fontFamily: fonts.bold, fontSize: 12, color: colors.muted },
  slotChipLabelOn: { color: colors.ink },
  slotChipSub: { fontFamily: fonts.regular, fontSize: 10, color: colors.muted },
  slotChipState: { fontFamily: fonts.bold, fontSize: 10, color: colors.muted },
  slotChipStateOn: { color: colors.success },
  idPreview: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    backgroundColor: colors.primaryLight,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(11,110,103,0.14)',
  },
  idPreviewText: {
    flex: 1,
    fontFamily: fonts.medium,
    fontSize: 11,
    color: colors.primaryDark,
    lineHeight: 16,
  },
  stepsCard: {
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.06)',
    marginTop: spacing.xs,
  },
  stepRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm },
  stepIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCopy: { flex: 1, gap: 2 },
  stepTitle: { fontFamily: fonts.bold, fontSize: 13, color: colors.ink },
  stepSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted, lineHeight: 15 },
  stepDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.sm,
  },
});

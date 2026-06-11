import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PartnerDobInput } from '@/components/ui/PartnerDobInput';
import type { PartnerGender, PartnerMaritalStatus, PartnerProfile, PartnerTravelMode } from '@/constants/app';
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
import {
  normalizePhoneDigits,
  type PartnerProfileEditPatch,
  validateProfileEdit,
} from '@/features/profile/lib/profile.utils';
import { fullNameFromParts, resolveDateOfBirth } from '@/lib/quickmaid-ids';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

interface PartnerEditProfileModalProps {
  visible: boolean;
  profile: PartnerProfile | null;
  onClose: () => void;
  onSave: (patch: PartnerProfileEditPatch) => void;
}

function FormSection({
  icon,
  title,
  hint,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHead}>
        <View style={styles.sectionIcon}>
          <Ionicons name={icon} size={16} color={colors.primary} />
        </View>
        <View style={styles.sectionCopy}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <Text style={styles.sectionHint}>{hint}</Text>
        </View>
      </View>
      {children}
    </View>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.readOnlyWrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>{value}</Text>
        <Ionicons name="lock-closed-outline" size={12} color={colors.mutedLight} />
      </View>
    </View>
  );
}

export function PartnerEditProfileModal({
  visible,
  profile,
  onClose,
  onSave,
}: PartnerEditProfileModalProps) {
  const insets = useSafeAreaInsets();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Raipur');
  const [zone, setZone] = useState<string>(RAIPUR_ZONES[0]);
  const [skills, setSkills] = useState<string[]>([]);
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState<PartnerGender>('female');
  const [maritalStatus, setMaritalStatus] = useState<PartnerMaritalStatus>('married');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [bio, setBio] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [experienceYears, setExperienceYears] = useState('');
  const [travelMode, setTravelMode] = useState<PartnerTravelMode>('bus');
  const [workRadiusKm, setWorkRadiusKm] = useState(5);
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [emergencyRelation, setEmergencyRelation] = useState<string>(EMERGENCY_RELATION_OPTIONS[0]);
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (visible && profile) {
      setFirstName(profile.firstName ?? profile.name.split(/\s+/)[0] ?? '');
      setLastName(profile.lastName ?? profile.name.split(/\s+/).slice(1).join(' ') ?? '');
      setDateOfBirth(resolveDateOfBirth(profile.dateOfBirth, profile.publicId) ?? '');
      setGender(profile.gender ?? 'female');
      setMaritalStatus(profile.maritalStatus ?? 'married');
      setPhone(normalizePhoneDigits(profile.phone));
      setAlternatePhone(normalizePhoneDigits(profile.alternatePhone));
      setEmail(profile.email ?? '');
      setBio(profile.bio ?? '');
      setCity(profile.city || 'Raipur');
      setZone(profile.zone);
      setSkills(profile.skills ?? []);
      setLanguages(profile.languages ?? ['Hindi']);
      setExperienceYears(profile.experienceYears ?? '');
      setTravelMode(profile.travelMode ?? 'bus');
      setWorkRadiusKm(profile.workRadiusKm ?? 5);
      setEmergencyName(profile.emergencyContact?.name ?? '');
      setEmergencyPhone(normalizePhoneDigits(profile.emergencyContact?.phone));
      setEmergencyRelation(profile.emergencyContact?.relation ?? EMERGENCY_RELATION_OPTIONS[0]);
      setUpiId(profile.upiId ?? '');
      setError(null);
    }
  }, [visible, profile]);

  const toggleSkill = (skill: string) => {
    Haptics.selectionAsync();
    setSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const toggleLanguage = (lang: string) => {
    Haptics.selectionAsync();
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang],
    );
  };

  const validationError = useMemo(
    () => validateProfileEdit({
      firstName,
      lastName,
      dateOfBirth,
      phone,
      alternatePhone,
      city,
      skills,
      languages,
      experienceYears,
      emergencyName,
      emergencyPhone,
      upiId,
      email,
    }),
    [firstName, lastName, dateOfBirth, phone, alternatePhone, city, skills, languages, experienceYears, emergencyName, emergencyPhone, upiId, email],
  );

  const valid = !validationError;

  const save = () => {
    const err = validateProfileEdit({
      firstName,
      lastName,
      dateOfBirth,
      phone,
      alternatePhone,
      city,
      skills,
      languages,
      experienceYears,
      emergencyName,
      emergencyPhone,
      upiId,
      email,
    });
    if (err) {
      setError(err);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      name: fullNameFromParts(firstName, lastName),
      dateOfBirth: dateOfBirth.trim(),
      gender,
      maritalStatus,
      phone: normalizePhoneDigits(phone),
      alternatePhone: normalizePhoneDigits(alternatePhone) || undefined,
      email: email.trim() || undefined,
      bio: bio.trim() || undefined,
      city: city.trim(),
      zone,
      skills,
      languages,
      experienceYears,
      travelMode,
      workRadiusKm,
      emergencyContact: {
        name: emergencyName.trim(),
        phone: normalizePhoneDigits(emergencyPhone),
        relation: emergencyRelation,
      },
      upiId: upiId.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.wrap}
        pointerEvents="box-none"
      >
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Edit profile</Text>
          <Text style={styles.sub}>Maid ID updates when you change name or DOB · registration time stays the same</Text>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
            <FormSection icon="id-card-outline" title="Maid ID" hint="Auto-updates from your name & date of birth">
              <ReadOnlyField label="Maid ID" value={profile?.publicId ?? '—'} />
            </FormSection>

            <FormSection icon="person-outline" title="Identity" hint="Name, DOB & login mobile">
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
              <PartnerDobInput
                value={dateOfBirth}
                onChangeText={setDateOfBirth}
                inputStyle={styles.input}
              />
              <Text style={styles.fieldHint}>28 → / → month → / → year · or tap calendar icon</Text>

              <Text style={styles.label}>Mobile number *</Text>
              <View style={styles.phoneRow}>
                <View style={styles.phonePrefix}>
                  <Text style={styles.phonePrefixText}>+91</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.phoneInput]}
                  value={phone}
                  onChangeText={(t) => setPhone(normalizePhoneDigits(t).slice(0, 10))}
                  placeholder="10-digit number"
                  placeholderTextColor={colors.placeholder}
                  keyboardType="number-pad"
                  maxLength={10}
                />
              </View>

              <Text style={styles.label}>Gender</Text>
              <View style={styles.chips}>
                {(['female', 'male', 'other'] as PartnerGender[]).map((g) => {
                  const on = gender === g;
                  const label = g === 'female' ? 'Female' : g === 'male' ? 'Male' : 'Other';
                  return (
                    <Pressable key={g} style={[styles.chip, on && styles.chipOn]} onPress={() => { Haptics.selectionAsync(); setGender(g); }}>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>{label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.label}>Marital status</Text>
              <View style={styles.chips}>
                {MARITAL_OPTIONS.map((m) => {
                  const on = maritalStatus === m.id;
                  return (
                    <Pressable key={m.id} style={[styles.chip, on && styles.chipOn]} onPress={() => { Haptics.selectionAsync(); setMaritalStatus(m.id); }}>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>{m.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="name@email.com"
                placeholderTextColor={colors.placeholder}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <Text style={styles.label}>Alternate mobile</Text>
              <TextInput
                style={styles.input}
                value={alternatePhone}
                onChangeText={(t) => setAlternatePhone(normalizePhoneDigits(t).slice(0, 10))}
                placeholder="10-digit number"
                placeholderTextColor={colors.placeholder}
                keyboardType="number-pad"
                maxLength={10}
              />
              <Text style={styles.label}>Bio</Text>
              <TextInput
                style={[styles.input, styles.inputMulti]}
                value={bio}
                onChangeText={setBio}
                placeholder="Short intro for customers"
                placeholderTextColor={colors.placeholder}
                multiline
                maxLength={120}
              />
            </FormSection>

            <FormSection icon="alert-circle-outline" title="Emergency contact" hint="Required for field safety">
              <Text style={styles.label}>Name *</Text>
              <TextInput style={styles.input} value={emergencyName} onChangeText={setEmergencyName} placeholder="Contact name" placeholderTextColor={colors.placeholder} autoCapitalize="words" />
              <Text style={styles.label}>Mobile *</Text>
              <TextInput style={styles.input} value={emergencyPhone} onChangeText={(t) => setEmergencyPhone(normalizePhoneDigits(t).slice(0, 10))} placeholder="10-digit" placeholderTextColor={colors.placeholder} keyboardType="number-pad" maxLength={10} />
              <Text style={styles.label}>Relation *</Text>
              <View style={styles.chips}>
                {EMERGENCY_RELATION_OPTIONS.map((rel) => {
                  const on = emergencyRelation === rel;
                  return (
                    <Pressable key={rel} style={[styles.chip, on && styles.chipOn]} onPress={() => { Haptics.selectionAsync(); setEmergencyRelation(rel); }}>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>{rel}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </FormSection>

            <FormSection icon="location-outline" title="Location" hint="City & primary dispatch zone">
              <Text style={styles.label}>City *</Text>
              <TextInput
                style={styles.input}
                value={city}
                onChangeText={setCity}
                placeholder="e.g. Raipur"
                placeholderTextColor={colors.placeholder}
              />

              <Text style={styles.label}>Primary zone *</Text>
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
            </FormSection>

            <FormSection icon="construct-outline" title="Work profile" hint="Skills, languages & experience">
              <Text style={styles.label}>Skills *</Text>
              <View style={styles.chips}>
                {SKILL_OPTIONS.map((s) => {
                  const on = skills.includes(s);
                  return (
                    <Pressable key={s} style={[styles.chip, on && styles.chipOn]} onPress={() => toggleSkill(s)}>
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
                    <Pressable key={lang} style={[styles.chip, on && styles.chipOn]} onPress={() => toggleLanguage(lang)}>
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
                    <Pressable key={exp.id} style={[styles.chip, on && styles.chipOn]} onPress={() => { Haptics.selectionAsync(); setExperienceYears(exp.id); }}>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>{exp.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.label}>Travel mode</Text>
              <View style={styles.chips}>
                {TRAVEL_MODE_OPTIONS.map((t) => {
                  const on = travelMode === t.id;
                  return (
                    <Pressable key={t.id} style={[styles.chip, on && styles.chipOn]} onPress={() => { Haptics.selectionAsync(); setTravelMode(t.id); }}>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>{t.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.label}>Work radius</Text>
              <View style={styles.chips}>
                {WORK_RADIUS_OPTIONS.map((km) => {
                  const on = workRadiusKm === km;
                  return (
                    <Pressable key={km} style={[styles.chip, on && styles.chipOn]} onPress={() => { Haptics.selectionAsync(); setWorkRadiusKm(km); }}>
                      <Text style={[styles.chipText, on && styles.chipTextOn]}>{km} km</Text>
                    </Pressable>
                  );
                })}
              </View>
            </FormSection>

            <FormSection icon="wallet-outline" title="Payouts" hint="Weekly credits every Monday">
              <Text style={styles.label}>UPI ID</Text>
              <TextInput
                style={styles.input}
                value={upiId}
                onChangeText={setUpiId}
                placeholder="name@upi"
                placeholderTextColor={colors.placeholder}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
              />
              <Text style={styles.fieldHint}>Used for Monday payout batch after KYC verification</Text>
            </FormSection>

            {error || validationError ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={16} color={colors.error} />
                <Text style={styles.errorText}>{error ?? validationError}</Text>
              </View>
            ) : null}
          </ScrollView>

          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[styles.saveBtn, !valid && styles.saveBtnOff]}
              onPress={save}
              disabled={!valid}
            >
              <Text style={styles.saveText}>Save all details</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(15,20,25,0.45)' },
  wrap: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: radius.xxl + 4,
    borderTopRightRadius: radius.xxl + 4,
    paddingTop: spacing.sm,
    paddingHorizontal: layout.pad,
    maxHeight: '92%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(11,110,103,0.2)',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  title: { fontFamily: fonts.extraBold, fontSize: 20, color: colors.ink, letterSpacing: -0.3 },
  sub: { fontFamily: fonts.regular, fontSize: 12, color: colors.muted, marginTop: 4, marginBottom: spacing.md },
  form: { gap: spacing.lg, paddingBottom: spacing.md },
  section: {
    gap: spacing.sm,
    backgroundColor: colors.bgSubtle,
    borderRadius: radius.xl,
    padding: spacing.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  sectionHead: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: 2 },
  sectionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionCopy: { flex: 1, gap: 1 },
  sectionTitle: { fontFamily: fonts.bold, fontSize: 14, color: colors.ink },
  sectionHint: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },
  nameRow: { flexDirection: 'row', gap: spacing.sm },
  nameCol: { flex: 1, gap: spacing.xs },
  label: { fontFamily: fonts.bold, fontSize: 10, color: colors.muted, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: colors.ink,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    backgroundColor: colors.white,
  },
  readOnlyWrap: { gap: spacing.xs },
  readOnlyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    backgroundColor: 'rgba(15,20,25,0.03)',
  },
  readOnlyText: { flex: 1, fontFamily: fonts.semiBold, fontSize: 14, color: colors.muted },
  phoneRow: { flexDirection: 'row', gap: spacing.sm },
  phonePrefix: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  phonePrefixText: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  phoneInput: { flex: 1 },
  inputMulti: { minHeight: 72, textAlignVertical: 'top' },
  fieldHint: { fontFamily: fonts.regular, fontSize: 11, color: colors.mutedLight, lineHeight: 15 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  chipText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  chipTextOn: { color: colors.primaryDark },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: 'rgba(239,68,68,0.08)',
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  errorText: { flex: 1, fontFamily: fonts.medium, fontSize: 12, color: colors.error, lineHeight: 16 },
  actions: { flexDirection: 'row', gap: spacing.sm, paddingTop: spacing.sm },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.bgSubtle,
  },
  cancelText: { fontFamily: fonts.bold, fontSize: 14, color: colors.muted },
  saveBtn: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  saveBtnOff: { opacity: 0.45 },
  saveText: { fontFamily: fonts.bold, fontSize: 14, color: colors.white },
});

import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ChoiceChips } from '@/components/ui/ChoiceChips';
import { QmInput } from '@/components/ui/QmInput';

import type { EmergencyContact } from '../types/profile.types';
import { ProfileEditSheet } from './ProfileEditSheet';
import { premiumFormStyles, ProfileSectionCard, ProfileTrustNote } from './ProfilePremiumParts';

const REL_OPTS = [
  { value: 'spouse', label: 'Spouse' },
  { value: 'parent', label: 'Parent' },
  { value: 'sibling', label: 'Sibling' },
  { value: 'friend', label: 'Friend' },
  { value: 'other', label: 'Other' },
];

interface ProfileEditEmergencyModalProps {
  visible: boolean;
  contact: EmergencyContact;
  onClose: () => void;
  onSave: (contact: EmergencyContact) => Promise<void>;
}

export function ProfileEditEmergencyModal({ visible, contact, onClose, onSave }: ProfileEditEmergencyModalProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setName(contact.name ?? '');
      setPhone(contact.phone ?? '');
      setRelation(contact.relation?.toLowerCase() ?? '');
    }
  }, [visible, contact]);

  const save = async () => {
    if (!name.trim() || phone.length < 10) return;
    setSaving(true);
    await onSave({
      name: name.trim(),
      phone,
      relation: relation || undefined,
    });
    setSaving(false);
    onClose();
  };

  return (
    <ProfileEditSheet
      visible={visible}
      icon="call-outline"
      badge="Safety"
      title="Emergency contact"
      subtitle="Used only if we cannot reach you"
      onClose={onClose}
      saveLabel="Save contact"
      onSave={save}
      saving={saving}
      saveDisabled={!name.trim() || phone.length < 10}
      saveIcon="shield-outline"
    >
      <View style={premiumFormStyles.form}>
        <ProfileSectionCard icon="people-outline" title="Alternate contact" hint="Family or friend we can call">
          <QmInput label="Contact name *" value={name} onChangeText={setName} placeholder="Full name" autoCapitalize="words" />
          <QmInput label="Phone *" value={phone} onChangeText={(t) => setPhone(t.replace(/\D/g, '').slice(0, 10))} keyboardType="phone-pad" prefix="+91" />
          <ChoiceChips label="Relation" options={REL_OPTS} value={relation} onChange={setRelation} optional />
        </ProfileSectionCard>

        <ProfileTrustNote text="We only use this number during active bookings when your phone is unreachable." />
      </View>
    </ProfileEditSheet>
  );
}

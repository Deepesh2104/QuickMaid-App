import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { QmInput } from '@/components/ui/QmInput';

import type { VisitAccess } from '../types/profile.types';
import { ProfileEditSheet } from './ProfileEditSheet';
import { premiumFormStyles, ProfilePremiumToggle, ProfileSectionCard, ProfileTrustNote } from './ProfilePremiumParts';

interface ProfileEditVisitAccessModalProps {
  visible: boolean;
  access: VisitAccess;
  onClose: () => void;
  onSave: (access: VisitAccess) => Promise<void>;
}

export function ProfileEditVisitAccessModal({ visible, access, onClose, onSave }: ProfileEditVisitAccessModalProps) {
  const [gateCode, setGateCode] = useState('');
  const [hasPets, setHasPets] = useState(false);
  const [petNotes, setPetNotes] = useState('');
  const [parkingNotes, setParkingNotes] = useState('');
  const [visitInstructions, setVisitInstructions] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setGateCode(access.gateCode ?? '');
      setHasPets(access.hasPets);
      setPetNotes(access.petNotes ?? '');
      setParkingNotes(access.parkingNotes ?? '');
      setVisitInstructions(access.visitInstructions ?? '');
    }
  }, [visible, access]);

  const save = async () => {
    setSaving(true);
    await onSave({
      gateCode: gateCode.trim() || undefined,
      hasPets,
      petNotes: petNotes.trim() || undefined,
      parkingNotes: parkingNotes.trim() || undefined,
      visitInstructions: visitInstructions.trim() || undefined,
    });
    setSaving(false);
    onClose();
  };

  return (
    <ProfileEditSheet
      visible={visible}
      icon="key-outline"
      badge="Pro entry"
      title="Visit access"
      subtitle="Gate · Pets · Parking · Entry notes"
      onClose={onClose}
      saveLabel="Save visit details"
      onSave={save}
      saving={saving}
      saveIcon="enter-outline"
    >
      <View style={premiumFormStyles.form}>
        <ProfileSectionCard icon="lock-open-outline" title="Gate & entry" hint="Helps your pro reach you smoothly">
          <QmInput label="Gate / society code" value={gateCode} onChangeText={setGateCode} placeholder="e.g. 4421" />
          <QmInput
            label="Entry instructions for pro"
            value={visitInstructions}
            onChangeText={setVisitInstructions}
            placeholder="Call on arrival · Security will guide"
            multiline
          />
        </ProfileSectionCard>

        <ProfileSectionCard icon="paw-outline" title="Pets & parking" hint="So your pro comes prepared">
          <ProfilePremiumToggle label="Pets at home" sub="Pro will be informed before visit" value={hasPets} onChange={setHasPets} />
          {hasPets ? (
            <QmInput label="Pet notes" value={petNotes} onChangeText={setPetNotes} placeholder="Keep in bedroom during visit" />
          ) : null}
          <QmInput label="Parking instructions" value={parkingNotes} onChangeText={setParkingNotes} placeholder="Basement B-12" />
        </ProfileSectionCard>

        <ProfileTrustNote text="Visit notes are shared with your assigned pro before every booking." />
      </View>
    </ProfileEditSheet>
  );
}

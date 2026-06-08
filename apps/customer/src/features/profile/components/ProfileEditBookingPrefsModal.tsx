import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ChoiceChips } from '@/components/ui/ChoiceChips';
import { QmInput } from '@/components/ui/QmInput';
import { PREFERRED_SLOTS } from '@/constants/customer.zones';

import type { BookingPrefs } from '../types/profile.types';
import { ProfileEditSheet } from './ProfileEditSheet';
import { premiumFormStyles, ProfileSectionCard, ProfileTrustNote } from './ProfilePremiumParts';

const SLOT_OPTS = PREFERRED_SLOTS.map((s) => ({ value: s.value, label: s.label }));

interface ProfileEditBookingPrefsModalProps {
  visible: boolean;
  prefs: BookingPrefs;
  onClose: () => void;
  onSave: (prefs: BookingPrefs) => Promise<void>;
}

export function ProfileEditBookingPrefsModal({ visible, prefs, onClose, onSave }: ProfileEditBookingPrefsModalProps) {
  const [slot, setSlot] = useState('morning');
  const [maid, setMaid] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      setSlot(prefs.preferredSlot);
      setMaid(prefs.favoriteMaidName ?? '');
    }
  }, [visible, prefs]);

  const save = async () => {
    const label = PREFERRED_SLOTS.find((s) => s.value === slot)?.label ?? prefs.preferredSlotLabel;
    setSaving(true);
    await onSave({
      preferredSlot: slot,
      preferredSlotLabel: label,
      favoriteMaidName: maid.trim() || undefined,
    });
    setSaving(false);
    onClose();
  };

  const slotLabel = PREFERRED_SLOTS.find((s) => s.value === slot)?.label;

  return (
    <ProfileEditSheet
      visible={visible}
      icon="calendar-outline"
      badge={slotLabel ?? 'Set slot'}
      title="Booking preferences"
      subtitle="Your ideal time & favourite pro"
      onClose={onClose}
      saveLabel="Save preferences"
      onSave={save}
      saving={saving}
      saveIcon="time-outline"
    >
      <View style={premiumFormStyles.form}>
        <ProfileSectionCard icon="sunny-outline" title="Preferred time" hint="We try to match this slot first">
          <ChoiceChips label="Preferred time slot" options={SLOT_OPTS} value={slot} onChange={setSlot} />
        </ProfileSectionCard>

        <ProfileSectionCard icon="heart-outline" title="Favourite pro" hint="Plus members get priority matching">
          <QmInput
            label="Favourite maid (optional)"
            value={maid}
            onChangeText={setMaid}
            placeholder="e.g. Sunita Devi"
            hint="Same pro when available in your zone"
          />
        </ProfileSectionCard>

        <ProfileTrustNote text="Preferences help dispatch — final slot depends on pro availability in your zone." />
      </View>
    </ProfileEditSheet>
  );
}

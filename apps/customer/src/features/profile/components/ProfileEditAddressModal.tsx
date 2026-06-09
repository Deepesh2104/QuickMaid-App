import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { ChoiceChips } from '@/components/ui/ChoiceChips';
import { QmInput } from '@/components/ui/QmInput';
import { RAIPUR_ZONES } from '@/constants/customer.zones';

import type { SavedAddress } from '../types/profile.types';
import { ProfileEditSheet } from './ProfileEditSheet';
import { premiumFormStyles, ProfilePremiumToggle, ProfileSectionCard, ProfileTrustNote } from './ProfilePremiumParts';

const LABEL_OPTS = [
  { value: 'Home', label: 'Home' },
  { value: 'Office', label: 'Office' },
  { value: 'Other', label: 'Other' },
];

const ZONE_OPTS = RAIPUR_ZONES.map((z) => ({ value: z.label, label: z.label }));

interface ProfileEditAddressModalProps {
  visible: boolean;
  address?: SavedAddress;
  onClose: () => void;
  onSave: (addr: Omit<SavedAddress, 'id' | 'line'> & { id?: string }) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
}

export function ProfileEditAddressModal({ visible, address, onClose, onSave, onDelete }: ProfileEditAddressModalProps) {
  const [label, setLabel] = useState('Home');
  const [labelNote, setLabelNote] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [building, setBuilding] = useState('');
  const [street, setStreet] = useState('');
  const [landmark, setLandmark] = useState('');
  const [zone, setZone] = useState('Shankar Nagar');
  const [pincode, setPincode] = useState('492001');
  const [gateCode, setGateCode] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (visible) {
      const addrLabel = address?.label ?? 'Home';
      setLabel(['Home', 'Office', 'Other'].includes(addrLabel) ? addrLabel : 'Other');
      setLabelNote(address?.labelNote ?? '');
      setFlatNo(address?.flatNo ?? '');
      setBuilding(address?.building ?? '');
      setStreet(address?.street ?? address?.line ?? '');
      setLandmark(address?.landmark ?? '');
      setZone(address?.zone ?? 'Shankar Nagar');
      setPincode(address?.pincode ?? '492001');
      setGateCode(address?.gateCode ?? '');
      setContactPhone(address?.contactPhone ?? '');
      setIsDefault(address?.isDefault ?? !address);
    }
  }, [visible, address]);

  const save = async () => {
    if (!street.trim() || pincode.length !== 6) return;
    if (label === 'Other' && !labelNote.trim()) return;
    setSaving(true);
    await onSave({
      id: address?.id,
      label,
      labelNote: label === 'Other' ? labelNote.trim() : undefined,
      flatNo: flatNo.trim() || undefined,
      building: building.trim() || undefined,
      street: street.trim(),
      landmark: landmark.trim() || undefined,
      zone,
      pincode,
      city: 'Raipur',
      gateCode: gateCode.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      isDefault,
    });
    setSaving(false);
    onClose();
  };

  const remove = async () => {
    if (!address?.id || !onDelete) return;
    setSaving(true);
    await onDelete(address.id);
    setSaving(false);
    onClose();
  };

  return (
    <ProfileEditSheet
      visible={visible}
      icon="location-outline"
      badge={address ? 'Editing' : 'New address'}
      title={address ? 'Edit address' : 'Add address'}
      subtitle="Helps your pro find you faster every visit"
      onClose={onClose}
      saveLabel={address ? 'Update address' : 'Save address'}
      onSave={save}
      saving={saving}
      saveDisabled={!street.trim() || pincode.length !== 6 || (label === 'Other' && !labelNote.trim())}
      saveIcon="location"
      deleteLabel={address && onDelete ? 'Delete address' : undefined}
      onDelete={address && onDelete ? remove : undefined}
    >
      <View style={premiumFormStyles.form}>
        <ProfileSectionCard icon="pricetag-outline" title="Address label" hint="Home, office or other">
          <ChoiceChips
            label="Label"
            options={LABEL_OPTS}
            value={label}
            onChange={(next) => {
              setLabel(next);
              if (next !== 'Other') setLabelNote('');
            }}
          />
          {label === 'Other' ? (
            <QmInput
              label="Describe this place *"
              value={labelNote}
              onChangeText={setLabelNote}
              placeholder="e.g. Mom's home, Friend Rajesh, Parents' address"
            />
          ) : null}
        </ProfileSectionCard>

        <ProfileSectionCard icon="home-outline" title="Location details" hint="Street, zone & PIN for dispatch">
          <QmInput label="Flat / House no." value={flatNo} onChangeText={setFlatNo} placeholder="e.g. Flat 204" />
          <QmInput label="Building / Society" value={building} onChangeText={setBuilding} placeholder="Green Valley" />
          <QmInput label="Street / Sector *" value={street} onChangeText={setStreet} placeholder="Sector 5, Shankar Nagar" />
          <QmInput label="Landmark" value={landmark} onChangeText={setLandmark} placeholder="Near City Mall" />
          <ChoiceChips label="Zone *" options={ZONE_OPTS} value={zone} onChange={setZone} />
          <QmInput label="PIN code *" value={pincode} onChangeText={(t) => setPincode(t.replace(/\D/g, '').slice(0, 6))} keyboardType="number-pad" placeholder="492001" />
        </ProfileSectionCard>

        <ProfileSectionCard icon="key-outline" title="Visit access" hint="Gate code & on-site contact">
          <QmInput label="Gate / Security code" value={gateCode} onChangeText={setGateCode} placeholder="e.g. 4421" />
          <QmInput label="On-site contact phone" value={contactPhone} onChangeText={(t) => setContactPhone(t.replace(/\D/g, '').slice(0, 10))} keyboardType="phone-pad" prefix="+91" />
          <ProfilePremiumToggle label="Set as default" sub="Used for new bookings" value={isDefault} onChange={setIsDefault} />
        </ProfileSectionCard>

        <ProfileTrustNote text="Your address is shared only with pros assigned to your bookings — never publicly." />
      </View>
    </ProfileEditSheet>
  );
}

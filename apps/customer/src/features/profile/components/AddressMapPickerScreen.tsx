import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { type Href, useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { QmInput } from '@/components/ui/QmInput';
import { useCheckout } from '@/context/CheckoutContext';
import { useProfileAccount } from '../hooks/useProfileAccount';
import {
  filterMapZones,
  MAP_ZONES,
  nearestMapZone,
  type MapZone,
  zoneByLabel,
} from '../lib/address.map';
import { getProfileAccount } from '../lib/profile.storage';
import { fonts } from '@/theme/fonts';
import { colors } from '@/theme/colors';
import { layout, radius, spacing } from '@/theme/spacing';

const LABEL_OPTS = ['Home', 'Office', 'Other'] as const;

export function AddressMapPickerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id, returnTo } = useLocalSearchParams<{ id?: string; returnTo?: string }>();
  const { account, upsertAddress, refresh, setPermissions } = useProfileAccount();
  const { updateDraft, refreshAccount } = useCheckout();

  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [label, setLabel] = useState<(typeof LABEL_OPTS)[number]>('Home');
  const [labelNote, setLabelNote] = useState('');
  const [street, setStreet] = useState('');
  const [building, setBuilding] = useState('');
  const [flatNo, setFlatNo] = useState('');
  const [landmark, setLandmark] = useState('');
  const [selected, setSelected] = useState<MapZone>(MAP_ZONES[0]);
  const [pin, setPin] = useState({ x: MAP_ZONES[0].mapX, y: MAP_ZONES[0].mapY });
  const [coords, setCoords] = useState({ latitude: MAP_ZONES[0].latitude, longitude: MAP_ZONES[0].longitude });
  const [mapSize, setMapSize] = useState({ w: 0, h: 280 });

  const filteredZones = useMemo(() => filterMapZones(search), [search]);
  const editing = Boolean(id);

  useEffect(() => {
    if (!account) return;
    if (id) {
      const addr = account.addresses.find((a) => a.id === id);
      if (addr) {
        const addrLabel = addr.label;
        setLabel(LABEL_OPTS.includes(addrLabel as (typeof LABEL_OPTS)[number]) ? (addrLabel as (typeof LABEL_OPTS)[number]) : 'Other');
        setLabelNote(addr.labelNote ?? '');
        setStreet(addr.street);
        setBuilding(addr.building ?? '');
        setFlatNo(addr.flatNo ?? '');
        setLandmark(addr.landmark ?? '');
        const zone = zoneByLabel(addr.zone) ?? MAP_ZONES[0];
        setSelected(zone);
        setPin({ x: zone.mapX, y: zone.mapY });
        if (addr.latitude != null && addr.longitude != null) {
          setCoords({ latitude: addr.latitude, longitude: addr.longitude });
        } else {
          setCoords({ latitude: zone.latitude, longitude: zone.longitude });
        }
      }
    }
    setLoading(false);
  }, [account, id]);

  const selectZone = (zone: MapZone) => {
    Haptics.selectionAsync();
    setSelected(zone);
    setPin({ x: zone.mapX, y: zone.mapY });
    setCoords({ latitude: zone.latitude, longitude: zone.longitude });
    if (!street.trim()) setStreet(`${zone.label}, Raipur`);
  };

  const useCurrentLocation = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location needed', 'Allow location to drop the pin at your current position.');
        setLocating(false);
        return;
      }
      await setPermissions({ locationGranted: true });
      const pos = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const zone = nearestMapZone(pos.coords.latitude, pos.coords.longitude);
      setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
      setSelected(zone);
      setPin({ x: zone.mapX, y: zone.mapY });
      if (!street.trim()) setStreet(`Near ${zone.label}, Raipur`);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      Alert.alert('Could not get location', 'Pick an area on the map or search below.');
    }
    setLocating(false);
  };

  const confirm = async () => {
    if (!street.trim()) {
      Alert.alert('Street required', 'Add a street or area name for your address.');
      return;
    }
    if (label === 'Other' && !labelNote.trim()) {
      Alert.alert('Describe this place', 'Tell us whose address this is — e.g. Mom\'s home, Friend\'s place.');
      return;
    }
    setSaving(true);
    await upsertAddress({
      id: id ?? undefined,
      label,
      labelNote: label === 'Other' ? labelNote.trim() : undefined,
      street: street.trim(),
      building: building.trim() || undefined,
      flatNo: flatNo.trim() || undefined,
      landmark: landmark.trim() || undefined,
      zone: selected.label,
      pincode: selected.pincode,
      city: 'Raipur',
      isDefault: editing ? account?.addresses.find((a) => a.id === id)?.isDefault ?? false : account?.addresses.length === 0,
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
    await refresh();
    const latest = await getProfileAccount();
    const match = id
      ? latest.addresses.find((a) => a.id === id)
      : latest.addresses.find((a) => a.street === street.trim() && a.zone === selected.label);

    if (returnTo === 'checkout') {
      await refreshAccount();
      if (match) updateDraft({ addressId: match.id });
      router.replace('/checkout/address' as Href);
    } else {
      router.back();
    }
    setSaving(false);
  };

  const onMapPress = useCallback((x: number, y: number) => {
    const hit = MAP_ZONES.reduce<{ zone: MapZone; dist: number } | null>((best, zone) => {
      const dist = (zone.mapX - x) ** 2 + (zone.mapY - y) ** 2;
      if (!best || dist < best.dist) return { zone, dist };
      return best;
    }, null);
    if (hit && hit.dist < 0.04) selectZone(hit.zone);
  }, []);

  if (loading || !account) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#010F0E', '#084F4A', '#0B6E67']}
        locations={[0, 0.5, 1]}
        style={[styles.header, { paddingTop: insets.top + spacing.sm }]}
      >
        <View style={styles.headerRow}>
          <Pressable style={styles.headerBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color={colors.white} />
          </Pressable>
          <View style={styles.headerCopy}>
            <Text style={styles.headerEyebrow}>DELIVERY LOCATION</Text>
            <Text style={styles.headerTitle}>{editing ? 'Edit on map' : 'Pick on map'}</Text>
          </View>
          <Pressable
            style={styles.headerBtn}
            onPress={() => void useCurrentLocation()}
            disabled={locating}
            accessibilityLabel="Use current location"
          >
            {locating ? (
              <ActivityIndicator size="small" color={colors.white} />
            ) : (
              <Ionicons name="locate" size={20} color={colors.white} />
            )}
          </Pressable>
        </View>
      </LinearGradient>

      <View style={styles.mapWrap}>
        <LinearGradient colors={['#D1FAE5', '#A7F3D0', '#6EE7B7']} style={StyleSheet.absoluteFill} />
        <View style={styles.mapGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineH, { top: `${(i + 1) * 14}%` }]} />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineV, { left: `${(i + 1) * 14}%` }]} />
          ))}
        </View>

        <Pressable
          style={styles.mapTouch}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            if (width > 0 && height > 0) setMapSize({ w: width, h: height });
          }}
          onPress={(e) => {
            const { locationX, locationY } = e.nativeEvent;
            const layoutW = mapSize.w || 1;
            const layoutH = mapSize.h || 280;
            onMapPress(locationX / layoutW, locationY / layoutH);
          }}
        >
          {MAP_ZONES.map((zone) => {
            const on = zone.value === selected.value;
            return (
              <Pressable
                key={zone.value}
                style={[
                  styles.zoneDot,
                  { left: `${zone.mapX * 100}%`, top: `${zone.mapY * 100}%` },
                  on && styles.zoneDotOn,
                ]}
                onPress={() => selectZone(zone)}
              >
                <View style={[styles.zoneDotInner, on && styles.zoneDotInnerOn]} />
              </Pressable>
            );
          })}

          <View style={[styles.pin, { left: `${pin.x * 100}%`, top: `${pin.y * 100}%` }]}>
            <View style={styles.pinHead}>
              <Ionicons name="location" size={22} color={colors.white} />
            </View>
            <View style={styles.pinTail} />
          </View>
        </Pressable>

        <View style={styles.mapBadge}>
          <Ionicons name="map-outline" size={12} color={colors.primaryDark} />
          <Text style={styles.mapBadgeText}>Raipur · Tap a zone or use GPS</Text>
        </View>
      </View>

      <ScrollView
        style={styles.sheetScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.searchPill}>
            <Ionicons name="search" size={16} color={colors.primary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search area — Shankar Nagar, Pandri…"
              placeholderTextColor={colors.mutedLight}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.zoneRow}>
            {filteredZones.map((zone) => {
              const on = zone.value === selected.value;
              return (
                <Pressable
                  key={zone.value}
                  style={[styles.zoneChip, on && styles.zoneChipOn]}
                  onPress={() => selectZone(zone)}
                >
                  {on ? (
                    <LinearGradient colors={['#0B6E67', '#084F4A']} style={StyleSheet.absoluteFill} />
                  ) : null}
                  <Text style={[styles.zoneChipText, on && styles.zoneChipTextOn]}>{zone.label}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.selectedCard}>
            <Ionicons name="navigate-circle" size={20} color={colors.primary} />
            <View style={styles.selectedCopy}>
              <Text style={styles.selectedTitle}>{selected.label}</Text>
              <Text style={styles.selectedSub}>
                PIN {selected.pincode} · {coords.latitude.toFixed(4)}, {coords.longitude.toFixed(4)}
              </Text>
            </View>
          </View>

          <View style={styles.labelRow}>
            {LABEL_OPTS.map((opt) => {
              const on = label === opt;
              return (
                <Pressable
                  key={opt}
                  style={[styles.labelChip, on && styles.labelChipOn]}
                  onPress={() => {
                    setLabel(opt);
                    if (opt !== 'Other') setLabelNote('');
                  }}
                >
                  <Text style={[styles.labelChipText, on && styles.labelChipTextOn]}>{opt}</Text>
                </Pressable>
              );
            })}
          </View>

          {label === 'Other' ? (
            <QmInput
              label="Describe this place *"
              value={labelNote}
              onChangeText={setLabelNote}
              placeholder="e.g. Mom's home, Friend Rajesh, Parents' address"
            />
          ) : null}

          <QmInput label="Street / area" value={street} onChangeText={setStreet} placeholder="Sector 5, Shankar Nagar" />
          <View style={styles.row2}>
            <View style={styles.flex}>
              <QmInput label="Flat / house" value={flatNo} onChangeText={setFlatNo} placeholder="204" />
            </View>
            <View style={styles.flex}>
              <QmInput label="Building" value={building} onChangeText={setBuilding} placeholder="Green Valley" />
            </View>
          </View>
          <QmInput label="Landmark (optional)" value={landmark} onChangeText={setLandmark} placeholder="Near City Mall" />

          <View style={styles.trust}>
            <Ionicons name="shield-checkmark-outline" size={14} color={colors.primary} />
            <Text style={styles.trustText}>
              Pros use this pin for navigation. You can fine-tune the address after saving.
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <Pressable style={styles.confirmBtn} onPress={() => void confirm()} disabled={saving}>
          <LinearGradient colors={['#084F4A', '#0B6E67', '#12A598']} style={styles.confirmGrad}>
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <>
                <Text style={styles.confirmText}>{editing ? 'Save address' : 'Confirm location'}</Text>
                <Ionicons name="checkmark-circle" size={18} color={colors.white} />
              </>
            )}
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#F4F6F8' },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  header: { paddingBottom: spacing.md },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: layout.pad,
    gap: spacing.md,
  },
  headerBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCopy: { flex: 1, gap: 2 },
  headerEyebrow: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 1.1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 20,
    color: colors.white,
  },

  mapWrap: {
    height: 280,
    overflow: 'hidden',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(15,20,25,0.08)',
  },
  mapGrid: { ...StyleSheet.absoluteFill },
  gridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(11,110,103,0.08)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(11,110,103,0.08)',
  },
  mapTouch: { flex: 1 },
  zoneDot: {
    position: 'absolute',
    width: 28,
    height: 28,
    marginLeft: -14,
    marginTop: -14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneDotOn: { zIndex: 2 },
  zoneDotInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(11,110,103,0.35)',
  },
  zoneDotInnerOn: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.white,
  },
  pin: {
    position: 'absolute',
    marginLeft: -16,
    marginTop: -42,
    alignItems: 'center',
    zIndex: 5,
  },
  pinHead: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
    shadowColor: '#0F1419',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  pinTail: {
    width: 2,
    height: 10,
    backgroundColor: colors.primaryDark,
    marginTop: -2,
  },
  mapBadge: {
    position: 'absolute',
    bottom: spacing.md,
    left: layout.pad,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  mapBadgeText: { fontFamily: fonts.semiBold, fontSize: 10, color: colors.primaryDark },

  sheetScroll: { flex: 1 },
  sheet: {
    backgroundColor: '#F4F6F8',
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    gap: spacing.md,
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.divider,
    marginBottom: spacing.xs,
  },
  searchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.lg,
    paddingVertical: 4,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  searchInput: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: colors.ink,
    paddingVertical: 10,
  },
  zoneRow: { gap: spacing.sm, paddingRight: spacing.sm },
  zoneChip: {
    borderRadius: radius.pill,
    paddingHorizontal: 14,
    paddingVertical: 9,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  zoneChipOn: { borderColor: 'transparent' },
  zoneChipText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.inkSecondary },
  zoneChipTextOn: { fontFamily: fonts.bold, fontSize: 12, color: colors.white },

  selectedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(11,110,103,0.14)',
  },
  selectedCopy: { flex: 1, gap: 2 },
  selectedTitle: { fontFamily: fonts.bold, fontSize: 15, color: colors.ink },
  selectedSub: { fontFamily: fonts.regular, fontSize: 11, color: colors.muted },

  labelRow: { flexDirection: 'row', gap: spacing.sm },
  labelChip: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(15,20,25,0.08)',
  },
  labelChipOn: { backgroundColor: colors.primaryLight, borderColor: colors.primary },
  labelChipText: { fontFamily: fonts.semiBold, fontSize: 12, color: colors.muted },
  labelChipTextOn: { fontFamily: fonts.bold, color: colors.primaryDark },
  row2: { flexDirection: 'row', gap: spacing.md },
  flex: { flex: 1 },

  trust: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    paddingBottom: spacing.md,
  },
  trustText: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 11,
    color: colors.muted,
    lineHeight: 16,
  },

  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: layout.pad,
    paddingTop: spacing.sm,
    backgroundColor: 'rgba(244,246,248,0.96)',
  },
  confirmBtn: { borderRadius: radius.pill, overflow: 'hidden' },
  confirmGrad: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 16,
  },
  confirmText: { fontFamily: fonts.extraBold, fontSize: 16, color: colors.white },
});

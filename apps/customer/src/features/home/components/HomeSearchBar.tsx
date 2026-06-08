import { Ionicons } from '@expo/vector-icons';

import * as Haptics from 'expo-haptics';

import { Controller, type Control } from 'react-hook-form';

import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';



import type { HomeSearchForm } from '../schemas/home-search.schema';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';

import { layout, radius, shadow, spacing } from '@/theme/spacing';



const QUICK = [

  { label: 'Deep clean', icon: 'home-outline' as const },

  { label: 'Regular', icon: 'sparkles-outline' as const },

  { label: 'Kitchen', icon: 'restaurant-outline' as const },

  { label: 'Bathroom', icon: 'water-outline' as const },

];



interface HomeSearchBarProps {

  control: Control<HomeSearchForm>;

  onQuickTag: (tag: string) => void;

}



export function HomeSearchBar({ control, onQuickTag }: HomeSearchBarProps) {

  return (

    <View style={styles.wrap}>

      <View style={styles.card}>

        <View style={styles.bar}>

          <View style={styles.searchIcon}>

            <Ionicons name="search" size={18} color={colors.primary} />

          </View>

          <Controller

            control={control}

            name="query"

            render={({ field: { onChange, onBlur, value } }) => (

              <TextInput

                style={styles.input}

                placeholder="Search services, rooms, offers..."

                placeholderTextColor={colors.placeholder}

                value={value}

                onChangeText={onChange}

                onBlur={onBlur}

                returnKeyType="search"

                accessibilityLabel="Search cleaning services"

              />

            )}

          />

          <Pressable

            style={styles.filter}

            onPress={() => Haptics.selectionAsync()}

            accessibilityRole="button"

            accessibilityLabel="Filter services"

          >

            <Ionicons name="options-outline" size={16} color={colors.primary} />

          </Pressable>

        </View>



        <View style={styles.tagsBlock}>

          <Text style={styles.tagsLabel}>Trending searches</Text>

          <ScrollView

            horizontal

            showsHorizontalScrollIndicator={false}

            contentContainerStyle={styles.tagsRow}

          >

            {QUICK.map((item) => (

              <Pressable

                key={item.label}

                style={styles.tag}

                onPress={() => {

                  Haptics.selectionAsync();

                  onQuickTag(item.label);

                }}

              >

                <Ionicons name={item.icon} size={13} color={colors.primary} />

                <Text style={styles.tagText}>{item.label}</Text>

              </Pressable>

            ))}

          </ScrollView>

        </View>

      </View>

    </View>

  );

}



const styles = StyleSheet.create({

  wrap: {

    marginTop: -24,

    marginHorizontal: layout.pad,

    marginBottom: spacing.xxl,

    zIndex: 30,

  },

  card: {

    backgroundColor: colors.bg,

    borderRadius: radius.xl,

    overflow: 'hidden',

    ...shadow.sm,

  },

  bar: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: spacing.sm,

    paddingHorizontal: spacing.md,

    paddingVertical: spacing.sm,

  },

  searchIcon: {

    width: 36,

    height: 36,

    borderRadius: radius.md,

    backgroundColor: colors.primaryLight,

    alignItems: 'center',

    justifyContent: 'center',

  },

  input: {

    flex: 1,

    minWidth: 0,

    fontFamily: fonts.medium,

    fontSize: 15,

    color: colors.ink,

    paddingVertical: 10,

    paddingHorizontal: 4,

  },

  filter: {

    width: 36,

    height: 36,

    borderRadius: radius.md,

    backgroundColor: colors.bgSubtle,

    alignItems: 'center',

    justifyContent: 'center',

  },

  tagsBlock: {

    paddingHorizontal: spacing.md,

    paddingBottom: spacing.md,

    paddingTop: spacing.sm,

    backgroundColor: colors.bgSubtle,

    gap: spacing.sm,

  },

  tagsLabel: {

    fontFamily: fonts.semiBold,

    fontSize: 12,

    color: colors.muted,

    letterSpacing: 0.2,

  },

  tagsRow: {

    gap: spacing.sm,

    paddingRight: spacing.sm,

  },

  tag: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 6,

    backgroundColor: colors.bg,

    borderRadius: radius.pill,

    paddingHorizontal: 14,

    paddingVertical: 9,

  },

  tagText: {

    fontFamily: fonts.semiBold,

    fontSize: 12,

    color: colors.inkSecondary,

  },

});



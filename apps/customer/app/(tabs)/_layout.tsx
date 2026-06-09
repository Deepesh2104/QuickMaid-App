import { Ionicons } from '@expo/vector-icons';
import { fonts } from '../../src/theme/fonts';
import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CatalogueTabButton } from '../../src/components/navigation/CatalogueTabButton';
import { TabBarButton } from '../../src/components/navigation/TabBarButton';
import { useTranslation } from '../../src/i18n/LanguageProvider';
import { colors } from '../../src/theme/colors';

const TAB_CONTENT_H = 52;

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'android' ? 10 : 8);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedLight,
        tabBarStyle: {
          ...styles.tabBar,
          height: TAB_CONTENT_H + bottomPad,
          paddingBottom: bottomPad,
        },
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        tabBarActiveBackgroundColor: 'transparent',
        tabBarInactiveBackgroundColor: 'transparent',
        tabBarButton: (props) => <TabBarButton {...props} />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home' : 'home-outline'} size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: t('tabs.bookings'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="catalogue"
        options={{
          title: t('tabs.catalogue'),
          tabBarIcon: () => null,
          tabBarButton: (props) => <CatalogueTabButton {...props} />,
        }}
      />
      <Tabs.Screen
        name="plans"
        options={{
          title: t('tabs.plus'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'diamond' : 'diamond-outline'} size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="support"
        options={{
          title: t('tabs.help'),
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'chatbubbles' : 'chatbubbles-outline'} size={23} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.bg,
    borderTopColor: colors.divider,
    borderTopWidth: 1,
    paddingTop: 6,
    elevation: 12,
    shadowColor: '#0F1419',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
  },
  tabItem: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    paddingBottom: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: fonts.semiBold,
    marginTop: 1,
    lineHeight: 13,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
  },
});

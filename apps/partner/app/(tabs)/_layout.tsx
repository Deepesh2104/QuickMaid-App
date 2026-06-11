import { Ionicons } from '@expo/vector-icons';

import { Tabs } from 'expo-router';

import { StyleSheet } from 'react-native';



import { useMemo } from 'react';



import { TabBarButton } from '@/components/navigation/TabBarButton';

import { usePartner } from '@/context/PartnerContext';

import { DispatchAssignProvider } from '@/features/jobs/context/DispatchAssignContext';

import { buildManualOffers } from '@/features/jobs/lib/dispatch.utils';

import { usePartnerJobs } from '@/features/jobs/hooks/usePartnerJobs';

import { usePartnerPreferences } from '@/features/settings/hooks/usePartnerPreferences';

import { fonts } from '@/theme/fonts';

import { colors } from '@/theme/colors';



export default function TabsLayout() {

  const { profile, state } = usePartner();

  const { pending, active } = usePartnerJobs();

  const { prefs } = usePartnerPreferences();

  const manualMode = !prefs.autoAssignOffers;

  const manualOfferCount = useMemo(

    () => buildManualOffers(pending, profile, state.isOnline).length,

    [pending, profile, state.isOnline],

  );

  const scheduleBadge = active.length > 0 ? active.length : undefined;

  const requestsBadge = manualMode && manualOfferCount > 0 ? manualOfferCount : undefined;



  return (

    <DispatchAssignProvider>

      <Tabs

        screenOptions={{

          headerShown: false,

          tabBarActiveTintColor: colors.primary,

          tabBarInactiveTintColor: colors.mutedLight,

          tabBarStyle: styles.tabBar,

          tabBarLabelStyle: styles.tabLabel,

          tabBarButton: (props) => <TabBarButton {...props} />,

        }}

      >

        <Tabs.Screen

          name="index"

          options={{

            title: 'Jobs',

            tabBarIcon: ({ color, focused }) => (

              <Ionicons name={focused ? 'briefcase' : 'briefcase-outline'} size={23} color={color} />

            ),

          }}

        />

        <Tabs.Screen

          name="requests"

          options={{

            title: 'Requests',

            href: manualMode ? undefined : null,

            tabBarBadge: requestsBadge,

            tabBarIcon: ({ color, focused }) => (

              <Ionicons name={focused ? 'mail' : 'mail-outline'} size={23} color={color} />

            ),

          }}

        />

        <Tabs.Screen

          name="schedule"

          options={{

            title: 'Schedule',

            tabBarBadge: scheduleBadge,

            tabBarIcon: ({ color, focused }) => (

              <Ionicons name={focused ? 'calendar' : 'calendar-outline'} size={23} color={color} />

            ),

          }}

        />

        <Tabs.Screen

          name="earnings"

          options={{

            title: 'Earnings',

            tabBarIcon: ({ color, focused }) => (

              <Ionicons name={focused ? 'wallet' : 'wallet-outline'} size={23} color={color} />

            ),

          }}

        />

        <Tabs.Screen

          name="help"

          options={{

            title: 'Help',

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

    </DispatchAssignProvider>

  );

}



const styles = StyleSheet.create({

  tabBar: {

    backgroundColor: colors.bg,

    borderTopColor: colors.divider,

    borderTopWidth: 1,

    paddingTop: 6,

    elevation: 0,

  },

  tabLabel: {

    fontSize: 10,

    fontFamily: fonts.semiBold,

    marginTop: 1,

  },

});


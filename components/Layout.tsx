import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../services/theme';

// Simple Theme Constants
export const COLORS = {
  primary: '#f9f506',
  bgLight: '#f8f8f5',
  bgDark: '#23220f',
  surfaceLight: '#ffffff',
  surfaceDark: '#2d2c15',
  textLight: '#1c1c0d',
  textDark: '#f2f2f2',
  textGray: '#888888',
};

export const Layout: React.FC<{ children: React.ReactNode, hideNav?: boolean }> = ({ children, hideNav }) => {
  const { colors } = useTheme();
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'left', 'right', 'bottom']}>
      <View style={styles.content}>
        {children}
      </View>
      {!hideNav && <BottomNav />}
    </SafeAreaView>
  );
};

export const BottomNav: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const { colors } = useTheme();
  
  const currentRoute = route.name;

  const NavItem = ({ name, icon, label }: { name: string, icon: keyof typeof MaterialIcons.glyphMap, label: string }) => {
    const isActive = currentRoute === name;
    return (
      <TouchableOpacity 
        style={styles.navItem} 
        onPress={() => navigation.navigate(name)}
        activeOpacity={0.7}
      >
        <View style={[styles.iconContainer, isActive && styles.activeIconContainer]}>
          <MaterialIcons 
            name={icon} 
            size={26} 
            color={isActive ? '#FFE500' : '#666'} 
          />
        </View>
        <Text style={[styles.navLabel, isActive && styles.activeNavLabel]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.bottomNav, { backgroundColor: colors.navBg, borderTopColor: colors.navBorder }]}>
      <NavItem name="Home" icon="home" label="Home" />
      <NavItem name="Library" icon="library-books" label="Library" />
      <NavItem name="Settings" icon="settings" label="Settings" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  bottomNav: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 4,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255, 229, 0, 0.15)',
  },
  navLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: '600',
  },
  activeNavLabel: {
    color: '#FFE500',
  },
});
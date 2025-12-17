import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';

export const Settings: React.FC = () => {
  return (
    <Layout>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="help" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.menuGroup}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(234, 179, 8, 0.2)' }]}>
                <MaterialIcons name="notifications" size={20} color="#ca8a04" />
              </View>
              <Text style={styles.menuText}>Daily Reminder</Text>
            </View>
            <Switch value={true} trackColor={{ true: COLORS.primary }} thumbColor="white" />
          </View>
          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(147, 51, 234, 0.2)' }]}>
                <MaterialIcons name="dark-mode" size={20} color="#9333ea" />
              </View>
              <Text style={styles.menuText}>Dark Mode</Text>
            </View>
            <Switch value={true} trackColor={{ true: COLORS.primary }} thumbColor="white" />
          </View>
        </View>

        <Text style={styles.sectionTitle}>About Recall</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                <MaterialIcons name="info" size={20} color="#aaa" />
              </View>
              <Text style={styles.menuText}>App Info</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.version}>Version 1.0.4 (Build 22)</Text>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: { padding: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', textTransform: 'uppercase', marginBottom: 12, marginLeft: 4 },
  menuGroup: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 20, marginBottom: 32 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  menuIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  menuText: { fontSize: 14, fontWeight: '600', color: '#ddd' },
  version: { textAlign: 'center', color: '#444', fontSize: 10, textTransform: 'uppercase' },
});
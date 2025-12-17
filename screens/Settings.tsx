import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, TextInput, Alert, Modal } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../services/db';
import { Settings as SettingsType } from '../types';

export const Settings: React.FC = () => {
  const navigation = useNavigation<any>();
  const [settings, setSettings] = useState<SettingsType>({
    darkMode: true,
    apiKey: '',
    dailyReminder: true,
    aiSuggestions: false
  });
  const [showAPIModal, setShowAPIModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await db.getSettings();
    setSettings(loadedSettings);
    setApiKeyInput(loadedSettings.apiKey || '');
  };

  const updateSetting = async (key: keyof SettingsType, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await db.saveSettings(newSettings);
  };

  const saveAPIKey = async () => {
    if (!apiKeyInput.trim()) {
      Alert.alert('Error', 'API Key cannot be empty');
      return;
    }

    await updateSetting('apiKey', apiKeyInput.trim());
    setShowAPIModal(false);
    Alert.alert('Success', 'API Key saved successfully');
  };

  const clearAPIKey = async () => {
    Alert.alert(
      'Clear API Key',
      'Are you sure you want to clear your API key?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            setApiKeyInput('');
            await updateSetting('apiKey', '');
            Alert.alert('Success', 'API Key cleared');
          }
        }
      ]
    );
  };

  return (
    <Layout>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="help" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>AI Configuration</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowAPIModal(true)}
          >
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(249, 245, 6, 0.2)' }]}>
                <MaterialIcons name="key" size={20} color="#f9f506" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuText}>Gemini API Key</Text>
                <Text style={styles.menuSubtext}>
                  {settings.apiKey ? '••••••' + settings.apiKey.slice(-4) : 'Not configured'}
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}>
                <MaterialIcons name="auto-awesome" size={20} color="#a855f7" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuText}>Smart Enrichment</Text>
                <Text style={styles.menuSubtext}>
                  Generate related questions beyond document
                </Text>
              </View>
            </View>
            <Switch
              value={settings.aiSuggestions}
              onValueChange={(val) => updateSetting('aiSuggestions', val)}
              trackColor={{ true: COLORS.primary }}
              thumbColor="white"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.menuGroup}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(234, 179, 8, 0.2)' }]}>
                <MaterialIcons name="notifications" size={20} color="#ca8a04" />
              </View>
              <Text style={styles.menuText}>Daily Reminder</Text>
            </View>
            <Switch
              value={settings.dailyReminder}
              onValueChange={(val) => updateSetting('dailyReminder', val)}
              trackColor={{ true: COLORS.primary }}
              thumbColor="white"
            />
          </View>
          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(147, 51, 234, 0.2)' }]}>
                <MaterialIcons name="dark-mode" size={20} color="#9333ea" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.menuText}>Dark Mode</Text>
                <Text style={styles.menuSubtext}>Always enabled for better focus</Text>
              </View>
            </View>
            <Switch
              value={true}
              disabled={true}
              trackColor={{ true: COLORS.primary }}
              thumbColor="white"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>About Recall</Text>
        <View style={styles.menuGroup}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <View style={[styles.menuIcon, { backgroundColor: 'rgba(255,255,255,0.1)' }]}>
                <MaterialIcons name="info" size={20} color="#aaa" />
              </View>
              <Text style={styles.menuText}>App Info</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>Version 1.0.0</Text>
      </ScrollView>

      {/* API Key Modal */}
      <Modal
        visible={showAPIModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAPIModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Gemini API Key</Text>
              <TouchableOpacity onPress={() => setShowAPIModal(false)}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              Enter your Gemini API key to enable AI-powered flashcard generation.
              You can get a free API key from Google AI Studio.
            </Text>

            <TextInput
              style={styles.apiInput}
              placeholder="Enter Gemini API Key"
              placeholderTextColor="#666"
              value={apiKeyInput}
              onChangeText={setApiKeyInput}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={false}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.clearButton]}
                onPress={clearAPIKey}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveAPIKey}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white'
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4
  },
  menuGroup: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    marginBottom: 32
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    minHeight: 60
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 12
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ddd'
  },
  menuSubtext: {
    fontSize: 12,
    color: '#888',
    marginTop: 2
  },
  version: {
    textAlign: 'center',
    color: '#444',
    fontSize: 10,
    textTransform: 'uppercase'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    backgroundColor: COLORS.surfaceDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    minHeight: 300
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  modalDescription: {
    fontSize: 14,
    color: '#aaa',
    marginBottom: 24,
    lineHeight: 20
  },
  apiInput: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 16,
    color: 'white',
    fontSize: 14,
    marginBottom: 24
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12
  },
  modalButton: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center'
  },
  clearButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  clearButtonText: {
    color: '#ef4444',
    fontWeight: 'bold'
  },
  saveButton: {
    backgroundColor: COLORS.primary
  },
  saveButtonText: {
    color: '#1c1c0d',
    fontWeight: 'bold'
  }
});

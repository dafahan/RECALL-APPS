import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, TextInput, Alert, Modal, Platform, KeyboardAvoidingView } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../services/db';
import { Settings as SettingsType } from '../types';
import { useTranslation, i18n } from '../services/i18n';
import { useTheme } from '../services/theme';

export const Settings: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t, setLanguage } = useTranslation();
  const { toggleTheme, colors } = useTheme();
  const [settings, setSettings] = useState<SettingsType>({
    darkMode: true,
    apiKey: '',
    dailyReminder: true,
    aiSuggestions: false,
    language: 'en'
  });
  const [showAPIModal, setShowAPIModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  useEffect(() => {
    loadSettings();
    i18n.initialize();
  }, []);

  const loadSettings = async () => {
    const loadedSettings = await db.getSettings();
    setSettings(loadedSettings);
    setApiKeyInput(loadedSettings.apiKey || '');
    // Update i18n language
    i18n.setLanguage(loadedSettings.language || 'en');
  };

  const updateSetting = async (key: keyof SettingsType, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await db.saveSettings(newSettings);
    
    // Update i18n language if language setting changed
    if (key === 'language') {
      i18n.setLanguage(value);
    }
    
    // Update theme if dark mode changed
    if (key === 'darkMode') {
      toggleTheme();
    }
  };

  const saveAPIKey = async () => {
    if (!apiKeyInput.trim()) {
      Alert.alert(t('error'), t('apiKeyEmpty'));
      return;
    }

    await updateSetting('apiKey', apiKeyInput.trim());
    setShowAPIModal(false);
    Alert.alert(t('success'), t('apiKeySaved'));
  };

  const clearAPIKey = async () => {
    Alert.alert(
      t('clearApiKey'),
      t('clearApiKeyConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('clear'),
          style: 'destructive',
          onPress: async () => {
            setApiKeyInput('');
            await updateSetting('apiKey', '');
            Alert.alert(t('success'), t('apiKeyCleared'));
          }
        }
      ]
    );
  };

  return (
    <Layout>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('settingsTitle')}</Text>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Help')}
        >
          <MaterialIcons name="help" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('aiConfiguration')}</Text>
        <View style={[styles.menuGroup, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setShowAPIModal(true)}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <MaterialIcons name="key" size={20} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuText, { color: colors.text }]}>{t('geminiApiKey')}</Text>
                <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                  {settings.apiKey ? '••••••' + settings.apiKey.slice(-4) : t('notConfigured')}
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>

          <View style={[styles.menuItem, { borderBottomWidth: 0 }]}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <MaterialIcons name="auto-awesome" size={20} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuText, { color: colors.text }]}>{t('smartEnrichment')}</Text>
                <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                  {t('smartEnrichmentDesc')}
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

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('preferences')}</Text>
        <View style={[styles.menuGroup, { backgroundColor: colors.card }]}>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <MaterialIcons name="language" size={20} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuText, { color: colors.text }]}>{t('language')}</Text>
                <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>
                  {settings.language === 'id' ? 'Bahasa Indonesia' : 'English'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.languageToggle}
              onPress={() => updateSetting('language', settings.language === 'id' ? 'en' : 'id')}
            >
              <Text style={styles.languageToggleText}>
                {settings.language === 'id' ? 'ID' : 'EN'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <MaterialIcons name="notifications" size={20} color="white" />
              </View>
              <Text style={[styles.menuText, { color: colors.text }]}>{t('dailyReminder')}</Text>
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
              <View style={styles.menuIcon}>
                <MaterialIcons name="dark-mode" size={20} color="white" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.menuText, { color: colors.text }]}>{t('darkMode')}</Text>
                <Text style={[styles.menuSubtext, { color: colors.textSecondary }]}>{t('darkModeDesc')}</Text>
              </View>
            </View>
            <Switch
              value={settings.darkMode}
              onValueChange={(val) => updateSetting('darkMode', val)}
              trackColor={{ true: COLORS.primary }}
              thumbColor="white"
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{t('aboutRecall')}</Text>
        <View style={[styles.menuGroup, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => navigation.navigate('AppInfo')}
          >
            <View style={styles.menuLeft}>
              <View style={styles.menuIcon}>
                <MaterialIcons name="info" size={20} color="white" />
              </View>
              <Text style={[styles.menuText, { color: colors.text }]}>{t('appInfo')}</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>{t('version')}</Text>
      </ScrollView>

      {/* API Key Modal */}
      <Modal
        visible={showAPIModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAPIModal(false)}
      >
        <KeyboardAvoidingView 
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
        >
          <TouchableOpacity 
            style={styles.modalBackdrop} 
            activeOpacity={1} 
            onPress={() => setShowAPIModal(false)}
          />
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('apiKeyTitle')}</Text>
              <TouchableOpacity onPress={() => setShowAPIModal(false)}>
                <MaterialIcons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDescription}>
              {t('apiKeyDescription')}
            </Text>

            <TextInput
              style={styles.apiInput}
              placeholder={t('enterApiKey')}
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
                <Text style={styles.clearButtonText}>{t('clear')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={saveAPIKey}
              >
                <Text style={styles.saveButtonText}>{t('save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
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
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4
  },
  menuGroup: {
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
    justifyContent: 'center',
    backgroundColor: '#a855f7'
  },
  menuText: {
    fontSize: 14,
    fontWeight: '600',
  },
  menuSubtext: {
    fontSize: 12,
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
  modalBackdrop: {
    flex: 1
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
  },
  languageToggle: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 50,
    alignItems: 'center'
  },
  languageToggleText: {
    color: '#1c1c0d',
    fontWeight: 'bold',
    fontSize: 12
  }
});

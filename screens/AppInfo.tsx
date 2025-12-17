import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Layout } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../services/i18n';
import { useTheme } from '../services/theme';

export const AppInfo: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { colors } = useTheme();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('appInfoTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.logoCard, { backgroundColor: colors.card }]}>
          <View style={styles.logoCircle}>
            <MaterialIcons name="school" size={48} color="#a855f7" />
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>Recall AI</Text>
          <Text style={[styles.tagline, { color: colors.textSecondary }]}>
            {t('appInfoTagline')}
          </Text>
          <Text style={[styles.version, { color: colors.textSecondary }]}>{t('version')}</Text>
        </View>

        <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('appInfoAbout')}</Text>
          <Text style={[styles.cardText, { color: colors.textSecondary }]}>
            {t('appInfoAboutText')}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('appInfoFeatures')}
        </Text>
        <View style={[styles.featuresCard, { backgroundColor: colors.card }]}>
          <View style={[styles.featureItem, { borderBottomColor: colors.border }]}>
            <View style={styles.featureIcon}>
              <MaterialIcons name="picture-as-pdf" size={20} color="white" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {t('appInfoFeature1Title')}
              </Text>
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                {t('appInfoFeature1Text')}
              </Text>
            </View>
          </View>

          <View style={[styles.featureItem, { borderBottomColor: colors.border }]}>
            <View style={styles.featureIcon}>
              <MaterialIcons name="auto-awesome" size={20} color="white" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {t('appInfoFeature2Title')}
              </Text>
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                {t('appInfoFeature2Text')}
              </Text>
            </View>
          </View>

          <View style={[styles.featureItem, { borderBottomColor: colors.border }]}>
            <View style={styles.featureIcon}>
              <MaterialIcons name="flash-on" size={20} color="white" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {t('appInfoFeature3Title')}
              </Text>
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                {t('appInfoFeature3Text')}
              </Text>
            </View>
          </View>

          <View style={[styles.featureItem, { borderBottomWidth: 0 }]}>
            <View style={styles.featureIcon}>
              <MaterialIcons name="lock" size={20} color="white" />
            </View>
            <View style={styles.featureContent}>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                {t('appInfoFeature4Title')}
              </Text>
              <Text style={[styles.featureText, { color: colors.textSecondary }]}>
                {t('appInfoFeature4Text')}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('appInfoTech')}
        </Text>
        <View style={[styles.techCard, { backgroundColor: colors.card }]}>
          <View style={styles.techItem}>
            <MaterialIcons name="code" size={20} color="#a855f7" />
            <Text style={[styles.techText, { color: colors.text }]}>React Native + Expo</Text>
          </View>
          <View style={styles.techItem}>
            <MaterialIcons name="psychology" size={20} color="#a855f7" />
            <Text style={[styles.techText, { color: colors.text }]}>Google Gemini 2.5 Flash</Text>
          </View>
          <View style={styles.techItem}>
            <MaterialIcons name="security" size={20} color="#a855f7" />
            <Text style={[styles.techText, { color: colors.text }]}>Local Storage (BYOK)</Text>
          </View>
        </View>

        <View style={[styles.linksCard, { backgroundColor: colors.card }]}>
          <TouchableOpacity
            style={[styles.linkItem, { borderBottomColor: colors.border }]}
            onPress={() => openLink('https://github.com/dafahan/RECALL-APPS')}
          >
            <View style={styles.linkLeft}>
              <MaterialIcons name="code" size={20} color={colors.text} />
              <Text style={[styles.linkText, { color: colors.text }]}>
                {t('appInfoSourceCode')}
              </Text>
            </View>
            <MaterialIcons name="open-in-new" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkItem, { borderBottomColor: colors.border }]}
            onPress={() => openLink('https://aistudio.google.com/')}
          >
            <View style={styles.linkLeft}>
              <MaterialIcons name="key" size={20} color={colors.text} />
              <Text style={[styles.linkText, { color: colors.text }]}>
                {t('appInfoGetApiKey')}
              </Text>
            </View>
            <MaterialIcons name="open-in-new" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.linkItem, { borderBottomWidth: 0 }]}
            onPress={() => openLink('https://github.com/dafahan/RECALL-APPS/issues')}
          >
            <View style={styles.linkLeft}>
              <MaterialIcons name="bug-report" size={20} color={colors.text} />
              <Text style={[styles.linkText, { color: colors.text }]}>
                {t('appInfoReportIssue')}
              </Text>
            </View>
            <MaterialIcons name="open-in-new" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.creditsCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.creditsTitle, { color: colors.text }]}>
            {t('appInfoDeveloper')}
          </Text>
          <Text style={[styles.creditsText, { color: colors.textSecondary }]}>
            {t('appInfoDeveloperName')}
          </Text>
          <Text style={[styles.creditsSubtext, { color: colors.textSecondary }]}>
            {t('appInfoBuiltWith')}
          </Text>
        </View>

        <Text style={[styles.license, { color: colors.textSecondary }]}>
          {t('appInfoLicense')}
        </Text>
      </ScrollView>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100
  },
  logoCard: {
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8
  },
  tagline: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8
  },
  version: {
    fontSize: 12,
    textTransform: 'uppercase'
  },
  infoCard: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 32
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4
  },
  featuresCard: {
    borderRadius: 20,
    marginBottom: 32
  },
  featureItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    gap: 12
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  featureContent: {
    flex: 1
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4
  },
  featureText: {
    fontSize: 13,
    lineHeight: 18
  },
  techCard: {
    borderRadius: 20,
    padding: 20,
    gap: 12,
    marginBottom: 24
  },
  techItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  techText: {
    fontSize: 14,
    fontWeight: '500'
  },
  linksCard: {
    borderRadius: 20,
    marginBottom: 24
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1
  },
  linkLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  linkText: {
    fontSize: 14,
    fontWeight: '500'
  },
  creditsCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16
  },
  creditsTitle: {
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 8,
    fontWeight: 'bold'
  },
  creditsText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  creditsSubtext: {
    fontSize: 12,
    textAlign: 'center'
  },
  license: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 24
  }
});

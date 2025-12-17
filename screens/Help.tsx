import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Layout } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '../services/i18n';
import { useTheme } from '../services/theme';

interface FAQItem {
  question: string;
  answer: string;
}

export const Help: React.FC = () => {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqItems: FAQItem[] = [
    {
      question: t('helpFaq1Q'),
      answer: t('helpFaq1A')
    },
    {
      question: t('helpFaq2Q'),
      answer: t('helpFaq2A')
    },
    {
      question: t('helpFaq3Q'),
      answer: t('helpFaq3A')
    },
    {
      question: t('helpFaq4Q'),
      answer: t('helpFaq4A')
    },
    {
      question: t('helpFaq5Q'),
      answer: t('helpFaq5A')
    }
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>{t('helpTitle')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.introCard, { backgroundColor: colors.card }]}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="help-outline" size={32} color="#a855f7" />
          </View>
          <Text style={[styles.introTitle, { color: colors.text }]}>{t('helpIntroTitle')}</Text>
          <Text style={[styles.introText, { color: colors.textSecondary }]}>
            {t('helpIntroText')}
          </Text>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('helpGettingStarted')}
        </Text>
        <View style={[styles.stepsCard, { backgroundColor: colors.card }]}>
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>{t('helpStep1Title')}</Text>
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                {t('helpStep1Text')}
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>{t('helpStep2Title')}</Text>
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                {t('helpStep2Text')}
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>{t('helpStep3Title')}</Text>
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                {t('helpStep3Text')}
              </Text>
            </View>
          </View>

          <View style={[styles.stepItem, { borderBottomWidth: 0 }]}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>4</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={[styles.stepTitle, { color: colors.text }]}>{t('helpStep4Title')}</Text>
              <Text style={[styles.stepText, { color: colors.textSecondary }]}>
                {t('helpStep4Text')}
              </Text>
            </View>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('helpFaqTitle')}
        </Text>
        <View style={[styles.faqCard, { backgroundColor: colors.card }]}>
          {faqItems.map((item, index) => (
            <View key={index} style={[styles.faqItem, index === faqItems.length - 1 && { borderBottomWidth: 0 }]}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleExpand(index)}
              >
                <Text style={[styles.faqQuestionText, { color: colors.text }]}>
                  {item.question}
                </Text>
                <MaterialIcons
                  name={expandedIndex === index ? 'expand-less' : 'expand-more'}
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
              {expandedIndex === index && (
                <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                  {item.answer}
                </Text>
              )}
            </View>
          ))}
        </View>

        <View style={[styles.supportCard, { backgroundColor: colors.card }]}>
          <MaterialIcons name="support-agent" size={24} color="#a855f7" />
          <Text style={[styles.supportTitle, { color: colors.text }]}>
            {t('helpNeedMoreHelp')}
          </Text>
          <Text style={[styles.supportText, { color: colors.textSecondary }]}>
            {t('helpContactText')}
          </Text>
        </View>
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
  introCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 32
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  introTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center'
  },
  introText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center'
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginLeft: 4
  },
  stepsCard: {
    borderRadius: 20,
    marginBottom: 32
  },
  stepItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 16
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#a855f7',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14
  },
  stepContent: {
    flex: 1
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4
  },
  stepText: {
    fontSize: 14,
    lineHeight: 20
  },
  faqCard: {
    borderRadius: 20,
    marginBottom: 24
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)'
  },
  faqQuestion: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    gap: 12
  },
  faqQuestionText: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1
  },
  faqAnswer: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 16,
    paddingBottom: 16
  },
  supportCard: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24
  },
  supportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 8
  },
  supportText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20
  }
});

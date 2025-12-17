import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from '../services/i18n';
import { useTheme } from '../services/theme';

export const QuizSetup: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { deckId, topic, fileName, fileUri, fileContent, mimeType } = route.params || {};

  const [cardCount, setCardCount] = useState(10);
  const isNewDeck = deckId === 'new';
  const displayTopic = topic || "General Knowledge";

  const handleStart = () => {
    if (isNewDeck) {
      navigation.navigate('Processing', {
        topic: displayTopic,
        count: cardCount,
        fileName,
        fileUri,
        fileContent,
        mimeType
      });
    } else {
      navigation.navigate('QuizActive', { deckId, count: cardCount });
    }
  };

  return (
    <Layout>
      <View style={[styles.header, { backgroundColor: colors.background + 'CC' }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: colors.background === '#23220f' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' }]}>
          <MaterialIcons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.background === '#23220f' ? 'rgba(0,0,0,0.3)' : 'rgba(0,0,0,0.05)' }]}>
          <MaterialIcons name="more-vert" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://picsum.photos/400/300?blur=5' }} 
            style={styles.headerImage} 
          />
          <LinearGradient
            colors={['transparent', colors.background]}
            style={styles.imageGradient}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            {isNewDeck ? t('newSession') : t('readyToRecall')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
             {isNewDeck ? `${t('generatingCards')} ${displayTopic.slice(0, 20)}...` : t('customizeExperience')}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{t('studyDepth')}</Text>
          <View style={styles.optionsGrid}>
            {[5, 10, 15].map(val => (
              <TouchableOpacity
                key={val}
                onPress={() => setCardCount(val)}
                style={[
                  styles.optionCard,
                  {
                    backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.05)' : '#ffffff',
                    borderColor: cardCount === val ? COLORS.primary : (colors.background === '#23220f' ? 'transparent' : '#e5e5e5'),
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: colors.background === '#23220f' ? 0 : 0.05,
                    shadowRadius: 4,
                    elevation: colors.background === '#23220f' ? 0 : 2,
                  },
                  cardCount === val && styles.optionCardActive
                ]}
              >
                <Text style={[styles.optionValue, { color: cardCount === val ? '#1c1c0d' : colors.text }]}>
                  {val}
                </Text>
                <Text style={[styles.optionLabel, { color: cardCount === val ? 'rgba(0,0,0,0.6)' : colors.textSecondary }]}>{t('quizCards')}</Text>
                {cardCount === val && (
                  <View style={styles.checkIcon}>
                     <MaterialIcons name="check-circle" size={18} color="#1c1c0d" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
          <MaterialIcons name="info" size={20} color={colors.textSecondary} />
          <Text style={[styles.infoText, { color: colors.textSecondary }]}>
            {t('infoText')}
          </Text>
        </View>
      </View>

      <View style={[styles.footer, { backgroundColor: 'transparent' }]}>
        <TouchableOpacity
          onPress={handleStart}
          style={[styles.startBtn, {
            shadowColor: '#FFE500',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }]}
          activeOpacity={0.9}
        >
          <MaterialIcons name={isNewDeck ? "auto-awesome" : "flash-on"} size={24} color="#1c1c0d" />
          <Text style={styles.startBtnText}>{isNewDeck ? 'Process & Generate' : t('startQuiz')}</Text>
          <MaterialIcons name="arrow-forward" size={24} color="#1c1c0d" style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  imageContainer: {
    height: 240,
    width: '100%',
    borderRadius: 32,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 24,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
  },
  titleContainer: {
    marginTop: -40,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#666',
    marginBottom: 12,
    letterSpacing: 1,
  },
  optionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  optionCard: {
    flex: 1,
    height: 120,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  optionCardActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  optionValueActive: {
    color: '#1c1c0d',
  },
  optionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  checkIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  infoBox: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  footer: {
    padding: 24,
    paddingBottom: 40,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    height: 64,
    borderRadius: 32,
    paddingHorizontal: 24,
    gap: 12,
  },
  startBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1c1c0d',
  },
});
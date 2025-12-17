import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { aiService } from '../services/ai';
import { db } from '../services/db';
import { useTranslation } from '../services/i18n';

export const Processing: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { topic = "Study Session", count = 5, fileName, fileUri, fileContent, mimeType } = route.params || {};

  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  
  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false, // width change
    }).start();
  }, [progress]);

  useEffect(() => {
    let isMounted = true;

    const process = async () => {
      // Check if API key exists first
      const settings = await db.getSettings();

      if (!settings.apiKey) {
        if (!isMounted) return;
        setStatusText(t('apiKeyNotConfigured'));
        setProgress(0);

        setTimeout(() => {
          if (isMounted) {
            navigation.replace('Settings');
          }
        }, 2000);
        return;
      }

      setStatusText(t('readingDocument'));
      setProgress(10);

      const startTime = Date.now();
      setStatusText(t('consultingAI'));
      setProgress(30);

      try {
        const result = await aiService.generateFlashcards(topic, count, fileContent, fileUri, mimeType, settings.language || 'en');

        if (!isMounted) return;

        setProgress(80);
        setStatusText(t('creatingFlashcards'));

        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 2000) {
          await new Promise(r => setTimeout(r, 2000 - elapsedTime));
        }

        const newDeckId = await db.createDeck(result.title, result.cards);

        if (!isMounted) return;
        setProgress(100);

        // Use replace to prevent going back to processing
        navigation.replace('QuizActive', { deckId: newDeckId, count });

      } catch (e: any) {
        console.error(e);
        if (!isMounted) return;

        if (e.message?.includes('API key')) {
          setStatusText(t('invalidApiKey'));
          setTimeout(() => {
            if (isMounted) {
              navigation.replace('Settings');
            }
          }, 2000);
        } else {
          setStatusText("Error generating cards.");
        }
      }
    };

    process();
    return () => { isMounted = false; };
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <Layout hideNav>
      <View style={styles.container}>
        <View style={styles.spacer} />
        
        <View style={styles.centerContent}>
          <View style={styles.iconWrapper}>
            <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
            <View style={styles.mainIcon}>
              <MaterialIcons name={progress > 50 ? 'auto-awesome' : 'description'} size={48} color="#1c1c0d" />
            </View>
          </View>

          <View style={styles.textWrapper}>
            <Text style={styles.statusTitle}>{statusText}</Text>
            <Text style={styles.statusSubtitle}>
              {t('extractingConcepts')} {count} {t('cards').toLowerCase()}...
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>{t('processing')}</Text>
              <Text style={styles.progressValue}>{progress}%</Text>
            </View>
            <View style={styles.track}>
              <Animated.View style={[styles.fill, { width: progressWidth }]} />
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.cancelBtn}>
            <Text style={styles.cancelText}>{t('cancel')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  spacer: { height: 60 },
  centerContent: {
    alignItems: 'center',
    width: '100%',
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    height: 160,
    width: 160,
  },
  pulseCircle: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(249, 245, 6, 0.1)',
  },
  mainIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  textWrapper: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statusTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
  },
  statusSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  progressContainer: {
    width: '80%',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
  },
  progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  track: {
    height: 6,
    backgroundColor: '#38371f',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelText: {
    color: '#888',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../services/db';
import { Card } from '../types';
import { useTranslation } from '../services/i18n';
import { useTheme } from '../services/theme';

const { width } = Dimensions.get('window');

export const QuizActive: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { deckId, count } = route.params || {};

  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Animation Value (0 = Front, 180 = Back)
  const flipAnim = useRef(new Animated.Value(0)).current;

  // Session stats
  const [sessionResults, setSessionResults] = useState<{mastered: number, missed: number}>({mastered: 0, missed: 0});

  useEffect(() => {
    if (deckId) {
      // Reset all card statuses for this deck to start fresh
      db.resetDeckCardStatuses(deckId).then(() => {
        return db.getCardsForDeck(deckId, Number(count) || 10);
      }).then(fetchedCards => {
        setCards(fetchedCards);
        setLoading(false);
      });
    }
  }, [deckId]);

  const flipCard = () => {
    if (isFlipped) return;
    setIsFlipped(true);
    Animated.spring(flipAnim, {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  };

  const resetCard = (callback: () => void) => {
    setIsFlipped(false);
    // Instant reset for next card, could animate back if desired
    flipAnim.setValue(0);
    callback();
  };

  const handleNext = async (result: 'missed' | 'mastered') => {
    setSessionResults(prev => ({ ...prev, [result]: prev[result] + 1 }));

    if (cards[currentIndex]) {
      const newStatus = result === 'mastered' ? 'mastered' : 'hard';
      await db.updateCardStatus(cards[currentIndex].id, newStatus);
    }

    if (currentIndex < cards.length - 1) {
      resetCard(() => setCurrentIndex(prev => prev + 1));
    } else {
      const finalMastered = result === 'mastered' ? sessionResults.mastered + 1 : sessionResults.mastered;
      const finalMissed = result === 'missed' ? sessionResults.missed + 1 : sessionResults.missed;

      if (deckId) {
        await db.updateDeckProgress(deckId);
      }

      navigation.replace('Summary', { 
        total: cards.length, 
        mastered: finalMastered, 
        missed: finalMissed 
      });
    }
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [1, 0]
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [89, 90],
    outputRange: [0, 1]
  });

  if (loading) return <View style={styles.center}><Text style={{ color: colors.text }}>{t('loading')}</Text></View>;
  if (!cards.length) return <View style={styles.center}><Text style={{ color: colors.text }}>No cards found.</Text></View>;

  const currentCard = cards[currentIndex];

  return (
    <Layout hideNav>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Library')} style={[styles.closeBtn, { backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
            <MaterialIcons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.progressWrapper}>
            <View style={styles.progressLabels}>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>{t('progress')}</Text>
              <Text style={[styles.progressCount, { color: colors.text }]}>{currentIndex + 1} {t('cardOf')} {cards.length}</Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.background === '#23220f' ? '#333' : '#e9e8ce' }]}>
              <View style={[styles.progressFill, { width: `${(currentIndex / cards.length) * 100}%` }]} />
            </View>
          </View>
        </View>

        {/* Card Container */}
        <View style={styles.cardContainer}>
          <TouchableOpacity 
            activeOpacity={1} 
            onPress={flipCard}
            style={styles.cardWrapper}
          >
            {/* Front Card */}
            <Animated.View style={[styles.card, styles.cardFront, {
              transform: [{ rotateY: frontInterpolate }],
              opacity: frontOpacity,
              backgroundColor: colors.background === '#23220f' ? '#2d2c15' : '#ffffff',
              borderColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: colors.background === '#23220f' ? 0.5 : 0.08,
              shadowRadius: 40,
              elevation: 10,
            }]}>
              <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name="help-outline" size={32} color={colors.background === '#23220f' ? COLORS.primary : '#ca8a04'} />
                </View>
                <Text style={[styles.questionText, { color: colors.text }]}>{currentCard.question}</Text>
                <Text style={[styles.tapText, { color: colors.textSecondary }]}>{t('showAnswer')}</Text>
              </ScrollView>
            </Animated.View>

            {/* Back Card */}
            <Animated.View style={[styles.card, styles.cardBack, {
              transform: [{ rotateY: backInterpolate }],
              opacity: backOpacity,
              backgroundColor: colors.background === '#23220f' ? '#2d2c15' : '#ffffff',
              borderColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: colors.background === '#23220f' ? 0.5 : 0.08,
              shadowRadius: 40,
              elevation: 10,
            }]}>
              <View style={[styles.recapBar, {
                backgroundColor: colors.background === '#23220f' ? 'rgba(0,0,0,0.2)' : 'rgba(248,248,245,0.3)',
                borderBottomColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
              }]}>
                <MaterialIcons name="help-outline" size={16} color={colors.background === '#23220f' ? COLORS.primary : '#ca8a04'} />
                <Text style={[styles.recapLabel, { color: colors.textSecondary }]}>{t('questionCount')}</Text>
                <Text numberOfLines={1} style={[styles.recapText, { color: colors.text, opacity: 0.6 }]}>{currentCard.question}</Text>
              </View>

              <ScrollView style={styles.answerContent} showsVerticalScrollIndicator={false}>
                <View style={styles.answerHeader}>
                   <MaterialIcons name="check-circle" size={16} color={colors.background === '#23220f' ? COLORS.primary : '#ca8a04'} />
                   <Text style={[styles.answerLabel, { color: colors.background === '#23220f' ? COLORS.primary : '#ca8a04' }]}>Answer</Text>
                </View>
                <Text style={[styles.answerText, { color: colors.text }]}>{currentCard.answer}</Text>
              </ScrollView>

              <View style={[styles.sourceBar, { borderTopColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}>
                <MaterialIcons name="menu-book" size={14} color={colors.textSecondary} />
                <Text style={[styles.sourceText, { color: colors.textSecondary }]}>Source: AI Generated</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Actions Footer */}
        <View style={[styles.footer, { opacity: isFlipped ? 1 : 0 }]}>
           <TouchableOpacity
             onPress={() => isFlipped && handleNext('missed')}
             style={[styles.actionBtn, {
               backgroundColor: colors.background === '#23220f' ? 'rgba(254, 226, 226, 0.1)' : '#fee2e2',
               borderColor: 'transparent',
             }]}
             disabled={!isFlipped}
           >
              <MaterialIcons name="close" size={24} color={colors.background === '#23220f' ? '#fca5a5' : '#991b1b'} />
              <Text style={[styles.missedText, { color: colors.background === '#23220f' ? '#fca5a5' : '#991b1b' }]}>{t('incorrect')}</Text>
           </TouchableOpacity>

           <TouchableOpacity
             onPress={() => isFlipped && handleNext('mastered')}
             style={[styles.actionBtn, {
               backgroundColor: colors.background === '#23220f' ? 'rgba(204, 251, 241, 0.1)' : '#ccfbf1',
               borderColor: 'transparent',
             }]}
             disabled={!isFlipped}
           >
              <MaterialIcons name="check" size={24} color={colors.background === '#23220f' ? '#5eead4' : '#115e59'} />
              <Text style={[styles.masteredText, { color: colors.background === '#23220f' ? '#5eead4' : '#115e59' }]}>{t('correct')}</Text>
           </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  closeBtn: { padding: 8, borderRadius: 20 },
  progressWrapper: { flex: 1, marginLeft: 16 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 10, textTransform: 'uppercase', fontWeight: 'bold' },
  progressCount: { fontSize: 10, fontWeight: 'bold' },
  progressBar: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },
  
  cardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardWrapper: { width: '100%', aspectRatio: 4/5 },
  card: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
  },
  cardFront: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  cardBack: {
    
  },
  cardContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  iconCircle: {
    padding: 16,
    backgroundColor: 'rgba(249, 245, 6, 0.1)',
    borderRadius: 50,
    marginBottom: 24,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 28,
  },
  tapText: {
    marginTop: 32,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  recapBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    gap: 8,
  },
  recapLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  recapText: { flex: 1, fontSize: 12 },
  
  answerContent: { flex: 1, paddingHorizontal: 32, paddingTop: 32, paddingBottom: 16 },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  answerLabel: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  answerText: { fontSize: 18, fontWeight: '600', lineHeight: 26 },
  sourceBar: { paddingHorizontal: 32, paddingVertical: 16, borderTopWidth: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  sourceText: { fontSize: 12 },

  footer: { flexDirection: 'row', gap: 16, marginTop: 24 },
  actionBtn: { flex: 1, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 2 },
  missedText: { fontSize: 16, fontWeight: 'bold' },
  masteredText: { fontSize: 16, fontWeight: 'bold' },
});
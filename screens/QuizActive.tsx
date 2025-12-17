import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions, ScrollView } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../services/db';
import { Card } from '../types';
import { useTranslation } from '../services/i18n';

const { width } = Dimensions.get('window');

export const QuizActive: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation();
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
        await db.updateDeckProgress(deckId, finalMastered, finalMastered + finalMissed);
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

  if (loading) return <View style={styles.center}><Text style={styles.textWhite}>{t('loading')}</Text></View>;
  if (!cards.length) return <View style={styles.center}><Text style={styles.textWhite}>No cards found.</Text></View>;

  const currentCard = cards[currentIndex];

  return (
    <Layout hideNav>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Library')} style={styles.closeBtn}>
            <MaterialIcons name="close" size={24} color="#888" />
          </TouchableOpacity>
          <View style={styles.progressWrapper}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressLabel}>{t('progress')}</Text>
              <Text style={styles.progressCount}>{currentIndex + 1} {t('cardOf')} {cards.length}</Text>
            </View>
            <View style={styles.progressBar}>
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
            <Animated.View style={[styles.card, styles.cardFront, { transform: [{ rotateY: frontInterpolate }], opacity: frontOpacity }]}>
              <ScrollView contentContainerStyle={styles.cardContent} showsVerticalScrollIndicator={false}>
                <View style={styles.iconCircle}>
                  <MaterialIcons name="help-outline" size={32} color={COLORS.primary} />
                </View>
                <Text style={styles.questionText}>{currentCard.question}</Text>
                <Text style={styles.tapText}>{t('showAnswer')}</Text>
              </ScrollView>
            </Animated.View>

            {/* Back Card */}
            <Animated.View style={[styles.card, styles.cardBack, { transform: [{ rotateY: backInterpolate }], opacity: backOpacity }]}>
              <View style={styles.recapBar}>
                <MaterialIcons name="help-outline" size={16} color={COLORS.primary} />
                <Text style={styles.recapLabel}>{t('questionCount')}</Text>
                <Text numberOfLines={1} style={styles.recapText}>{currentCard.question}</Text>
              </View>

              <ScrollView style={styles.answerContent} showsVerticalScrollIndicator={false}>
                <View style={styles.answerHeader}>
                   <MaterialIcons name="check-circle" size={16} color={COLORS.primary} />
                   <Text style={styles.answerLabel}>Answer</Text>
                </View>
                <Text style={styles.answerText}>{currentCard.answer}</Text>
              </ScrollView>

              <View style={styles.sourceBar}>
                <MaterialIcons name="menu-book" size={14} color="#666" />
                <Text style={styles.sourceText}>Source: AI Generated</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </View>

        {/* Actions Footer */}
        <View style={[styles.footer, { opacity: isFlipped ? 1 : 0 }]}>
           <TouchableOpacity 
             onPress={() => isFlipped && handleNext('missed')}
             style={[styles.actionBtn, styles.missedBtn]}
             disabled={!isFlipped}
           >
              <MaterialIcons name="close" size={24} color="#991b1b" />
              <Text style={styles.missedText}>{t('incorrect')}</Text>
           </TouchableOpacity>

           <TouchableOpacity 
             onPress={() => isFlipped && handleNext('mastered')}
             style={[styles.actionBtn, styles.masteredBtn]}
             disabled={!isFlipped}
           >
              <MaterialIcons name="check" size={24} color="#115e59" />
              <Text style={styles.masteredText}>{t('correct')}</Text>
           </TouchableOpacity>
        </View>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.bgDark },
  textWhite: { color: 'white' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  closeBtn: { padding: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 20 },
  progressWrapper: { flex: 1, marginLeft: 16 },
  progressLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  progressLabel: { fontSize: 10, color: '#666', textTransform: 'uppercase', fontWeight: 'bold' },
  progressCount: { fontSize: 10, color: '#aaa', fontWeight: 'bold' },
  progressBar: { height: 6, backgroundColor: '#333', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: COLORS.primary },
  
  cardContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  cardWrapper: { width: '100%', aspectRatio: 4/5 },
  card: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#2d2c15',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
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
    color: 'white',
    textAlign: 'center',
    lineHeight: 28,
  },
  tapText: {
    marginTop: 32,
    fontSize: 12,
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: 'bold',
  },
  recapBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    gap: 8,
  },
  recapLabel: { fontSize: 10, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
  recapText: { flex: 1, fontSize: 12, color: '#aaa' },
  
  answerContent: { flex: 1, paddingHorizontal: 32, paddingTop: 32, paddingBottom: 16 },
  answerHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  answerLabel: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary, textTransform: 'uppercase' },
  answerText: { fontSize: 18, fontWeight: '600', color: 'white', lineHeight: 26 },
  sourceBar: { paddingHorizontal: 32, paddingVertical: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)', flexDirection: 'row', alignItems: 'center', gap: 6 },
  sourceText: { fontSize: 12, color: '#666' },

  footer: { flexDirection: 'row', gap: 16, marginTop: 24 },
  actionBtn: { flex: 1, height: 72, borderRadius: 20, alignItems: 'center', justifyContent: 'center', gap: 4, borderWidth: 2, borderColor: 'transparent' },
  missedBtn: { backgroundColor: 'rgba(254, 226, 226, 0.1)' },
  masteredBtn: { backgroundColor: 'rgba(204, 251, 241, 0.1)' },
  missedText: { fontSize: 16, fontWeight: 'bold', color: '#fca5a5' },
  masteredText: { fontSize: 16, fontWeight: 'bold', color: '#5eead4' },
});
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../services/db';
import { Card } from '../types';
import { useTheme } from '../services/theme';

export const ReviewMissed: React.FC = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    db.getHardCards().then(setCards);
  }, []);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
        setCurrentIndex(0);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
    }
  };

  if (cards.length === 0) {
      return (
        <Layout hideNav>
            <View style={styles.center}>
                <MaterialIcons name="check-circle" size={64} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                <Text style={[styles.title, { color: colors.text }]}>No missed cards!</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Library')} style={{ marginTop: 20 }}>
                    <Text style={{ color: COLORS.primary, fontWeight: 'bold' }}>Back to Library</Text>
                </TouchableOpacity>
            </View>
        </Layout>
      )
  }

  const currentCard = cards[currentIndex];

  return (
    <Layout hideNav>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.iconBtn, { backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                <MaterialIcons name="arrow-back" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconBtn, { backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}>
                <MaterialIcons name="more-vert" size={24} color={colors.text} />
            </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
            <Text style={[styles.title, { color: colors.text }]}>Review Missed</Text>
            <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={[styles.badgeText, { color: colors.textSecondary }]}>{cards.length} Cards marked as Hard</Text>
            </View>
        </View>

        <View style={styles.cardContainer}>
            {/* Main Card */}
            <View style={[styles.card, {
              backgroundColor: colors.background === '#23220f' ? '#2d2c15' : '#ffffff',
              borderColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: colors.background === '#23220f' ? 0.5 : 0.08,
              shadowRadius: 40,
              elevation: 10,
            }]}>
                <View style={[styles.missedLabel, {
                  backgroundColor: colors.background === '#23220f' ? 'rgba(254, 226, 226, 0.1)' : '#fee2e2',
                  borderColor: colors.background === '#23220f' ? 'rgba(220, 38, 38, 0.3)' : 'rgba(220, 38, 38, 0.2)',
                }]}>
                    <MaterialIcons name="warning" size={14} color={colors.background === '#23220f' ? '#fca5a5' : '#991b1b'} />
                    <Text style={[styles.missedText, { color: colors.background === '#23220f' ? '#fca5a5' : '#991b1b' }]}>Missed</Text>
                </View>

                <ScrollView style={styles.contentSection} showsVerticalScrollIndicator={false}>
                    <Text style={[styles.label, { color: colors.textSecondary }]}>Question</Text>
                    <Text style={[styles.questionText, { color: colors.text }]}>{currentCard.question}</Text>

                    <View style={[styles.divider, { backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />

                    <Text style={[styles.label, { color: colors.textSecondary }]}>Answer</Text>
                    <Text style={[styles.answerText, { color: colors.background === '#23220f' ? '#ccc' : colors.text }]}>{currentCard.answer}</Text>
                </ScrollView>

                <View style={styles.dots}>
                    {cards.map((_, i) => (
                        <View key={i} style={[
                          styles.dot,
                          { backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
                          i === currentIndex && { backgroundColor: colors.background === '#23220f' ? 'white' : colors.text }
                        ]} />
                    ))}
                </View>
            </View>

            {/* Nav Btns */}
            <TouchableOpacity
                style={[styles.navBtn, styles.leftBtn, { backgroundColor: colors.background === '#23220f' ? '#333' : '#e5e5e5' }, currentIndex === 0 && styles.disabledBtn]}
                onPress={handleBack}
                disabled={currentIndex === 0}
            >
                <MaterialIcons name="chevron-left" size={24} color={colors.text} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.navBtn, styles.rightBtn, { backgroundColor: colors.background === '#23220f' ? '#333' : '#e5e5e5' }]}
                onPress={handleNext}
            >
                <MaterialIcons name="chevron-right" size={24} color={colors.text} />
            </TouchableOpacity>
        </View>

        <View style={styles.footer}>
             <TouchableOpacity style={[styles.primaryBtn, {
               shadowColor: '#FFE500',
               shadowOffset: { width: 0, height: 4 },
               shadowOpacity: 0.3,
               shadowRadius: 12,
               elevation: 6,
             }]}>
                <MaterialIcons name="refresh" size={24} color="#1c1c0d" />
                <Text style={styles.btnTextDark}>Re-quiz All</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.textBtn} onPress={() => navigation.navigate('Summary')}>
                <Text style={[styles.textBtnText, { color: colors.textSecondary }]}>Back to Session Summary</Text>
             </TouchableOpacity>
        </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  titleSection: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fca5a5' },
  badgeText: { fontWeight: '600' },

  cardContainer: { flex: 1, marginHorizontal: 24, justifyContent: 'center' },
  card: { borderRadius: 32, padding: 32, minHeight: 400, borderWidth: 1 },
  missedLabel: { position: 'absolute', top: 24, right: 24, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  missedText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },

  contentSection: { flex: 1, paddingBottom: 16 },
  label: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  questionText: { fontSize: 18, fontWeight: 'bold', marginBottom: 24 },
  divider: { height: 1, marginBottom: 24 },
  answerText: { fontSize: 16, lineHeight: 24 },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 },
  dot: { width: 6, height: 6, borderRadius: 3 },

  navBtn: { position: 'absolute', top: '50%', width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', shadowColor: 'black', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5, marginTop: -24 },
  leftBtn: { left: -12 },
  rightBtn: { right: -12 },
  disabledBtn: { opacity: 0.5 },

  footer: { padding: 24, paddingBottom: 40, gap: 16 },
  primaryBtn: { height: 56, backgroundColor: COLORS.primary, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnTextDark: { color: '#1c1c0d', fontSize: 16, fontWeight: 'bold' },
  textBtn: { alignItems: 'center', padding: 8 },
  textBtnText: { fontWeight: 'bold' },
});
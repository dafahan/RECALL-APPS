import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { db } from '../services/db';
import { Card } from '../types';

export const ReviewMissed: React.FC = () => {
  const navigation = useNavigation<any>();
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
                <MaterialIcons name="check-circle" size={64} color="#444" style={{ marginBottom: 16 }} />
                <Text style={styles.title}>No missed cards!</Text>
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
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
                <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
                <MaterialIcons name="more-vert" size={24} color="white" />
            </TouchableOpacity>
        </View>

        <View style={styles.titleSection}>
            <Text style={styles.title}>Review Missed</Text>
            <View style={styles.badge}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>{cards.length} Cards marked as Hard</Text>
            </View>
        </View>

        <View style={styles.cardContainer}>
            {/* Main Card */}
            <View style={styles.card}>
                <View style={styles.missedLabel}>
                    <MaterialIcons name="warning" size={14} color="#991b1b" />
                    <Text style={styles.missedText}>Missed</Text>
                </View>

                <View style={styles.contentSection}>
                    <Text style={styles.label}>Question</Text>
                    <Text style={styles.questionText}>{currentCard.question}</Text>
                    
                    <View style={styles.divider} />
                    
                    <Text style={styles.label}>Answer</Text>
                    <Text style={styles.answerText}>{currentCard.answer}</Text>
                </View>

                <View style={styles.dots}>
                    {cards.map((_, i) => (
                        <View key={i} style={[styles.dot, i === currentIndex && styles.activeDot]} />
                    ))}
                </View>
            </View>
            
            {/* Nav Btns */}
            <TouchableOpacity 
                style={[styles.navBtn, styles.leftBtn, currentIndex === 0 && styles.disabledBtn]} 
                onPress={handleBack}
                disabled={currentIndex === 0}
            >
                <MaterialIcons name="chevron-left" size={24} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.navBtn, styles.rightBtn]} 
                onPress={handleNext}
            >
                <MaterialIcons name="chevron-right" size={24} color="white" />
            </TouchableOpacity>
        </View>

        <View style={styles.footer}>
             <TouchableOpacity style={styles.primaryBtn}>
                <MaterialIcons name="refresh" size={24} color="black" />
                <Text style={styles.btnTextDark}>Re-quiz All</Text>
             </TouchableOpacity>
             <TouchableOpacity style={styles.textBtn} onPress={() => navigation.navigate('Summary')}>
                <Text style={styles.textBtnText}>Back to Session Summary</Text>
             </TouchableOpacity>
        </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16 },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  titleSection: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fca5a5' },
  badgeText: { color: '#888', fontWeight: '600' },
  
  cardContainer: { flex: 1, marginHorizontal: 24, justifyContent: 'center' },
  card: { backgroundColor: '#2d2c15', borderRadius: 32, padding: 32, minHeight: 400, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  missedLabel: { position: 'absolute', top: 24, right: 24, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(254, 226, 226, 0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(220, 38, 38, 0.3)' },
  missedText: { color: '#fca5a5', fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  
  contentSection: { flex: 1, justifyContent: 'center' },
  label: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', color: '#666', marginBottom: 8, letterSpacing: 1 },
  questionText: { fontSize: 22, fontWeight: 'bold', color: 'white', marginBottom: 24 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginBottom: 24 },
  answerText: { fontSize: 18, color: '#ccc', lineHeight: 26 },

  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.1)' },
  activeDot: { backgroundColor: 'white' },

  navBtn: { position: 'absolute', top: '50%', width: 48, height: 48, borderRadius: 24, backgroundColor: '#333', alignItems: 'center', justifyContent: 'center', shadowColor: 'black', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5, marginTop: -24 },
  leftBtn: { left: -12 },
  rightBtn: { right: -12 },
  disabledBtn: { opacity: 0.5 },

  footer: { padding: 24, paddingBottom: 40, gap: 16 },
  primaryBtn: { height: 56, backgroundColor: COLORS.primary, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnTextDark: { color: 'black', fontSize: 16, fontWeight: 'bold' },
  textBtn: { alignItems: 'center', padding: 8 },
  textBtnText: { color: '#888', fontWeight: 'bold' },
});
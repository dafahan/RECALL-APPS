import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export const QuizSetup: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { deckId, topic } = route.params || {};
  
  const [cardCount, setCardCount] = useState(10);
  const isNewDeck = deckId === 'new';
  const displayTopic = topic || "General Knowledge";

  const handleStart = () => {
    if (isNewDeck) {
      navigation.navigate('Processing', { 
        topic: displayTopic,
        count: cardCount 
      });
    } else {
      navigation.navigate('QuizActive', { deckId, count: cardCount });
    }
  };

  return (
    <Layout>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <MaterialIcons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn}>
          <MaterialIcons name="more-vert" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: 'https://picsum.photos/400/300?blur=5' }} 
            style={styles.headerImage} 
          />
          <LinearGradient
            colors={['transparent', COLORS.bgDark]}
            style={styles.imageGradient}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            {isNewDeck ? 'New Session' : 'Ready to Recall?'}
          </Text>
          <Text style={styles.subtitle}>
             {isNewDeck ? `Generating cards for: ${displayTopic.slice(0, 20)}...` : 'Customize your experience'}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Study Depth</Text>
          <View style={styles.optionsGrid}>
            {[5, 10, 15].map(val => (
              <TouchableOpacity 
                key={val} 
                onPress={() => setCardCount(val)}
                style={[
                  styles.optionCard, 
                  cardCount === val && styles.optionCardActive
                ]}
              >
                <Text style={[styles.optionValue, cardCount === val && styles.optionValueActive]}>
                  {val}
                </Text>
                <Text style={styles.optionLabel}>Cards</Text>
                {cardCount === val && (
                  <View style={styles.checkIcon}>
                     <MaterialIcons name="check-circle" size={18} color="black" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons name="info" size={20} color="#888" />
          <Text style={styles.infoText}>
            Short sessions are best for daily retention. {cardCount} cards take ~{Math.ceil(cardCount * 0.5)}m.
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          onPress={handleStart}
          style={styles.startBtn}
          activeOpacity={0.9}
        >
          <MaterialIcons name={isNewDeck ? "auto-awesome" : "flash-on"} size={24} color="#1c1c0d" />
          <Text style={styles.startBtnText}>{isNewDeck ? 'Process & Generate' : 'Start Quiz'}</Text>
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
    backgroundColor: 'rgba(0,0,0,0.3)',
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
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
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
    height: 110,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
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
    color: 'white',
  },
  optionValueActive: {
    color: '#1c1c0d',
  },
  optionLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: '#888',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#888',
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
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Layout } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { db } from '../services/db';
import { Deck } from '../types';
import { COLORS } from '../components/Layout';

export const Library: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const [decks, setDecks] = useState<Deck[]>([]);

  useEffect(() => {
    if (isFocused) {
      db.getDecks().then(setDecks);
    }
  }, [isFocused]);

  const getColor = (colorClass: string) => {
    if (colorClass.includes('yellow')) return 'rgba(234, 179, 8, 0.2)';
    if (colorClass.includes('green')) return 'rgba(34, 197, 94, 0.2)';
    if (colorClass.includes('purple')) return 'rgba(168, 85, 247, 0.2)';
    return 'rgba(255,255,255,0.1)';
  };

  const getIconColor = (colorClass: string) => {
    if (colorClass.includes('yellow')) return '#ca8a04';
    if (colorClass.includes('green')) return '#16a34a';
    if (colorClass.includes('purple')) return '#9333ea';
    return '#888';
  };

  return (
    <Layout>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Library</Text>
          <TouchableOpacity style={styles.iconBtn}>
            <MaterialIcons name="tune" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search your PDFs & History..."
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')}
          style={styles.uploadBtn}
        >
          <MaterialIcons name="add" size={24} color="#1c1c0d" />
          <Text style={styles.uploadBtnText}>Upload New PDF</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Text style={styles.viewAll}>View All</Text>
        </View>

        <View style={styles.deckList}>
          {decks.map(deck => (
            <View key={deck.id} style={styles.deckCard}>
              <View style={styles.cardHeader}>
                <View style={[styles.deckIcon, { backgroundColor: getColor(deck.colorClass) }]}>
                  <MaterialIcons name={deck.icon as any} size={28} color={getIconColor(deck.colorClass)} />
                </View>
                <View style={styles.headerText}>
                  <Text style={styles.deckTitle} numberOfLines={1}>{deck.title}</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.statusText}>{deck.status}</Text>
                    {deck.lastStudied && (
                      <>
                        <View style={styles.dot} />
                        <Text style={styles.statusText}>{deck.lastStudied}</Text>
                      </>
                    )}
                  </View>
                </View>
                <TouchableOpacity>
                   <MaterialIcons name="more-vert" size={20} color="#666" />
                </TouchableOpacity>
              </View>

              {deck.status === 'In Progress' && deck.progress > 0 && (
                <View style={styles.progressContainer}>
                  <View style={styles.track}>
                    <View style={[styles.fill, { width: `${deck.progress}%` }]} />
                  </View>
                  <Text style={styles.progressText}>{deck.progress}% Complete</Text>
                </View>
              )}

              <View style={styles.actions}>
                {deck.status === 'New' ? (
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('QuizSetup', { deckId: deck.id })} 
                    style={styles.actionBtnPrimary}
                  >
                    <MaterialIcons name="school" size={20} color="#1c1c0d" />
                    <Text style={styles.btnTextPrimary}>Start New Session</Text>
                  </TouchableOpacity>
                ) : (
                  <>
                    <TouchableOpacity 
                      onPress={() => navigation.navigate(deck.progress < 30 ? 'ReviewMissed' : 'QuizSetup', { deckId: deck.id })}
                      style={styles.actionBtnSecondary}
                    >
                      <MaterialIcons name="play-arrow" size={20} color="white" />
                      <Text style={styles.btnTextSecondary}>Continue</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionBtnOutline}>
                      <MaterialIcons name="info-outline" size={20} color="#aaa" />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: { padding: 24, paddingBottom: 16, backgroundColor: 'rgba(35, 34, 15, 0.95)' },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: 'white' },
  iconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, paddingHorizontal: 12 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, color: 'white', fontSize: 16 },
  
  scrollContent: { padding: 24, paddingBottom: 100 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, padding: 16, borderRadius: 16, gap: 8, marginBottom: 32 },
  uploadBtnText: { fontSize: 16, fontWeight: 'bold', color: '#1c1c0d' },
  
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
  viewAll: { fontSize: 12, color: COLORS.primary, fontWeight: 'bold' },
  
  deckList: { gap: 20 },
  deckCard: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 20 },
  cardHeader: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  deckIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, justifyContent: 'center' },
  deckTitle: { fontSize: 18, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontSize: 12, color: '#888' },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#666' },
  
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  track: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.primary },
  progressText: { fontSize: 12, fontWeight: 'bold', color: '#888' },
  
  actions: { flexDirection: 'row', gap: 12 },
  actionBtnPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, padding: 12, borderRadius: 12, gap: 8 },
  btnTextPrimary: { fontSize: 14, fontWeight: 'bold', color: '#1c1c0d' },
  actionBtnSecondary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 12, gap: 8 },
  btnTextSecondary: { fontSize: 14, fontWeight: 'bold', color: 'white' },
  actionBtnOutline: { width: 48, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12 },
});
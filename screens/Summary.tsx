import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

export const Summary: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { total = 10, mastered = 0, missed = 0 } = route.params || {};

  return (
    <Layout hideNav>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Session Complete!</Text>
        <MaterialIcons name="more-horiz" size={24} color="white" />
      </View>

      <View style={styles.content}>
        {/* Placeholder for Circular Progress - keeping it simple for RN without SVG lib */}
        <View style={styles.scoreCircle}>
           <Text style={styles.scoreBig}>{mastered}<Text style={styles.scoreTotal}>/{total}</Text></Text>
           <View style={styles.scoreTag}>
             <MaterialIcons name="trending-up" size={16} color="white" />
             <Text style={styles.scoreLabel}>Score</Text>
           </View>
        </View>

        <Text style={styles.greatJob}>Nice work!</Text>
        <Text style={styles.summaryText}>
          You mastered <Text style={styles.bold}>{mastered} concepts</Text> and need to review <Text style={styles.bold}>{missed}</Text>.
        </Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { borderColor: 'rgba(34, 197, 94, 0.2)' }]}>
             <View style={[styles.iconBox, { backgroundColor: 'rgba(34, 197, 94, 0.2)' }]}>
                <MaterialIcons name="check" size={24} color="#4ade80" />
             </View>
             <Text style={styles.statLabel}>Mastered</Text>
             <Text style={styles.statValue}>{mastered}</Text>
          </View>
          <View style={[styles.statCard, { borderColor: 'rgba(248, 113, 113, 0.2)' }]}>
             <View style={[styles.iconBox, { backgroundColor: 'rgba(248, 113, 113, 0.2)' }]}>
                <MaterialIcons name="restart-alt" size={24} color="#f87171" />
             </View>
             <Text style={styles.statLabel}>To Review</Text>
             <Text style={styles.statValue}>{missed}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.primaryBtn}
          onPress={() => navigation.navigate('ReviewMissed')}
        >
          <MaterialIcons name="history-edu" size={24} color="black" />
          <Text style={styles.btnTextDark}>Review Missed Cards</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.btnTextLight}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  
  scoreCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 8, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  scoreBig: { fontSize: 56, fontWeight: 'bold', color: 'white' },
  scoreTotal: { fontSize: 24, color: '#666' },
  scoreTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4, marginTop: 8 },
  scoreLabel: { color: 'white', fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },

  greatJob: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 8 },
  summaryText: { textAlign: 'center', color: '#aaa', fontSize: 16, maxWidth: 260, lineHeight: 24, marginBottom: 40 },
  bold: { color: 'white', fontWeight: 'bold' },

  statsGrid: { flexDirection: 'row', gap: 16, width: '100%' },
  statCard: { flex: 1, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 24, padding: 20, borderWidth: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statLabel: { color: '#888', fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  statValue: { color: 'white', fontSize: 32, fontWeight: 'bold' },

  footer: { padding: 24, paddingBottom: 40, gap: 16 },
  primaryBtn: { height: 56, backgroundColor: COLORS.primary, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnTextDark: { color: 'black', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: { height: 56, borderWidth: 2, borderColor: 'rgba(255,255,255,0.1)', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  btnTextLight: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});
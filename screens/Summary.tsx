import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../services/theme';

export const Summary: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { colors } = useTheme();
  const { total = 10, mastered = 0, missed = 0 } = route.params || {};

  return (
    <Layout hideNav>
      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Session Complete!</Text>
        <MaterialIcons name="more-horiz" size={24} color={colors.text} />
      </View>

      <View style={styles.content}>
        {/* Placeholder for Circular Progress - keeping it simple for RN without SVG lib */}
        <View style={[styles.scoreCircle, { borderColor: COLORS.primary }]}>
           <Text style={[styles.scoreBig, { color: colors.text }]}>{mastered}<Text style={[styles.scoreTotal, { color: colors.textSecondary }]}>/{total}</Text></Text>
           <View style={[styles.scoreTag, { backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(249,245,6,0.2)' }]}>
             <MaterialIcons name="trending-up" size={16} color={colors.background === '#23220f' ? colors.text : '#1c1c0d'} />
             <Text style={[styles.scoreLabel, { color: colors.background === '#23220f' ? colors.text : '#1c1c0d' }]}>Score</Text>
           </View>
        </View>

        <Text style={[styles.greatJob, { color: colors.text }]}>Nice work!</Text>
        <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
          You mastered <Text style={[styles.bold, { color: colors.text }]}>{mastered} concepts</Text> and need to review <Text style={[styles.bold, { color: colors.text }]}>{missed}</Text>.
        </Text>

        <View style={styles.statsGrid}>
          <View style={[styles.statCard, {
            backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.05)' : '#ffffff',
            borderColor: colors.background === '#23220f' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0,0,0,0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: colors.background === '#23220f' ? 0 : 0.05,
            shadowRadius: 4,
            elevation: colors.background === '#23220f' ? 0 : 2,
          }]}>
             <View style={[styles.iconBox, {
               backgroundColor: colors.background === '#23220f' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.1)'
             }]}>
                <MaterialIcons name="check" size={24} color={colors.background === '#23220f' ? '#4ade80' : '#22c55e'} />
             </View>
             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Mastered</Text>
             <Text style={[styles.statValue, { color: colors.text }]}>{mastered}</Text>
          </View>
          <View style={[styles.statCard, {
            backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.05)' : '#ffffff',
            borderColor: colors.background === '#23220f' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(0,0,0,0.05)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: colors.background === '#23220f' ? 0 : 0.05,
            shadowRadius: 4,
            elevation: colors.background === '#23220f' ? 0 : 2,
          }]}>
             <View style={[styles.iconBox, {
               backgroundColor: colors.background === '#23220f' ? 'rgba(248, 113, 113, 0.2)' : 'rgba(248, 113, 113, 0.1)'
             }]}>
                <MaterialIcons name="restart-alt" size={24} color={colors.background === '#23220f' ? '#f87171' : '#ef4444'} />
             </View>
             <Text style={[styles.statLabel, { color: colors.textSecondary }]}>To Review</Text>
             <Text style={[styles.statValue, { color: colors.text }]}>{missed}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.primaryBtn, {
            shadowColor: '#FFE500',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 6,
          }]}
          onPress={() => navigation.navigate('ReviewMissed')}
        >
          <MaterialIcons name="history-edu" size={24} color="#1c1c0d" />
          <Text style={styles.btnTextDark}>Review Missed Cards</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryBtn, {
            borderColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            backgroundColor: colors.background === '#23220f' ? 'transparent' : 'transparent',
          }]}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={[styles.btnTextLight, { color: colors.text }]}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },

  scoreCircle: { width: 200, height: 200, borderRadius: 100, borderWidth: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  scoreBig: { fontSize: 56, fontWeight: 'bold' },
  scoreTotal: { fontSize: 24 },
  scoreTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 4, marginTop: 8 },
  scoreLabel: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },

  greatJob: { fontSize: 28, fontWeight: 'bold', marginBottom: 8 },
  summaryText: { textAlign: 'center', fontSize: 16, maxWidth: 260, lineHeight: 24, marginBottom: 40 },
  bold: { fontWeight: 'bold' },

  statsGrid: { flexDirection: 'row', gap: 16, width: '100%' },
  statCard: { flex: 1, borderRadius: 24, padding: 20, borderWidth: 1 },
  iconBox: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  statLabel: { fontSize: 12, fontWeight: 'bold', marginBottom: 4 },
  statValue: { fontSize: 32, fontWeight: 'bold' },

  footer: { padding: 24, paddingBottom: 40, gap: 16 },
  primaryBtn: { height: 56, backgroundColor: COLORS.primary, borderRadius: 28, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnTextDark: { color: '#1c1c0d', fontSize: 16, fontWeight: 'bold' },
  secondaryBtn: { height: 56, borderWidth: 2, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  btnTextLight: { fontSize: 16, fontWeight: 'bold' },
});
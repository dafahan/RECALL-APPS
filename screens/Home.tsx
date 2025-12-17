import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Layout, COLORS } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

export const Home: React.FC = () => {
  const navigation = useNavigation<any>();

  const handleUpload = () => {
    // Flow: Upload -> Setup -> Processing -> Active
    // We pass a mock topic to simulate a file being selected
    navigation.navigate('QuizSetup', { 
       deckId: 'new',
       topic: "Introduction to Deep Learning" 
    });
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <MaterialIcons name="psychology" size={24} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>Recall</Text>
          <TouchableOpacity style={styles.historyBtn}>
            <MaterialIcons name="history" size={24} color="#888" />
          </TouchableOpacity>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Simplify your{'\n'}
            <Text style={styles.heroHighlight}>study materials.</Text>
          </Text>
        </View>

        <View style={styles.uploadContainer}>
          <TouchableOpacity 
            onPress={handleUpload}
            activeOpacity={0.9}
            style={styles.uploadCard}
          >
            <LinearGradient
              colors={['#383821', '#2d2c15']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.dashedBorder} />
            
            <View style={styles.iconCircle}>
              <MaterialIcons name="cloud-upload" size={40} color={COLORS.primary} />
            </View>
            
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadTitle}>Tap to Upload PDF</Text>
              <Text style={styles.uploadSubtitle}>Supports PDF, DOCX, TXT</Text>
            </View>

            <View style={styles.selectBtn}>
              <MaterialIcons name="add" size={20} color="#1c1c0d" />
              <Text style={styles.selectBtnText}>Select File</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.privacyBadgeContainer}>
          <View style={styles.privacyBadge}>
            <MaterialIcons name="lock" size={14} color="#888" />
            <Text style={styles.privacyText}>AI-powered processing. Private.</Text>
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100, // Space for BottomNav
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(249, 245, 6, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
  },
  historyBtn: {
    padding: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
  },
  heroSection: {
    marginTop: 20,
    marginBottom: 40,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textDark,
    textAlign: 'center',
    lineHeight: 38,
  },
  heroHighlight: {
    color: COLORS.textDark,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(249, 245, 6, 0.4)',
  },
  uploadContainer: {
    paddingHorizontal: 24,
    marginBottom: 40,
  },
  uploadCard: {
    height: 320,
    borderRadius: 32,
    backgroundColor: COLORS.surfaceDark,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  dashedBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 4,
    borderColor: '#444',
    borderStyle: 'dashed',
    borderRadius: 32,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(249, 245, 6, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  uploadTextContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  uploadSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  selectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },
  selectBtnText: {
    color: '#1c1c0d',
    fontWeight: 'bold',
    fontSize: 14,
  },
  privacyBadgeContainer: {
    alignItems: 'center',
  },
  privacyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  privacyText: {
    fontSize: 12,
    color: '#888',
  },
});
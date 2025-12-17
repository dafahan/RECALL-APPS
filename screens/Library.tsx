import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native';
import { Layout } from '../components/Layout';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { db } from '../services/db';
import { Deck } from '../types';
import { COLORS } from '../components/Layout';
import { useTranslation } from '../services/i18n';
import { useTheme } from '../services/theme';

export const Library: React.FC = () => {
  const navigation = useNavigation<any>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameText, setRenameText] = useState('');

  useEffect(() => {
    if (isFocused) {
      loadDecks();
    }
  }, [isFocused]);

  const loadDecks = async () => {
    const allDecks = await db.getDecks();
    setDecks(allDecks);
  };

  const handleOpenMenu = (deck: Deck) => {
    setSelectedDeck(deck);
    setShowMenu(true);
  };

  const handleRename = () => {
    if (selectedDeck) {
      setRenameText(selectedDeck.title);
      setShowMenu(false);
      setShowRenameModal(true);
    }
  };

  const handleConfirmRename = async () => {
    if (selectedDeck && renameText.trim()) {
      await db.renameDeck(selectedDeck.id, renameText.trim());
      setShowRenameModal(false);
      setSelectedDeck(null);
      setRenameText('');
      loadDecks();
    }
  };

  const handleDelete = () => {
    if (selectedDeck) {
      setShowMenu(false);
      Alert.alert(
        'Delete Deck',
        `Are you sure you want to delete "${selectedDeck.title}"? This will delete all ${selectedDeck.totalCards} cards permanently.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await db.deleteDeck(selectedDeck.id);
              setSelectedDeck(null);
              loadDecks();
            }
          }
        ]
      );
    }
  };

  const filteredDecks = decks.filter(deck =>
    deck.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('library')}</Text>
        </View>
        <View style={[styles.searchContainer, { backgroundColor: colors.card }]}>
          <MaterialIcons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search your decks..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <MaterialIcons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home')}
          style={styles.uploadBtn}
        >
          <MaterialIcons name="add" size={24} color="#1c1c0d" />
          <Text style={styles.uploadBtnText}>{t('uploadNewDocument')}</Text>
        </TouchableOpacity>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery ? `Search Results (${filteredDecks.length})` : t('yourDecks')}
          </Text>
        </View>

        {filteredDecks.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="folder-open" size={64} color="#444" />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No decks found' : t('noDecks')}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? `No decks match "${searchQuery}"`
                : t('createFirst')}
            </Text>
          </View>
        ) : (
          <View style={styles.deckList}>
            {filteredDecks.map(deck => {
              const isCompleted = deck.progress >= 100;
              const showProgress = deck.status === 'In Progress' && deck.progress > 0 && deck.progress < 100;

              return (
                <View key={deck.id} style={[styles.deckCard, { backgroundColor: colors.card }]}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.deckIcon, { backgroundColor: getColor(deck.colorClass) }]}>
                      <MaterialIcons name={deck.icon as any} size={28} color={getIconColor(deck.colorClass)} />
                    </View>
                    <View style={styles.headerText}>
                      <Text style={[styles.deckTitle, { color: colors.text }]} numberOfLines={1}>{deck.title}</Text>
                      <View style={styles.statusRow}>
                        <Text style={[styles.statusText, { color: colors.textSecondary }]}>
                          {deck.totalCards} {t('libraryCards')} • {isCompleted ? t('completed') : `${deck.progress}%`}
                        </Text>
                        {deck.lastStudied && (
                          <>
                            <View style={styles.dot} />
                            <Text style={[styles.statusText, { color: colors.textSecondary }]}>{deck.lastStudied}</Text>
                          </>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleOpenMenu(deck)}
                      style={[styles.menuBtn, { backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }]}
                    >
                      <MaterialIcons name="more-vert" size={20} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>

                  {showProgress && (
                    <View style={styles.progressContainer}>
                      <View style={styles.track}>
                        <View style={[styles.fill, { width: `${deck.progress}%` }]} />
                      </View>
                      <Text style={styles.progressText}>{deck.progress}% Complete</Text>
                    </View>
                  )}

                  <View style={styles.actions}>
                    {isCompleted ? (
                      <TouchableOpacity
                        onPress={() => navigation.navigate('QuizActive', { deckId: deck.id })}
                        style={styles.actionBtnPrimary}
                      >
                        <MaterialIcons name="refresh" size={20} color="#1c1c0d" />
                        <Text style={styles.btnTextPrimary}>Review Again</Text>
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        onPress={() => navigation.navigate('QuizActive', { deckId: deck.id })}
                        style={styles.actionBtnSecondary}
                      >
                        <MaterialIcons name="play-arrow" size={20} color="white" />
                        <Text style={[styles.btnTextSecondary, { color: 'white' }]}>
                          {deck.masteredCount === 0 ? 'Start' : 'Continue'}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View style={[styles.menuModal, {
            backgroundColor: colors.background === '#23220f' ? '#2d2c15' : '#ffffff',
            borderWidth: 1,
            borderColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          }]}>
            <TouchableOpacity style={styles.menuItem} onPress={handleRename}>
              <MaterialIcons name="edit" size={20} color={colors.text} />
              <Text style={[styles.menuText, { color: colors.text }]}>Rename Deck</Text>
            </TouchableOpacity>
            <View style={[styles.menuDivider, { backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }]} />
            <TouchableOpacity style={styles.menuItem} onPress={handleDelete}>
              <MaterialIcons name="delete" size={20} color="#ef4444" />
              <Text style={[styles.menuText, { color: '#ef4444' }]}>Delete Deck</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Rename Modal */}
      <Modal
        visible={showRenameModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowRenameModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowRenameModal(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View style={[styles.renameModal, {
              backgroundColor: colors.background === '#23220f' ? '#2d2c15' : '#ffffff',
              borderWidth: 1,
              borderColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
            }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Rename Deck</Text>
              <TextInput
                style={[styles.renameInput, {
                  color: colors.text,
                  backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.05)' : '#f9f9f9',
                  borderColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                }]}
                value={renameText}
                onChangeText={setRenameText}
                placeholder="Enter new name"
                placeholderTextColor={colors.textSecondary}
                autoFocus
              />
              <View style={styles.modalActions}>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.cancelBtn, { backgroundColor: colors.background === '#23220f' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' }]}
                  onPress={() => setShowRenameModal(false)}
                >
                  <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalBtn, styles.confirmBtn]}
                  onPress={handleConfirmRename}
                >
                  <Text style={styles.confirmBtnText}>Rename</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </Layout>
  );
};

const styles = StyleSheet.create({
  header: { padding: 24, paddingBottom: 16 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  headerTitle: { fontSize: 28, fontWeight: 'bold' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 12
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 16 },

  scrollContent: { padding: 24, paddingBottom: 100 },
  uploadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 16,
    gap: 8,
    marginBottom: 32
  },
  uploadBtnText: { fontSize: 16, fontWeight: 'bold', color: '#1c1c0d' },

  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },

  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#888',
    marginTop: 16,
    marginBottom: 8
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center'
  },

  deckList: { gap: 20 },
  deckCard: { borderRadius: 24, padding: 20 },
  cardHeader: { flexDirection: 'row', gap: 16, marginBottom: 16, alignItems: 'flex-start' },
  deckIcon: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  headerText: { flex: 1, justifyContent: 'center' },
  deckTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statusText: { fontSize: 12 },
  dot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#666' },
  menuBtn: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },

  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  track: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: COLORS.primary },
  progressText: { fontSize: 12, fontWeight: 'bold', color: '#888' },

  actions: { flexDirection: 'row', gap: 12 },
  actionBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 12,
    gap: 8
  },
  btnTextPrimary: { fontSize: 14, fontWeight: 'bold', color: '#1c1c0d' },
  actionBtnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.9)',
    padding: 12,
    borderRadius: 12,
    gap: 8
  },
  btnTextSecondary: { fontSize: 14, fontWeight: 'bold' },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  menuModal: {
    borderRadius: 16,
    paddingVertical: 8,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    fontWeight: '600',
  },
  menuDivider: {
    height: 1,
    marginVertical: 4,
  },
  renameModal: {
    borderRadius: 24,
    padding: 24,
    width: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  renameInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {},
  cancelBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confirmBtn: {
    backgroundColor: COLORS.primary,
  },
  confirmBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1c1c0d',
  },
});

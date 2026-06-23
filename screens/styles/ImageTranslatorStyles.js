import { StyleSheet, Platform, Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

// Obsidian Gold palette (matching rest of app)
const GOLD = '#C9A84C';
const GOLD_MUTED = 'rgba(201, 168, 76, 0.6)';
const OBSIDIAN = '#0D0D0D';
const IVORY = '#FAFAF5';
const PARCHMENT = '#C8C2B4';
const ASH = '#6B6B6B';
const EMERALD = '#10B981';
const GLASS_BG = 'rgba(17, 24, 39, 0.65)';
const GLASS_STROKE = 'rgba(201, 168, 76, 0.12)';

export default StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 50 },
  header: {
    paddingHorizontal: 24, paddingTop: Platform.OS === 'ios' ? 70 : 56,
    paddingBottom: 10, alignItems: 'center',
  },
  title: {
    color: GOLD, fontSize: 30, fontWeight: '800', letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },
  subtitle: { color: PARCHMENT, fontSize: 14, marginTop: 6, textAlign: 'center' },
  stepBadge: {
    flexDirection: 'row', alignSelf: 'center', marginTop: 14, marginBottom: 8,
    backgroundColor: 'rgba(201, 168, 76, 0.1)', borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 6, borderWidth: 1, borderColor: 'rgba(201, 168, 76, 0.25)',
  },
  stepBadgeText: { color: GOLD_MUTED, fontSize: 12, fontWeight: '700', letterSpacing: 1 },
  stepContainer: { paddingHorizontal: 20, paddingBottom: 20 },

  // Step 1
  pickCard: {
    backgroundColor: GLASS_BG, borderRadius: 28, padding: 30,
    alignItems: 'center', borderWidth: 1, borderColor: GLASS_STROKE,
    marginHorizontal: 20, marginTop: 16,
  },
  iconCircle: {
    width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center',
    marginBottom: 20, borderWidth: 2, borderColor: 'rgba(201, 168, 76, 0.25)',
    backgroundColor: 'rgba(201, 168, 76, 0.06)',
  },
  pickTitle: { color: IVORY, fontSize: 22, fontWeight: '700', marginBottom: 8 },
  pickDesc: { color: PARCHMENT, fontSize: 14, textAlign: 'center', marginBottom: 28, lineHeight: 21 },
  gradBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, paddingHorizontal: 24, borderRadius: 18, width: '100%',
  },
  btnText: { color: OBSIDIAN, fontSize: 16, fontWeight: '700', marginLeft: 10 },
  camBtn: {
    width: '100%', marginBottom: 14, borderRadius: 18, elevation: 5,
    shadowColor: GOLD, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  gallBtn: { width: '100%' },
  outlineBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 16, borderRadius: 18, borderWidth: 1.5,
    borderColor: 'rgba(201, 168, 76, 0.35)', backgroundColor: 'rgba(201, 168, 76, 0.04)',
  },
  outlineBtnText: { color: GOLD, fontSize: 16, fontWeight: '700', marginLeft: 10 },

  // Step 2 - Preview
  previewCard: {
    backgroundColor: GLASS_BG, borderRadius: 22, padding: 10,
    marginBottom: 20, borderWidth: 1, borderColor: GLASS_STROKE,
  },
  imgPreview: { width: '100%', height: 220, borderRadius: 16 },
  repickBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    position: 'absolute', bottom: 20, alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)', paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16,
  },
  repickBtnText: { color: '#fff', fontSize: 13, fontWeight: '600', marginLeft: 6 },

  // Category selection
  sectionTitle: { color: IVORY, fontSize: 17, fontWeight: '700', marginBottom: 14, marginLeft: 4 },
  catRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  catCard: {
    flex: 1, backgroundColor: GLASS_BG, borderRadius: 20, padding: 18,
    alignItems: 'center', borderWidth: 1.5, borderColor: GLASS_STROKE,
  },
  catCardActive: { borderColor: GOLD, backgroundColor: 'rgba(201, 168, 76, 0.08)' },
  catIcon: {
    width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
    marginBottom: 10, backgroundColor: 'rgba(201, 168, 76, 0.06)',
  },
  catIconActive: { backgroundColor: 'rgba(201, 168, 76, 0.18)' },
  catTitle: { color: PARCHMENT, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  catTitleActive: { color: GOLD },
  catSub: { color: ASH, fontSize: 10, marginTop: 3, textAlign: 'center' },

  // Language grid
  langGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  langChip: {
    backgroundColor: GLASS_BG, borderRadius: 14, paddingHorizontal: 14,
    paddingVertical: 11, alignItems: 'center', width: (width - 60) / 3,
    borderWidth: 1, borderColor: GLASS_STROKE,
  },
  langChipActive: { backgroundColor: 'rgba(201, 168, 76, 0.12)', borderColor: GOLD },
  langChipText: { color: PARCHMENT, fontSize: 15, fontWeight: '600' },
  langChipTextActive: { color: GOLD },
  langChipSub: { color: ASH, fontSize: 10, marginTop: 3 },
  langChipSubActive: { color: GOLD_MUTED },

  // Translate button
  translateWrap: {
    width: '100%', borderRadius: 18, elevation: 5, shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  translateBtnText: { color: OBSIDIAN, fontSize: 15, fontWeight: '800', letterSpacing: 0.5 },
  disabled: { opacity: 0.7, shadowOpacity: 0, elevation: 0 },

  // Step 3 - Results
  resultCard: {
    backgroundColor: GLASS_BG, borderRadius: 22, padding: 22,
    marginBottom: 18, borderWidth: 1, borderColor: GLASS_STROKE,
  },
  translationCard: { borderColor: 'rgba(16,185,129,0.25)', backgroundColor: 'rgba(16,185,129,0.04)' },
  cardHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 14, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: GLASS_STROKE,
  },
  headerRow: { flexDirection: 'row', alignItems: 'center' },
  cardTitle: { color: GOLD, fontSize: 15, fontWeight: '700', marginLeft: 8 },
  copyBtn: { padding: 6 },
  resultText: { color: IVORY, fontSize: 15, lineHeight: 24 },
  translatedText: { color: '#fff', fontSize: 18, lineHeight: 28, fontWeight: '500' },

  // Retranslate
  retranslateTitle: { color: PARCHMENT, fontSize: 14, fontWeight: '600', marginBottom: 10, marginLeft: 4 },
  retranslateScroll: { marginBottom: 20 },
  retranslateRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 4 },
  reChip: {
    backgroundColor: GLASS_BG, paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 16, borderWidth: 1, borderColor: GLASS_STROKE,
  },
  reChipActive: { backgroundColor: GOLD, borderColor: GOLD },
  reChipText: { color: PARCHMENT, fontSize: 13, fontWeight: '500' },
  reChipTextActive: { color: OBSIDIAN, fontWeight: '700' },

  newScanWrap: {
    width: '100%', borderRadius: 18, elevation: 5, shadowColor: GOLD,
    shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8,
  },
  actionBtnText: { color: OBSIDIAN, fontSize: 16, fontWeight: '700' },
});

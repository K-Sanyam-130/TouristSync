// screens/CurrencyConverterScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// FAKE exchange rates (you'll replace these with real API later)
const FAKE_RATES = {
  USD: { INR: 83.5, EUR: 0.92, GBP: 0.79, JPY: 149.2 },
  INR: { USD: 0.012, EUR: 0.011, GBP: 0.0095, JPY: 1.79 },
  EUR: { USD: 1.09, INR: 90.8, GBP: 0.86, JPY: 162.3 },
  GBP: { USD: 1.27, INR: 105.9, EUR: 1.16, JPY: 188.7 },
  JPY: { USD: 0.0067, INR: 0.56, EUR: 0.0062, GBP: 0.0053 },
};

function CurrencyRow({ 
  currency, 
  amount, 
  onAmountChange, 
  isFrom, 
  onSwap 
}) {
  return (
    <View style={styles.currencyRow}>
      <View style={styles.currencyInfo}>
        <Text style={styles.currencyCode}>{currency}</Text>
        <Text style={styles.currencyName}>
          {currency === 'USD' && 'US Dollar'}
          {currency === 'INR' && 'Indian Rupee'}
          {currency === 'EUR' && 'Euro'}
          {currency === 'GBP' && 'British Pound'}
          {currency === 'JPY' && 'Japanese Yen'}
        </Text>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.amountInput,
            isFrom && styles.fromInput
          ]}
          value={amount}
          onChangeText={onAmountChange}
          placeholder="0"
          placeholderTextColor="#666"
          keyboardType="numeric"
        />
        {isFrom && (
          <TouchableOpacity style={styles.swapButton} onPress={onSwap}>
            <Ionicons name="swap-vertical" size={20} color="#ff7a45" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function CurrencyConverterScreen() {
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('INR');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');

  const currencies = ['USD', 'INR', 'EUR', 'GBP', 'JPY'];

  // Update toAmount whenever fromAmount changes
  useEffect(() => {
    if (fromAmount && FAKE_RATES[fromCurrency]?.[toCurrency]) {
      const rate = FAKE_RATES[fromCurrency][toCurrency];
      const converted = (parseFloat(fromAmount) || 0) * rate;
      setToAmount(converted.toFixed(2));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const formatCurrency = (amount, code) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: code,
    }).format(amount);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Currency Converter</Text>
        <Text style={styles.subtitle}>
          Convert between popular world currencies
        </Text>
      </View>

      {/* FROM currency */}
      <CurrencyRow
        currency={fromCurrency}
        amount={fromAmount}
        onAmountChange={setFromAmount}
        isFrom={true}
        onSwap={handleSwap}
      />

      {/* TO currency */}
      <CurrencyRow
        currency={toCurrency}
        amount={toAmount}
        onAmountChange={setToAmount}
        isFrom={false}
      />

      {/* Rate info */}
      {fromAmount && toAmount && (
        <View style={styles.rateInfo}>
          <Text style={styles.rateText}>
            1 {fromCurrency} = {FAKE_RATES[fromCurrency]?.[toCurrency]?.toFixed(4)} {toCurrency}
          </Text>
          <Text style={styles.lastUpdate}>Last update: Today</Text>
        </View>
      )}

      {/* Quick select buttons */}
      <View style={styles.quickSelect}>
        <Text style={styles.sectionTitle}>Quick Select</Text>
        <View style={styles.buttonRow}>
          {currencies.map((currency) => (
            <TouchableOpacity
              key={currency}
              style={[
                styles.currencyButton,
                fromCurrency === currency && styles.currencyButtonActive,
              ]}
              onPress={() => setFromCurrency(currency)}
            >
              <Text
                style={[
                  styles.currencyButtonText,
                  fromCurrency === currency && styles.currencyButtonTextActive,
                ]}
              >
                {currency}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Formatted result (big display) */}
      {fromAmount && toAmount && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Converted Amount</Text>
          <Text style={styles.resultAmount}>
            {formatCurrency(parseFloat(toAmount), toCurrency)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050b18',
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    color: '#b0b4c3',
    fontSize: 13,
    marginTop: 6,
  },

  currencyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#161b2b',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 16,
    borderRadius: 18,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
  },
  currencyName: {
    color: '#b0b4c3',
    fontSize: 12,
    marginTop: 2,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amountInput: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'right',
    minWidth: 100,
  },
  fromInput: {
    fontSize: 32,
    color: '#ff7a45',
  },
  swapButton: {
    marginLeft: 12,
    padding: 8,
  },

  rateInfo: {
    backgroundColor: '#161b2b',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  rateText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  lastUpdate: {
    color: '#b0b4c3',
    fontSize: 11,
    marginTop: 4,
  },

  quickSelect: {
    marginHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  currencyButton: {
    backgroundColor: '#1f2740',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  currencyButtonActive: {
    backgroundColor: '#ff7a45',
  },
  currencyButtonText: {
    color: '#d0d3e0',
    fontSize: 13,
    fontWeight: '600',
  },
  currencyButtonTextActive: {
    color: '#ffffff',
  },

  resultCard: {
    backgroundColor: '#ff7a45',
    margin: 20,
    padding: 20,
    borderRadius: 18,
    alignItems: 'center',
    marginTop: 24,
  },
  resultTitle: {
    color: '#ffffff',
    fontSize: 14,
    opacity: 0.9,
  },
  resultAmount: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 6,
  },
});

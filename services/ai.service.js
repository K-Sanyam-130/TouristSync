// services/ai.service.js — Google Gemini AI service for TouristGuide
// Uses the official @google/generative-ai SDK for rock-solid reliability

import { GoogleGenerativeAI } from '@google/generative-ai';

// ─── Bangalore Tourism Knowledge Base ────────────────────────
const BANGALORE_KNOWLEDGE = `
BANGALORE (BENGALURU) TOURISM KNOWLEDGE BASE:
You have deep expertise about Bangalore. When users ask about Bangalore, use this data:

🏛️ TOP TOURIST ATTRACTIONS:
1. **Lalbagh Botanical Garden** — 240-acre garden with a Glass House, 1000+ plant species, flower shows in Jan & Aug. Entry: ₹25. Timings: 6AM–7PM. Metro: Lalbagh station.
2. **Cubbon Park** — 300-acre green lung in the city center. Free entry. Houses State Library, Attara Kacheri, museums. Best: early mornings.
3. **Bangalore Palace** — Tudor-style architecture inspired by Windsor Castle. Entry: ₹230 (Indian), ₹460 (foreign). Timings: 10AM–5:30PM.
4. **Vidhana Soudha** — Neo-Dravidian granite legislature building. Best viewed at night (illuminated). No entry inside; photo-worthy exterior.
5. **ISKCON Temple** — One of the largest ISKCON temples. Free entry. Famous for prasadam meals. Timings: 7:15AM–1PM, 4PM–8:30PM.
6. **Tipu Sultan's Summer Palace** — 18th-century Indo-Islamic architecture. Entry: ₹15. Near KR Market.
7. **Bull Temple (Nandi Temple)** — 15-foot monolithic Nandi statue in Basavanagudi. Free entry. Groundnut fair (Kadalekai Parishe) in Nov.
8. **Bannerghatta National Park** — Safari, butterfly park, zoo. 22km from city. Entry: ₹80 + safari ₹260. Full day recommended.
9. **Wonderla Amusement Park** — Best water/amusement park. Entry: ₹1399–1799. Weekdays less crowded.
10. **HAL Aerospace Museum** — Aircraft displays, flight simulators. Entry: ₹100. Great for families.
11. **Jawaharlal Nehru Planetarium** — Sky shows in English/Kannada. Entry: ₹60. Sessions every hour.
12. **National Gallery of Modern Art** — Indian modern art. Entry: ₹20. Manikyavelu Mansion campus.
13. **Ulsoor Lake** — Boating in city center. Entry free, boating ₹60. Peaceful mornings.
14. **St. Mary's Basilica** — Gothic-style church built in 1882. Free entry. Near Shivajinagar.
15. **Innovative Film City** — Theme park with Dino Park, wax museum, haunted house. Entry: ₹600+. 40km from city.

🏔️ NEARBY DAY TRIPS (within 150km):
- **Nandi Hills** — 60km, sunrise viewpoint, paragliding. Go before 6AM. ₹20 entry. Weekdays best (weekends very crowded).
- **Shivanasamudra Falls** — 130km, twin waterfalls, best Jul–Jan (monsoon). 3hr drive.
- **Mysore** — 145km, Mysore Palace (₹70), Chamundi Hills, Brindavan Gardens. Full day trip or overnight.
- **Coorg (Kodagu)** — 250km, coffee plantations, Abbey Falls, Raja's Seat. 2-day trip recommended.
- **Ramanagara** — 50km, rock climbing, Sholay shooting location, silk production.
- **Anthargange** — 70km, cave exploration, night trekking. Best Oct–Feb.
- **Savandurga** — 50km, one of Asia's largest monolith hills. Trek difficulty: moderate.

🍜 FOOD & RESTAURANTS:
**Iconic Bangalore Food:**
- **Masala Dosa** — Must try at MTR (Mavalli Tiffin Room, since 1924), Vidyarthi Bhavan (Basavanagudi), CTR (Malleshwaram)
- **Bisi Bele Bath** — Spiced rice-lentil dish. Best at MTR.
- **Filter Coffee** — South Indian style at any Darshini restaurant or Indian Coffee House.
- **Mangalore Buns** — Sweet banana puris. Try at Brahmin's Coffee Bar.
- **Ragi Mudde** — Finger millet balls with saaru (rasam). Local staple.
- **Biryani** — Meghana Foods (multiple locations), Shivaji Military Hotel (Jayanagar), Empire Restaurant.

**Street Food Hotspots:**
- **VV Puram Food Street** — 500m stretch, 30+ stalls. Best: evenings 5PM–10PM. Try: Dosa, chaat, holige, cotton candy.
- **Commercial Street** — Chaat stalls, fruit juice shops.
- **KR Market** — Flower market + food stalls. Go early morning for flower market experience.

**Cafés & Modern Dining:**
- **Third Wave Coffee, Blue Tokai** — Specialty coffee chains (multiple locations)
- **Indiranagar & Koramangala** — Hub for cafés, breweries, restaurants
- **Church Street & Brigade Road** — Bars, pubs, multicuisine restaurants

🚇 TRANSPORTATION:
- **Namma Metro** — 2 lines (Purple: Baiyappanahalli↔Mysuru Road, Green: Nagasandra↔Silk Institute). ₹10–60. Fastest way to travel.
- **BMTC Buses** — City buses. ₹10–40. Volvo AC buses on major routes.
- **Auto-rickshaws** — Always insist on meter OR use Ola/Uber/Rapido auto for fixed fares. Typical: ₹30 base + ₹15/km.
- **Ola/Uber/Rapido** — Ride-hailing apps. Most reliable for point-to-point travel.
- **Kempegowda International Airport (KIA)** — 40km from center. Airport bus (BMTC Vayu Vajra): ₹250–300. Cab: ₹800–1200. Metro airport line: under construction.
- **Majestic (Kempegowda Bus Station)** — Central hub for inter-city buses. KSRTC buses to Mysore (₹200–400), Coorg, Ooty.
- **Bangalore City Railway Station** — For trains to Chennai, Hyderabad, Mumbai, Kerala.

🛍️ SHOPPING:
- **Commercial Street** — Largest street shopping. Clothing, jewelry, electronics. Bargain hard (50% off asking price).
- **MG Road & Brigade Road** — Premium shopping, malls, brand stores.
- **Chickpet** — Wholesale market, silk sarees, traditional items. Bangalore's oldest market.
- **Jayanagar 4th Block** — Local shopping, Cool Joint (famous ice cream).
- **Mantri Square Mall, Phoenix Marketcity, Orion Mall** — Modern malls.
- **Cauvery Emporium (MG Road)** — Govt store for Karnataka handicrafts, sandalwood, silk at fixed prices.

🎭 CULTURE & EVENTS:
- **Karaga Festival** — April, oldest festival (800+ years), Dharmaraya Temple.
- **Dasara/Navaratri** — October, celebrations across temples and Bull Temple.
- **Bangalore Literature Festival** — December, free entry at Lalit Ashok.
- **Bengaluru International Film Festival (BIFFES)** — Annual, multiple venues.
- **Kadalekai Parishe (Groundnut Fair)** — November, Bull Temple, unique peanut festival.
- **IT Hub Culture** — Koramangala, HSR Layout, Whitefield are tech corridors with modern cafés and co-working spaces.

🌤️ WEATHER & BEST TIME TO VISIT:
- **Oct–Feb** (Winter): Best time. 15–28°C. Pleasant, dry. Perfect for sightseeing.
- **Mar–May** (Summer): 22–36°C. Warm but manageable. Carry sunscreen.
- **Jun–Sep** (Monsoon): 19–28°C. Frequent rains. Carry umbrella. Waterfalls at their best.
- Bangalore is at 920m elevation — always cooler than other South Indian cities.
- Average temperature: 24°C year-round. Known as "Garden City" and "Air-conditioned City."

⚠️ SAFETY & PRACTICAL TIPS:
- Bangalore is generally safe for tourists. Exercise normal precautions.
- Keep valuables secure in crowded areas (KR Market, bus stations).
- Carry a power bank — you'll use maps and ride-hailing apps frequently.
- Kannada is the local language, but Hindi and English are widely understood.
- Tipping: Not mandatory but 10% appreciated at restaurants.
- Drinking water: Stick to bottled water. ₹20 for 1L.
- SIM card: Jio/Airtel available at airport. ₹250 for tourist plan with data.
- Best area to stay: MG Road / Indiranagar / Koramangala (central, well-connected).
`;

// ─── System Prompt ───────────────────────────────────────────
const SYSTEM_PROMPT = `You are TravelMate AI, an intelligent, professional, and friendly travel assistant integrated into the "TouristGuide" mobile app.
Your tone is helpful, concise, and adventurous.

${BANGALORE_KNOWLEDGE}

APP KNOWLEDGE & ROUTING:
You are fully aware of the tools available within this app. If a user asks for something that the app can do natively, you MUST guide them to use that feature in the app, while also providing a helpful brief answer.
- Translation: If the user asks to translate text or voice, tell them to use the "Voice Translator" or "Image Translator" screens.
- Currency/Money: If they ask about exchange rates, direct them to the "Currency Converter" tab.
- Navigation/Routes: If they ask for directions or how to get somewhere, suggest using the "Smart Navigation" map screen.
- Emergency: If they mention an emergency (lost, hurt, police), urgently direct them to the "Emergency SOS" screen for instant local help.
- Weather: If they ask for live weather, guide them to the "Weather" screen.
- Social: If they want to meet other travelers, suggest the "Community" screen.

FORMATTING:
- NEVER use markdown tables. They render poorly on mobile screens.
- Write responses in clear, flowing paragraphs that are easy to read on a phone.
- Use **bold** text to highlight app feature names, place names, and important info.
- Use short paragraphs (2-3 sentences each) separated by line breaks for readability.
- For lists, use simple numbered lists or short bullet points — NOT tables.
- Keep responses concise and conversational, like a knowledgeable friend giving advice.
- Use emojis sparingly (1–2 per response) for visual appeal.`;

// ─── API Configuration ──────────────────────────────────────
const OPENROUTER_API_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
const OPENROUTER_MODEL = 'google/gemini-2.5-flash:free';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Gemini fallback (kept in case OpenRouter is down)
let genAI = null;
let chatModel = null;

function getGeminiModel() {
  if (!chatModel) {
    const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
      return null;
    }
    genAI = new GoogleGenerativeAI(apiKey);
    chatModel = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: SYSTEM_PROMPT,
      generationConfig: {
        maxOutputTokens: 1024,
        temperature: 0.7,
        topP: 0.9,
      },
    });
  }
  return chatModel;
}

// ─── OpenRouter AI call ─────────────────────────────────────
async function callOpenRouter(prompt, conversationHistory = []) {
  if (!OPENROUTER_API_KEY) {
    throw new Error('NO_OPENROUTER_KEY');
  }

  // Build messages array
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...conversationHistory
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .slice(-8)
      .map(m => ({ role: m.role, content: m.content })),
    { role: 'user', content: prompt.trim() },
  ];

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://touristguide.app',
      'X-Title': 'TouristGuide AI Assistant',
    },
    body: JSON.stringify({
      model: OPENROUTER_MODEL,
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    console.error(`[AI Service] OpenRouter HTTP ${res.status}: ${errorBody}`);
    if (res.status === 401 || res.status === 403) {
      throw new Error('OPENROUTER_AUTH_ERROR');
    }
    if (res.status === 429) {
      throw new Error('RATE_LIMIT');
    }
    throw new Error(`OpenRouter error: HTTP ${res.status}`);
  }

  const json = await res.json();

  if (json.error) {
    console.error('[AI Service] OpenRouter response error:', json.error.message || JSON.stringify(json.error));
    throw new Error(json.error.message || 'OpenRouter returned an error');
  }

  const text = json.choices?.[0]?.message?.content?.trim();
  if (!text) {
    throw new Error('Empty response from OpenRouter');
  }

  return text;
}

// ─── Gemini AI call (fallback) ──────────────────────────────
async function callGemini(prompt, conversationHistory = []) {
  const model = getGeminiModel();
  if (!model) {
    throw new Error('Gemini API key not configured');
  }

  const history = conversationHistory
    .filter(m => m.role === 'user' || m.role === 'assistant')
    .slice(-8)
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const chat = model.startChat({ history });
  const result = await chat.sendMessage(prompt.trim());
  const text = result.response.text();

  if (!text || text.trim().length === 0) {
    throw new Error('Empty response from Gemini');
  }

  return text.trim();
}

/**
 * Send a chat message to the AI Assistant.
 * Primary: OpenRouter (free model). Fallback: Google Gemini.
 * @param {string} prompt - User's message
 * @param {Array} conversationHistory - Previous messages [{role, content}]
 * @returns {Promise<string>} AI response text
 */
export async function askGeminiAI(prompt, conversationHistory = []) {
  const MAX_RETRIES = 3;
  const RETRY_BASE_DELAY = 1500;

  // ── Try OpenRouter first (primary) ──
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[AI Service] OpenRouter attempt ${attempt}/${MAX_RETRIES}`);
      const result = await callOpenRouter(prompt, conversationHistory);
      console.log(`[AI Service] OpenRouter success on attempt ${attempt}`);
      return result;
    } catch (error) {
      console.error(`[AI Service] OpenRouter error (attempt ${attempt}):`, error.message);

      // Auth error → skip to Gemini fallback immediately
      if (error.message === 'OPENROUTER_AUTH_ERROR' || error.message === 'NO_OPENROUTER_KEY') {
        console.log('[AI Service] OpenRouter auth failed, trying Gemini fallback...');
        break;
      }

      // Rate limit or network error → retry with backoff
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_BASE_DELAY * attempt;
        console.log(`[AI Service] Retrying in ${delay}ms...`);
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
    }
  }

  // ── Gemini fallback ──
  try {
    console.log('[AI Service] Trying Gemini fallback...');
    const result = await callGemini(prompt, conversationHistory);
    console.log('[AI Service] Gemini fallback success');
    return result;
  } catch (geminiError) {
    console.error('[AI Service] Gemini fallback also failed:', geminiError.message);

    // If both failed, throw a user-friendly error
    if (geminiError.message?.includes('429') || geminiError.message?.includes('quota')) {
      throw new Error('AI is temporarily busy. Please try again in a moment.');
    }
    if (geminiError.message?.includes('API key')) {
      throw new Error('AI service configuration error. Please contact support.');
    }
    throw new Error('Could not reach AI service. Please check your internet connection and try again.');
  }
}


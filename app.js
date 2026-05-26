// Vani Yoga Center - Interactive Javascript Logic

// --- System Prompt from createApp.md ---
const YOGA_SYSTEM_PROMPT = `You are a friendly, polite, and helpful yoga studio assistant for Vani Yoga Center.

Your job is to read incoming customer messages (from SMS, chat, or email) and generate a reply.

-----------------------------------
LANGUAGE RULE (VERY IMPORTANT)

- If the message begins with [LANGUAGE: Tamil], respond ENTIRELY in Tamil (தமிழ்).
- If the message begins with [LANGUAGE: English], respond in English.
- If no language tag is present, detect the language the user is writing in and respond in the same language.
- Never mix languages in a single reply. Pick one and stick to it.
- When responding in Tamil, use natural, conversational Tamil — not overly formal.

-----------------------------------
RESPONSE STYLE

- Sound like a warm yoga instructor (not corporate)
- Be polite and welcoming
- Output ONLY the reply message — no labels, no "Here is your answer:" preamble
- For structured info (timings, pricing, services, facilities), use the formatted templates below with icons and line breaks
- For short conversational replies (greetings, follow-ups), keep it to 1–3 sentences with one emoji (🙂)

-----------------------------------
CORE BEHAVIOR

- Answer only what the customer asked (do not overload with all details)
- If multiple questions → answer all clearly
- If something is unclear → ask a follow-up question
- Always try to move the conversation forward

-----------------------------------
FOLLOW-UP STYLE (VERY IMPORTANT)

After answering a question, you may ask ONE gentle, conversational follow-up — like a friend asking, not a salesperson closing.

Good examples:
- "Is there a particular time of day that works better for you?"
- "Are you thinking of trying morning or evening classes?"
- "Feel free to ask anything else — happy to help!"

Bad examples (never say these):
- "Would you like to join a batch?" (too pushy)
- "I can help you sign up right now!" (too transactional)
- "Don't miss out — slots are filling fast!" (pressure tactics)

If user directly asks to join or enroll:
- Warmly ask for their preferred batch timing (morning or evening) and their name together in a single query.
- Once they provide both details, ask if they prefer offline (at Thoraipakkam studio) or online classes.
- After they select their preference, present the pricing (₹2,000/month offline, ₹1,750/month online) and suggest starting on the upcoming Monday, asking: "Would you like us to reserve a spot for you for this upcoming Monday? 🙂"
- When the customer says yes or ok to this question, acknowledge it and inform them that they are going to be redirected to the WhatsApp conversation for booking their slot. Respond exactly: "Wonderful! 🧘 I have recorded your enrollment request. You are now going to be redirected to our WhatsApp conversation to complete booking your slot. 💛" (or Tamil equivalent: "அருமை! 🧘 தங்களின் பதிவு விவரங்களை நான் சேமித்துக் கொண்டேன். ஸ்லாட்டை முன்பதிவு செய்வதற்காக நீங்கள் இப்போது எங்களின் வாட்ஸ்அப் (WhatsApp) உரையாடலுக்கு திருப்பி விடப்படுவீர்கள். 💛").


-----------------------------------
SAFETY RULE (STRICT)

DO NOT REPLY. Instead output exactly:
Needs Human Attention

If message contains:
- Complaints
- Refund requests
- Angry tone
- Health issues, injuries, or pain

-----------------------------------
HEALTH DISCLAIMER

If user mentions conditions like thyroid, PCOD, fertility, back pain, or ANY other health/medical issues, problems, body aches, pains, or physical conditions.

In English:
"Yoga can help support overall wellness for this, but please reach out to our instructor over a phone call at tel:+917373100220 before enrollment to discuss any specific medical issues."

In Tamil:
"யோகா ஒட்டுமொத்த ஆரோக்கியத்திற்கு உதவும், ஆனால் குறிப்பிட்ட மருத்துவ பிரச்சினைகளுக்கு சேர்க்கைக்கு முன் எங்கள் instructor-ஐ tel:+917373100220 என்ற எண்ணில் போன் கால் மூலம் தொடர்பு கொள்ளவும்."

Do NOT give medical advice.

-----------------------------------
BUSINESS DETAILS (SOURCE OF TRUTH)

Business Name: Vani Yoga Center
Chief Yoga Trainer: Vani
Instagram: @vaniyogacenter
YouTube: @vaniyogacenter-omr
Full Address: Plot No. 148, Chandrasekaran Avenue Main Road, Next to EuroKids School, Okkiyam Thoraipakkam, Chennai – 600097
Landmark: Next to EuroKids School, Chandrasekaran Avenue
Google Maps: https://www.google.com/maps/place/vani+yoga+center/data=!4m2!3m1!1s0x3a525dd02cfd6f4b:0x763555c6da95f4cc
Phone: +91 7373100220
Email: vaniyogacenter@gmail.com

-----------------------------------
BATCH TIMINGS FORMAT

When asked about timings, respond with this exact format (translate labels to Tamil if replying in Tamil):

Here are our batch timings 🧘

🌅 Morning Batches:
• 5:50 – 7:00 AM  (Ladies)
• 7:00 – 8:00 AM  (Men & Women)
• 8:00 – 9:00 AM  (Ladies)
• 9:15 – 10:15 AM  (Men & Women)

🌆 Evening Batches:
• 4:30 – 5:30 PM  (Kids, Mon–Fri)
• 5:30 – 6:30 PM  (Ladies, Mon–Fri)

📌 No evening classes on Saturday. Closed on Sundays.

Is there a time of day that suits you better — morning or evening?

Tamil version:
எங்கள் வகுப்பு நேரங்கள் இதோ 🧘

🌅 காலை நேர வகுப்புகள்:
• 5:50 – 7:00 AM  (பெண்கள்)
• 7:00 – 8:00 AM  (ஆண்கள் & பெண்கள்)
• 8:00 – 9:00 AM  (பெண்கள்)
• 9:15 – 10:15 AM  (ஆண்கள் & பெண்கள்)

🌆 மாலை நேர வகுப்புகள்:
• 4:30 – 5:30 PM  (குழந்தைகள், திங்கள்–வெள்ளி)
• 5:30 – 6:30 PM  (பெண்கள், திங்கள்–வெள்ளி)

📌 சனிக்கிழமை மாலை வகுப்புகள் இல்லை. ஞாயிற்றுக்கிழமை விடுமுறை.

காலை அல்லது மாலை — எது உங்களுக்கு வசதியாக இருக்கும்?

-----------------------------------
PRICING FORMAT

When asked about fees or pricing, respond with this format:

Here's our pricing 💛

💻 Online Classes:  ₹1,750 / month
🏛️ Offline Classes: ₹2,000 / month

👥 Group discounts available for families or friends joining together.

Let me know if you have any questions — happy to help! 🙂

Tamil version:
எங்கள் கட்டண விவரங்கள் 💛

💻 Online வகுப்புகள்:  ₹1,750 / மாதம்
🏛️ Offline வகுப்புகள்: ₹2,000 / மாதம்

👥 குடும்பத்தினர் அல்லது நண்பர்கள் சேர்ந்து சேரினால் சிறப்பு தள்ளுபடி உண்டு.

வேறு ஏதாவது கேள்விகள் இருந்தால் கேளுங்கள் — உதவ மகிழ்ச்சி! 🙂

-----------------------------------
SERVICES FORMAT

When asked about classes or services offered, respond with this format:

We offer a wide range of yoga classes 🌿

🧘 Hatha Yoga
⚡ Ashtanga Yoga
👧 Kids Yoga
👨‍👩‍👧 Family Yoga
🌬️ Pranayama & Breathing
🏃 Weight Loss & Flexibility
☀️ Suryanamaskar & Mudras
🌸 Stress Relief & Mindfulness
📱 Online & Offline Classes

All classes are suitable for beginners. Is any of these something you've been curious about?

Tamil version:
நாங்கள் பல வகையான யோகா வகுப்புகளை வழங்குகிறோம் 🌿

🧘 Hatha Yoga
⚡ Ashtanga Yoga
👧 குழந்தைகள் யோகா
👨‍👩‍👧 குடும்ப யோகா
🌬️ Pranayama & சுவாச பயிற்சி
🏃 எடை குறைப்பு & நெகிழ்வுத்தன்மை
☀️ சூரியநமஸ்காரம் & முத்திரைகள்
🌸 மன அழுத்த நிவாரணம் & விழிப்புணர்வு
📱 Online & Offline வகுப்புகள்

அனைத்தும் beginners-க்கும் ஏற்றவை. இவற்றில் ஏதாவது உங்களுக்கு சுவாரஸ்யமாக தெரிகிறதா?

-----------------------------------
FACILITIES FORMAT

When asked about facilities, respond with this format:

We've got everything you need for a comfortable session ✨

👗 Dress change room
🚻 Restroom
💧 Drinking water
🅿️ Parking for cars & bikes on Avenue Road
🧑‍🏫 Staff Guidance (individual support/guidance for any doubts)
🧘 Yoga mats (provided, or bring your own)

Feel free to come in — we've got you covered!

Tamil version:
உங்கள் வசதிக்கு தேவையான அனைத்தும் இங்கே உள்ளன ✨

👗 Dress change room
🚻 Restroom
💧 குடிநீர் வசதி
🅿️ Avenue Road-ல் கார் & பைக் parking
🧑‍🏫 Staff Guidance (உங்களுக்கு ஏற்படும் சந்தேகங்களை தீர்க்க தனிப்பட்ட ஆதரவு/வழிகாட்டுதல்)
🧘 யோகா பாய்கள் (வழங்கப்படும், அல்லது உங்கள் சொந்த பாயை கொண்டு வரலாம்)

நிறைவாக வாருங்கள் — நாங்கள் கவனிக்கிறோம்!

-----------------------------------
LOCATION FORMAT

When asked about location or directions, respond with this format:

📍 We're easy to find!

Vani Yoga Center
Plot No. 148, Chandrasekaran Avenue Main Road,
Next to EuroKids School,
Okkiyam Thoraipakkam, Chennai – 600097

🗺️ Google Maps: https://www.google.com/maps/place/vani+yoga+center/data=!4m2!3m1!1s0x3a525dd02cfd6f4b:0x763555c6da95f4cc

📞 Call us: tel:+917373100220
✉️ Email: vaniyogacenter@gmail.com

See you there! 🙂

Tamil version:
📍 எங்களை எளிதாக கண்டுபிடிக்கலாம்!

வாணி யோகா சென்டர்
Plot No. 148, Chandrasekaran Avenue Main Road,
EuroKids School-க்கு அடுத்து,
Okkiyam Thoraipakkam, Chennai – 600097

🗺️ Google Maps: https://www.google.com/maps/place/vani+yoga+center/data=!4m2!3m1!1s0x3a525dd02cfd6f4b:0x763555c6da95f4cc

📞 அழைக்கவும்: tel:+917373100220
✉️ மின்னஞ்சல்: vaniyogacenter@gmail.com

வாருங்கள்! 🙂

-----------------------------------
REVIEWS FORMAT

When asked about reviews or testimonials, respond with this format:

Here are some of our customer reviews ⭐️

• "Vani is an exceptionally patient and knowledgeable instructor. I joined here three months ago, and I've already seen amazing changes in my flexibility and energy levels. The atmosphere is very peaceful." — Priya S. (5/5 stars)
• "Great place for yoga in Thoraipakkam. Trainer Vani pays close attention to alignment and teaches step-by-step. Very welcoming space for beginners." — Karthik R. (5/5 stars)
• "The personal care and guidance here is top-notch. I joined for stress relief and weight management, and the classes have helped me immensely." — Anjali M. (5/5 stars)

Would you like to know more about our batch timings, pricing, or facilities? 🙂

Tamil version:
எங்கள் வாடிக்கையாளர்களின் மதிப்புரைகள் சில ⭐️

• "வாணி மிகவும் பொறுமையான மற்றும் சிறந்த யோகா பயிற்சியாளர். நான் மூன்று மாதங்களுக்கு முன்பு இங்கு சேர்ந்தேன், என் உடல் நெகிழ்வுத்தன்மை மற்றும் எனர்ஜியில் பெரிய மாற்றத்தைக் காண்கிறேன். மிகவும் அமைதியான சூழல்!" — பிரியா எஸ். (5/5 நட்சத்திரங்கள்)
• "தோரைப்பாக்கத்தில் யோகா செய்ய சிறந்த இடம். பயிற்சியாளர் வாணி ஒவ்வொருவருக்கும் தனிப்பட்ட கவனம் செலுத்தி சொல்லித் தருகிறார். ஆரம்பநிலையில் யோகா கற்பவர்களுக்கு மிகவும் ஏற்றது." — கார்த்திக் ஆர். (5/5 நட்சத்திரங்கள்)
• "மன அழுத்தம் மற்றும் உடல் எடை குறைப்பிற்கு இந்த வகுப்புகள் எனக்கு மிகவும் உதவின. இங்குள்ள வசதிகளும் பார்க்கிங் அமைப்பும் மிகவும் வசதியாக உள்ளன." — அஞ்சலி எம். (5/5 நட்சத்திரங்கள்)

எங்கள் வகுப்பு நேரங்கள், கட்டணம் அல்லது வசதிகள் பற்றி அறிய விரும்புகிறீர்களா? 🙂

-----------------------------------
GENERAL FORMATTING RULES FOR ALL RESPONSES

- Use relevant emojis as visual anchors at the start of each item or section
- Add a blank line between sections for breathing room
- End structured responses with a warm follow-up question to continue the conversation
- For simple conversational replies, keep it short (1–3 sentences), one emoji max

-----------------------------------
STANDARD RESPONSES

Beginners:
- Yes, beginner-friendly 🙂
- Best to start on Mondays

Who can join:
- Ladies, men, and kids (separate batches available)

Dress code:
- 👕 Comfortable clothes — avoid jeans or tight-fitting wear

Yoga mats:
- 🧘 Mats are provided. You're welcome to bring your own too.

-----------------------------------
FINAL RULE

If unsure about anything:
→ Ask a question instead of guessing

Use the following business knowledge as the single source of truth. Do not rely on external assumptions.

Always respond like a friendly yoga instructor, not a corporate support agent.

Never push for conversion. Be warm, informative, and let the customer lead the conversation at their own pace.`;

// --- UI Interaction Logic ---

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initScheduleFilters();
  initCalculator();
  initChatbot();
});

// 1. Theme Switcher (Light / Dark)
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const moonIcon = document.getElementById('theme-moon');
  const sunIcon = document.getElementById('theme-sun');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcons(currentTheme);

  themeToggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = activeTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
  });

  function updateThemeIcons(theme) {
    if (theme === 'dark') {
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }
  }
}

// 2. Schedule Filters
function initScheduleFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const scheduleCards = document.querySelectorAll('.schedule-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class
      filterButtons.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      scheduleCards.forEach(card => {
        const timing = card.getAttribute('data-timing');
        const category = card.getAttribute('data-category');

        if (filter === 'all') {
          card.style.display = 'grid';
        } else if (filter === 'morning' && timing === 'morning') {
          card.style.display = 'grid';
        } else if (filter === 'evening' && timing === 'evening') {
          card.style.display = 'grid';
        } else if (filter === 'ladies' && category === 'ladies') {
          card.style.display = 'grid';
        } else if (filter === 'coed' && category === 'coed') {
          card.style.display = 'grid';
        } else if (filter === 'kids' && category === 'kids') {
          card.style.display = 'grid';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 3. Group & Family Pricing Calculator
function initCalculator() {
  const calcMode = document.getElementById('calc-mode');
  const calcMembers = document.getElementById('calc-members');
  const calcMembersVal = document.getElementById('calc-members-val');
  const calcMonths = document.getElementById('calc-months');
  const calcMonthsVal = document.getElementById('calc-months-val');
  
  const calcBasePrice = document.getElementById('calc-base-price');
  const calcDiscount = document.getElementById('calc-discount');
  const calcSavings = document.getElementById('calc-savings');
  const calcTotal = document.getElementById('calc-total');

  function calculate() {
    const mode = calcMode.value;
    const members = parseInt(calcMembers.value);
    const months = parseInt(calcMonths.value);
    
    // Base prices
    const unitPrice = mode === 'offline' ? 2000 : 1750;
    
    // Discounts
    // 1 member = 0%
    // 2 members = 5%
    // 3-4 members = 10%
    // 5+ members = 15%
    let discountPct = 0;
    if (members === 2) discountPct = 5;
    else if (members >= 3 && members <= 4) discountPct = 10;
    else if (members >= 5) discountPct = 15;
    
    // Extra discount for long durations (e.g. 6+ months gets 5% extra, 12 months gets 10% extra)
    let durationDiscount = 0;
    if (months >= 6 && months < 12) durationDiscount = 5;
    else if (months >= 12) durationDiscount = 10;
    
    const totalDiscountPct = discountPct + durationDiscount;

    const baseCost = unitPrice * members * months;
    const savings = Math.round(baseCost * (totalDiscountPct / 100));
    const totalCost = baseCost - savings;

    // Update UI labels
    calcMembersVal.textContent = `${members} ${members === 1 ? 'Member' : 'Members'}`;
    calcMonthsVal.textContent = `${months} ${months === 1 ? 'Month' : 'Months'}`;
    
    calcBasePrice.textContent = `₹${baseCost.toLocaleString('en-IN')}`;
    calcDiscount.textContent = `${totalDiscountPct}%`;
    calcSavings.textContent = `₹${savings.toLocaleString('en-IN')}`;
    calcTotal.textContent = `₹${totalCost.toLocaleString('en-IN')}`;
  }

  // Bind Events
  calcMode.addEventListener('change', calculate);
  calcMembers.addEventListener('input', calculate);
  calcMonths.addEventListener('input', calculate);

  // Initial Run
  calculate();
}

// 4. AI Assistant Engine & UI Logic
function initChatbot() {
  // Select sandbox elements
  const sandboxMessages = document.getElementById('sandbox-messages');
  const sandboxInput = document.getElementById('sandbox-input');
  const sandboxSend = document.getElementById('sandbox-send');
  const quickPrompts = document.querySelectorAll('.quick-prompt');
  const managerAlerts = document.getElementById('manager-alerts');
  const noAlertsView = document.getElementById('no-alerts-view');
  
  // Select settings modal elements
  const sandboxSettingsBtn = document.getElementById('sandbox-settings-btn');
  const settingsModal = document.getElementById('settings-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const apiKeyInput = document.getElementById('api-key-input');
  const saveApiKeyBtn = document.getElementById('save-api-key');
  const clearApiKeyBtn = document.getElementById('clear-api-key');

  // Select floating widget elements
  const floatingChatTrigger = document.getElementById('floating-chat-trigger');
  const floatingChatbox = document.getElementById('floating-chatbox');
  const floatingCloseBtn = document.getElementById('floating-close-btn');
  const floatingMessages = document.getElementById('floating-messages');
  const floatingInput = document.getElementById('floating-input');
  const floatingSend = document.getElementById('floating-send');

  // Load API Key if available
  let apiKey = localStorage.getItem('gemini_api_key');
  if (apiKey) {
    apiKeyInput.value = apiKey;
    clearApiKeyBtn.style.display = 'block';
  }

  // Conversation history memory (used for Live Gemini API)
  let conversationHistory = [
    { role: 'user', parts: [{ text: 'Hello' }] },
    { role: 'model', parts: [{ text: 'Namaste! 🙂 I am the yoga studio assistant for Vani Yoga Center. How can I help you today?' }] }
  ];

  // Chatbot State Variables for Rule-based fallback flows
  let lastQuestionAsked = null;
  let questionCount = 0;
  let preferredTiming = null;
  let customerName = null;
  let preferredEnrollmentType = null;
  let lastEnrollmentDetails = null;

  // --- Modal Events ---
  sandboxSettingsBtn.addEventListener('click', () => settingsModal.classList.add('open'));
  modalCloseBtn.addEventListener('click', () => settingsModal.classList.remove('open'));
  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) settingsModal.classList.remove('open');
  });

  saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      apiKey = key;
      clearApiKeyBtn.style.display = 'block';
      alert('Gemini Live AI mode activated! Responses will now utilize Gemini 2.5 Flash.');
      settingsModal.classList.remove('open');
    } else {
      alert('Please enter a valid key.');
    }
  });

  clearApiKeyBtn.addEventListener('click', () => {
    localStorage.removeItem('gemini_api_key');
    apiKey = null;
    apiKeyInput.value = '';
    clearApiKeyBtn.style.display = 'none';
    alert('Gemini key removed. Reverted to built-in rule-based AI engine.');
    settingsModal.classList.remove('open');
  });

  // --- Floating Widget Toggle ---
  floatingChatTrigger.addEventListener('click', () => {
    floatingChatbox.classList.toggle('open');
    if (floatingChatbox.classList.contains('open')) {
      floatingInput.focus();
    }
  });

  floatingCloseBtn.addEventListener('click', () => {
    floatingChatbox.classList.remove('open');
  });

  // --- Quick Prompts ---
  quickPrompts.forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.getAttribute('data-prompt');
      handleUserMsg(text, 'sandbox');
    });
  });

  // --- Messaging Events ---
  sandboxSend.addEventListener('click', () => {
    const text = sandboxInput.value.trim();
    if (text) {
      handleUserMsg(text, 'sandbox');
      sandboxInput.value = '';
    }
  });

  sandboxInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = sandboxInput.value.trim();
      if (text) {
        handleUserMsg(text, 'sandbox');
        sandboxInput.value = '';
      }
    }
  });

  floatingSend.addEventListener('click', () => {
    const text = floatingInput.value.trim();
    if (text) {
      handleUserMsg(text, 'floating');
      floatingInput.value = '';
    }
  });

  floatingInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const text = floatingInput.value.trim();
      if (text) {
        handleUserMsg(text, 'floating');
        floatingInput.value = '';
      }
    }
  });

  // --- Message Routing & Response Dispatcher ---
  async function handleUserMsg(userText, channel) {
    // 1. Display User Message
    appendMessage(userText, 'sent', channel);

    // 2. Display Typing Indicator
    const typingIndicatorId = appendTypingIndicator(channel);

    // 3. Gather Response
    let botResponse = '';
    try {
      if (apiKey) {
        botResponse = await fetchGeminiResponse(userText);
      } else {
        botResponse = getRuleBasedResponse(userText);
      }
    } catch (err) {
      console.error('Gemini error, falling back to rule-based', err);
      botResponse = getRuleBasedResponse(userText);
    }

    // 4. Remove Typing Indicator & Display Bot Message
    removeTypingIndicator(typingIndicatorId, channel);
    
    // Normalize bot response if it indicates human attention is needed
    let displayResponse = botResponse;
    const normalizedBot = botResponse.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    if (normalizedBot === "needs human attention") {
      displayResponse = "Needs Human Attention";
    }
    
    const msgType = displayResponse === "Needs Human Attention" ? "system-alert" : "received";
    appendMessage(displayResponse, msgType, channel);
    // 5. Handle Side-effects (e.g. Needs Human Attention flags)
    checkSystemFlags(userText, displayResponse);

    // 6. Handle WhatsApp Redirection side-effect
    if (displayResponse.includes("redirected to our WhatsApp conversation") || 
        displayResponse.includes("வாட்ஸ்அப் (WhatsApp) உரையாடலுக்கு திருப்பி விடப்படுவீர்கள்")) {
      setTimeout(() => {
        let waUrl = "https://wa.me/917373100220";
        if (lastEnrollmentDetails) {
          const isTamilMsg = displayResponse.includes("வாட்ஸ்அப்");
          const waText = isTamilMsg
            ? `வணக்கம் வாணி, யோகா சேர்க்கையை முடிக்க விரும்புகிறேன். எனது விவரங்கள்:\n` +
              `• பெயர்: ${lastEnrollmentDetails.name || 'குறிப்பிடப்படவில்லை'}\n` +
              `• வகுப்பு நேரம்: ${lastEnrollmentDetails.timing === 'morning' ? 'காலை' : (lastEnrollmentDetails.timing === 'evening' ? 'மாலை' : 'ஏதேனும்/விருப்பமில்லை')}\n` +
              `• வகுப்பு முறை: ${lastEnrollmentDetails.type === 'online' ? 'ஆன்லைன்' : (lastEnrollmentDetails.type === 'offline' ? 'நேரடி வகுப்பு' : 'ஏதேனும்/விருப்பமில்லை')}`
            : `Hello Vani, I would like to complete my enrollment. Here are my details:\n` +
              `• Name: ${lastEnrollmentDetails.name || 'Not specified'}\n` +
              `• Preferred Timing: ${lastEnrollmentDetails.timing || 'Not specified'}\n` +
              `• Mode: ${lastEnrollmentDetails.type || 'Not specified'}`;
          
          waUrl += `?text=${encodeURIComponent(waText)}`;
          lastEnrollmentDetails = null; // Clear it after use
        }
        window.open(waUrl, "_blank");
      }, 5000);
    }
  }

  function linkify(text) {
    let escaped = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");

    // Replace URLs
    const urlRegex = /(https?:\/\/[^\s\n]+)/g;
    escaped = escaped.replace(urlRegex, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: inherit; text-decoration: underline;">$1</a>');

    // Replace tel: links
    const telRegex = /tel:(\+?[0-9]+)/g;
    escaped = escaped.replace(telRegex, '<a href="tel:$1" style="color: inherit; text-decoration: underline;">+$1</a>');

    // Replace email links
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/g;
    escaped = escaped.replace(emailRegex, '<a href="mailto:$1" style="color: inherit; text-decoration: underline;">$1</a>');

    return escaped;
  }

  function appendMessage(text, type, channel) {
    const msgElement = document.createElement('div');
    msgElement.className = `msg ${type}`;
    msgElement.innerHTML = linkify(text);
    
    const container = channel === 'sandbox' ? sandboxMessages : floatingMessages;
    container.appendChild(msgElement);
    container.scrollTop = container.scrollHeight;
  }

  function appendTypingIndicator(channel) {
    const id = 'typing-' + Date.now();
    const indicator = document.createElement('div');
    indicator.className = 'msg received typing-indicator';
    indicator.id = id;
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    const container = channel === 'sandbox' ? sandboxMessages : floatingMessages;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
    return id;
  }

  function removeTypingIndicator(id, channel) {
    const indicator = document.getElementById(id);
    if (indicator) {
      indicator.remove();
    }
  }

  // --- Rule-based Assistant Logic (Obeying createApp.md) ---
  function getRuleBasedResponse(input) {
    const cleanInput = input.toLowerCase().trim();
    
    // Language detection: Tamil flag
    const isTamilTag = cleanInput.startsWith('[language: tamil]');
    const isEnglishTag = cleanInput.startsWith('[language: english]');
    const hasTamilCharacters = /[\u0B80-\u0BFF]/.test(input);
    const useTamil = (isTamilTag || (!isEnglishTag && hasTamilCharacters));

    // Remove tags from input for keyword parsing
    let parseInput = cleanInput.replace('[language: tamil]', '').replace('[language: english]', '').trim();
    const cleanWord = parseInput.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").toLowerCase().trim();


    // Helper to detect specific and general health/medical issues/problems
    function detectHealthIssue(text) {
      const clean = text.toLowerCase().trim();
      
      const conditionTriggers = [
        'thyroid', 'pcod', 'pcos', 'fertility', 'pregnancy', 'pregnant', 'back pain', 'backpain', 'knee pain', 'kneepain',
        'joint pain', 'jointpain', 'neck pain', 'neckpain', 'shoulder pain', 'shoulderpain', 'headache', 'migraine',
        'asthma', 'diabetes', 'sugar', 'bp', 'hypertension', 'cholesterol', 'sinus', 'anxiety', 'stress', 'depression',
        'insomnia', 'arthritis', 'cardiac', 'heart', 'disc', 'spondylitis', 'hernia', 'ulcer', 'gastric',
        'தைராய்டு', 'கர்ப்பம்', 'முதுகு வலி', 'முழங்கால் வலி', 'மூட்டு வலி', 'கழுத்து வலி', 'தலைவலி', 'ஒற்றைத் தலைவலி',
        'ஆஸ்துமா', 'சர்க்கரை நோய்', 'இரத்த அழுத்தம்', 'சைனஸ்', 'மன அழுத்தம்', 'நெஞ்சு வலி', 'வயிற்று வலி'
      ];
      
      if (conditionTriggers.some(c => clean.includes(c))) {
        return true;
      }
      
      const healthRegexes = [
        /\b(health|medical|physical|mental)\s+(issue|problem|condition|disorder|illness|sickness)s?\b/i,
        /\b(suffering|suffer)\s+from\b/i,
        /\bdiagnosed\s+with\b/i,
        /\bhave\s+(a\s+)?(chronic|severe\s+)?(pain|ache)s?\b/i,
        /\b(knee|joint|muscle|body|chest|stomach|neck|shoulder|back|foot|leg|arm|hip|spine|bone|shoulder)\s+(issue|problem|condition|disorder|pain|ache)s?\b/i,
        /(உடல்நல|மருத்துவ)\s+(பிரச்சினை|பிரச்சினைகள்|கோளாறு)/i,
        /(வலி|காயம்|அவதி)/i
      ];
      
      if (healthRegexes.some(r => r.test(clean))) {
        return true;
      }
      
      return false;
    }

    const isHealthIssue = detectHealthIssue(parseInput);

    // 1. SAFETY RULE (STRICT) check
    const safetyTriggers = [
      'complaint', 'refund', 'money back', 'cancel membership', 'bad class', 'angry', 
      'worst service', 'stupid', 'injury', 'hurt', 'pain', 'severe', 'accident',
      'புகார்', 'பணம் திரும்ப', 'ரத்து', 'வலி', 'காயம்', 'மோசமான'
    ];
    if (safetyTriggers.some(trigger => {
      // If it is a health issue, bypass the general safety checks for pain/injury/hurt/severe/etc.
      if (['pain', 'hurt', 'injury', 'severe', 'வலி', 'காயம்'].includes(trigger) && isHealthIssue) {
        return false;
      }
      return parseInput.includes(trigger);
    })) {
      return "Needs Human Attention";
    }

    // 2. HEALTH DISCLAIMER check (thyroid, PCOD, fertility, back pain, etc.)
    let conditionDisclaimer = '';
    if (isHealthIssue) {
      conditionDisclaimer = useTamil 
        ? "யோகா ஒட்டுமொத்த ஆரோக்கியத்திற்கு உதவும், ஆனால் குறிப்பிட்ட மருத்துவ பிரச்சினைகளுக்கு சேர்க்கைக்கு முன் எங்கள் instructor-ஐ tel:+917373100220 என்ற எண்ணில் போன் கால் மூலம் தொடர்பு கொள்ளவும்."
        : "Yoga can help support overall wellness for this, but please reach out to our instructor over a phone call at tel:+917373100220 before enrollment to discuss any specific medical issues.";
    }

    function generateBaseResponse() {
      // Define keyword matching arrays
    const beginnerKeywords = ['beginner', 'beginners', 'new to yoga', 'first time', 'never done', 'freshers', 'novice', 'no experience', 'start from scratch', 'basics', 'beginner-friendly', 'ஆரம்பநிலை', 'முதன்முறை', 'முதன் முறை', 'புதியவர்', 'புதுசு', 'அடிப்படை'];
    const targetKeywords = ['who can join', 'who can attend', 'who is it for', 'gentlemen', 'gents', 'gent', 'ladies', 'kids', 'children', 'child', 'boys', 'girls', 'age limit', 'gender', 'coed', 'co-ed', 'யார் சேரலாம்', 'ஆண்கள்', 'பெண்கள்', 'குழந்தைகள்', 'யாரெல்லாம்'];
    const dressKeywords = ['dress', 'clothes', 'wear', 'clothing', 'pant', 't-shirt', 'tshirt', 'outfit', 'jeans', 'comfortable clothes', 'what to wear', 'ஆடை', 'உடை', 'வசதியான', 'ஜீன்ஸ்', 'என்ன போட வேண்டும்'];
    const matKeywords = ['mats', 'yoga mat', 'bring mat', 'provide mat', 'own mat', 'பாய்', 'மேட்', 'யோகா பாய்', 'மேட்கள்'];
    const instructorKeywords = ['instructor', 'trainer', 'teacher', 'coach', 'vani', 'instagram', 'youtube', 'social', 'handle', 'insta', 'yt', 'handles', 'page', 'pages', 'profile', 'பயிற்சியாளர்', 'ஆசிரியர்', 'வாணி', 'இன்ஸ்டா', 'யூடியூப்', 'சமூக ஊடகம்', 'பக்கம்'];
    const timingKeywords = [
      'time', 'timing', 'timings', 'schedule', 'schedules', 'batch', 'batches', 'class times', 'class time',
      'hours', 'opening hours', 'open', 'closed', 'holiday', 'holidays',
      'morning class', 'morning classes', 'morning timings', 'morning batch', 'morning batches', 'morning session', 'morning slot', 'morning slots',
      'evening class', 'evening classes', 'evening timings', 'evening batch', 'evening batches', 'evening session', 'evening slot', 'evening slots',
      'saturday', 'saturdays', 'sunday', 'sundays', 'weekend', 'weekends', 'weekday', 'weekdays', 'mon-fri', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday',
      'வகுப்பு நேரம்', 'நேரங்கள்', 'மணி', 'எப்போது', 'நேரம்', 'கால அட்டவணை', 'சனிக்கிழமை', 'ஞாயிற்றுக்கிழமை', 'விடுமுறை', 'காலை வகுப்பு', 'மாலை வகுப்பு'
    ];
    const pricingKeywords = ['price', 'pricing', 'fee', 'fees', 'cost', 'how much', 'charge', 'charges', 'payment', 'discount', 'discounts', 'rate', 'rates', 'amount', 'pay', 'group discount', 'family discount', 'கட்டணம்', 'கட்டண', 'விலை', 'மாதம்', 'சலுகை', 'தள்ளுபடி', 'பணம்', 'மாதாந்திர', 'எவ்வளவு'];
    const servicesKeywords = [
      'class', 'classes', 'service', 'services', 'class details', 'types of yoga', 'what yoga', 'hatha', 'ashtanga', 'pranayama', 'breathing', 'weight loss', 'flexibility',
      'online class', 'online classes', 'online session', 'online sessions', 'online',
      'offline class', 'offline classes', 'offline session', 'offline sessions', 'offline', 'studio',
      'suryanamaskar', 'mudras', 'stress relief', 'mindfulness',
      'வகுப்புகள்', 'என்ன யோகா', 'சேவைகள்', 'யோகா வகைகள்', 'ஹதா', 'அஷ்டாங்க', 'மூச்சுப்பயிற்சி', 'எடை', 'உடல் எடை', 'நெகிழ்வு', 'மூச்சு', 'பிராணாயாமம்', 'குழந்தைகள் யோகா', 'குடும்ப யோகா',
      'சூரியநமஸ்காரம்', 'முத்திரைகள்', 'மன அழுத்தம்', 'தியானம்', 'விழிப்புணர்வு'
    ];
    const facilitiesKeywords = ['facility', 'facilities', 'amenities', 'changing room', 'change room', 'toilet', 'restroom', 'drinking water', 'restrooms', 'washroom', 'washrooms', 'parking', 'car parking', 'bike parking', 'park car', 'park bike', 'where to park', 'parking space', 'water', 'toilet', 'staff', 'guidance', 'support', 'doubts', 'help', 'வசதி', 'கழிவறை', 'மாற்று அறை', 'குடிநீர்', 'பார்க்கிங்', 'பார்க்', 'நிறுத்த', 'வசதிகள்', 'கார் பார்க்கிங்', 'பைக் பார்க்கிங்', 'தண்ணீர்', 'வழிகாட்டுதல்', 'உதவி', 'சந்தேகம்'];
    const locationKeywords = [
      'location', 'located', 'where are', 'address', 'where is', 'map', 'maps', 'google maps', 'direction', 'directions', 'landmark', 'how to reach', 'road', 'street', 'place', 'how do I get', 'location details',
      'eurokids', 'euro kids', 'okkiyam', 'thoraipakkam', 'chandrasekaran', 'chennai', 'plot', 'omr', 'reach', 'get to', 'find you', 'find the studio', 'find the center',
      'phone', 'number', 'mobile', 'cell', 'contact', 'call', 'telephone', 'tel', 'email', 'mail', 'gmail', 'vaniyogacenter', 'whatsapp', 'whats app',
      'முகவரி', 'எங்கே', 'இடம்', 'பாதை', 'அட்ரஸ்', 'வரைபடம்', 'அடையாளம்', 'இருப்பிடம்', 'தொலைபேசி', 'நம்பர்', 'மின்னஞ்சல்', 'அழைக்க', 'ஜிமெயில்', 'தொடர்பு', 'போன்', 'ஃபோன்', 'வாட்ஸ்அப்'
    ];
    const reviewsKeywords = ['review', 'reviews', 'rating', 'ratings', 'testimonial', 'testimonials', 'feedback', 'what do people say', 'what customers say', 'மதிப்புரை', 'மதிப்புரைகள்', 'விமர்சனம்', 'விமர்சனங்கள்', 'ஃபீட்பேக்', 'பீட்பேக்'];

    function hasKeyword(text, keywords) {
      return keywords.some(k => {
        const escaped = k.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        const pattern = new RegExp('(?:^|[^a-zA-Z0-9\\u0B80-\\u0BFF])' + escaped + '(?:$|[^a-zA-Z0-9\\u0B80-\\u0BFF])', 'i');
        return pattern.test(text);
      });
    }

    function checkNameAndTiming(text) {
      const cleanText = text.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();
      const words = cleanText.split(/\s+/);
      
      const hasMorning = cleanText.includes('morning') || cleanText.includes('am') || cleanText.includes('காலை') || 
                         /\b(5[:.]?50|7[:.]?00|8[:.]?00|9[:.]?15|10[:.]?15)\b/.test(cleanText) || 
                         /\b(7|8|9|10)[:.]?(00|15)?\b/.test(cleanText) || /\b(5|7|8|9|10)\s*am\b/i.test(cleanText);
      const hasEvening = cleanText.includes('evening') || cleanText.includes('pm') || cleanText.includes('மாலை') || cleanText.includes('night') || 
                         /\b(4|5|6)[:.]?(30|00)?\b/.test(cleanText) || /\b(4|5|6)\s*pm\b/i.test(cleanText) || /\b(16|17|18)[:.]?(30|00)?\b/.test(cleanText);
      const timingFound = hasMorning || hasEvening;
      
      const stopWords = [
        'my', 'name', 'is', 'i', 'im', 'am', 'want', 'to', 'join', 'enroll', 'in', 'the', 'for', 'classes', 'class',
        'yes', 'no', 'nope', 'nah', 'not', 'neither', 'none', 'cancel', 'and', 'please', 'morning', 'evening', 'night', 'am', 'pm', 'batch', 'batches', 'timing', 'timings',
        'எனது', 'பெயர்', 'நான்', 'வகுப்பில்', 'சேர', 'வேண்டும்', 'காலை', 'மாலை', 'வகுப்பு', 'ஆமாம்', 'இல்லை', 'வேண்டாம்'
      ];
      
      const nameRegex = /^[a-zA-Z\u0B80-\u0BFF]+$/;
      const nameWords = words.filter(w => w.length >= 2 && !stopWords.includes(w) && nameRegex.test(w));
      const nameFound = nameWords.length > 0;
      
      return {
        nameFound,
        timingFound,
        detectedTiming: hasMorning ? 'morning' : (hasEvening ? 'evening' : null),
        detectedName: nameFound ? nameWords[0] : null
      };
    }

    function isNegativeResponse(text) {
      const clean = text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
      
      const exactNegatives = [
        'no', 'no thanks', 'no thank you', 'nope', 'nah', 'not now', 'not interested', 
        'neither', 'none', 'cancel', 'just asking', 'dont want', 'not joining', 'no I just want to ask',
        'இல்லை', 'வேண்டாம்', 'வேண்டாம் நன்றி', 'ரத்து', 'தேவை இல்லை'
      ];
      
      if (exactNegatives.includes(clean)) {
        return true;
      }
      
      const explicitPhrases = [
        'no thanks', 'no thank you', 'not interested', 'just asking', 'dont want to join', 
        'not now', 'dont reserve', 'not joining', 'வேண்டாம்', 'தேவை இல்லை'
      ];
      return explicitPhrases.some(phrase => clean.includes(phrase));
    }

    function isPositiveResponse(text) {
      const clean = text.toLowerCase().trim().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"");
      
      const exactPositives = [
        'yes', 'yep', 'yup', 'yeah', 'sure', 'ok', 'okay', 'indeed', 'absolutely', 'of course', 'agree', 'confirm', 'why not',
        'ஆம்', 'ஆமாம்', 'சரி', 'கண்டிப்பாக', 'ஓகே', 'நன்று'
      ];
      
      if (exactPositives.includes(clean)) {
        return true;
      }
      
      const positivePhrases = [
        'yes please', 'yes of course', 'sounds good', 'reserve a spot', 'i want to join', 'please do', 'register me',
        'ஆமாம் தயவுசெய்து', 'முன்பதிவு செய்', 'பதிவு செய்'
      ];
      return positivePhrases.some(phrase => clean.includes(phrase));
    }

    const isSingleWord = cleanWord.split(/\s+/).length === 1 && cleanWord !== '';

    let isBeginnerQ = hasKeyword(parseInput, beginnerKeywords);
    let isTargetQ = hasKeyword(parseInput, targetKeywords);
    let isDressQ = hasKeyword(parseInput, dressKeywords);
    let isMatQ = hasKeyword(parseInput, matKeywords) || hasKeyword(parseInput, ['mat']);
    let isInstructorQ = hasKeyword(parseInput, instructorKeywords);
    let isTimingQ = hasKeyword(parseInput, timingKeywords);
    let isPricingQ = hasKeyword(parseInput, pricingKeywords);
    let isServicesQ = hasKeyword(parseInput, servicesKeywords);
    let isFacilitiesQ = hasKeyword(parseInput, facilitiesKeywords);
    let isLocationQ = hasKeyword(parseInput, locationKeywords);
    let isReviewsQ = hasKeyword(parseInput, reviewsKeywords);

    if (isSingleWord) {
      if (['class', 'classes', 'yoga', 'service', 'services', 'types', 'வகுப்புகள்', 'சேவைகள்', 'வகுப்பு'].includes(cleanWord)) {
        isServicesQ = true;
      } else if (['fee', 'fees', 'price', 'prices', 'pricing', 'cost', 'costs', 'charge', 'charges', 'rate', 'rates', 'payment', 'pay', 'amount', 'discount', 'discounts', 'கட்டணம்', 'கட்டண', 'விலை', 'மாதம்', 'சலுகை', 'தள்ளுபடி'].includes(cleanWord)) {
        isPricingQ = true;
      } else if (['timing', 'timings', 'batch', 'batches', 'schedule', 'schedules', 'time', 'times', 'hour', 'hours', 'slot', 'slots', 'session', 'sessions', 'வகுப்பு நேரம்', 'நேரங்கள்', 'நேரம்', 'கால அட்டவணை'].includes(cleanWord)) {
        isTimingQ = true;
      } else if (['review', 'reviews', 'rating', 'ratings', 'testimonial', 'testimonials', 'feedback', 'விமர்சனம்', 'விமர்சனங்கள்', 'மதிப்புரை', 'மதிப்புரைகள்', 'ஃபீட்பேக்', 'பீட்பேக்'].includes(cleanWord)) {
        isReviewsQ = true;
      } else if (['location', 'address', 'landmark', 'map', 'maps', 'directions', 'direction', 'where', 'road', 'street', 'place', 'thoraipakkam', 'chennai', 'முகவரி', 'எங்கே', 'இடம்', 'பாதை', 'அட்ரஸ்', 'வரைபடம்', 'அடையாளம்', 'இருப்பிடம்'].includes(cleanWord)) {
        isLocationQ = true;
      } else if (['facility', 'facilities', 'parking', 'park', 'toilet', 'toilets', 'restroom', 'restrooms', 'washroom', 'washrooms', 'water', 'drinking water', 'வசதி', 'கழிவறை', 'மாற்று அறை', 'குடிநீர்', 'பார்க்கிங்', 'பார்க்'].includes(cleanWord)) {
        isFacilitiesQ = true;
      } else if (['mat', 'mats', 'பாய்', 'மேட்', 'யோகா பாய்', 'மேட்கள்'].includes(cleanWord)) {
        isMatQ = true;
      } else if (['instructor', 'teacher', 'trainer', 'coach', 'vani', 'பயிற்சியாளர்', 'ஆசிரியர்', 'வாணி'].includes(cleanWord)) {
        isInstructorQ = true;
      } else if (['dress', 'clothes', 'wear', 'clothing', 'ஆடை', 'உடை'].includes(cleanWord)) {
        isDressQ = true;
      } else if (['beginner', 'beginners', 'novice', 'fresher', 'freshers', 'start', 'basics', 'ஆரம்பநிலை', 'புதியவர்'].includes(cleanWord)) {
        isBeginnerQ = true;
      }
    }

    let isAskingQuestion = isBeginnerQ || isTargetQ || isDressQ || isMatQ || isInstructorQ || isTimingQ || isPricingQ || isServicesQ || isFacilitiesQ || isLocationQ || isReviewsQ || ['online', 'offline', 'studio', 'whatsapp', 'வாட்ஸ்அப்', 'ஆன்லைன்', 'ஸ்டுடியோ'].includes(cleanWord);
    
    // Overrides: if user is in a state where these terms are direct answers rather than separate questions
    if (lastQuestionAsked === 'ask_timing_preference' && (parseInput.includes('morning') || parseInput.includes('evening') || parseInput.includes('night') || parseInput.includes('காலை') || parseInput.includes('மாலை'))) {
      isAskingQuestion = false;
    }
    if (lastQuestionAsked === 'ask_enrollment_preference' && ['online', 'offline', 'studio'].includes(parseInput.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim())) {
      isAskingQuestion = false;
    }

    // Define helper to get standard informational responses
    function getNormalResponse(parseInput, useTamil, conditionDisclaimer) {
      const cleanWord = parseInput.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").trim();
      
      if (cleanWord === 'online') {
        return useTamil 
          ? "💻 **Online வகுப்புகள்**: நாங்கள் மாதத்திற்கு ₹1,750 கட்டணத்தில் நேரடி ஆன்லைன் வீடியோ யோகா வகுப்புகளை வழங்குகிறோம். அனைத்து வகுப்புகளும் ஆரம்பநிலையினருக்கும் ஏற்றவை! நீங்கள் சேர விரும்புகிறீர்களா? 🙂"
          : "💻 **Online Classes**: We offer live interactive online yoga sessions via video for ₹1,750/month. Suitable for all fitness levels and beginners! Would you like to register? 🙂";
      }
      
      if (cleanWord === 'offline' || cleanWord === 'studio') {
        return useTamil 
          ? "🏛️ **Offline வகுப்புகள்**: சென்னை ஒக்கியம் துரைப்பாக்கத்தில் உள்ள எங்கள் யோகா ஸ்டுடியோவில் நேரடி வகுப்புகள் நடைபெறுகின்றன. கட்டணம்: ₹2,000/மாதம் (யோகா மேட் வழங்கப்படும்). நீங்கள் சேர விரும்புகிறீர்களா? 🙂"
          : "🏛️ **Offline Classes**: We offer offline classes at our serene studio in Okkiyam Thoraipakkam, Chennai for ₹2,000/month (yoga mats provided). Beginners are welcome! Would you like to register? 🙂";
      }
      
      if (cleanWord === 'whatsapp' || cleanWord === 'வாட்ஸ்அப்') {
        return useTamil
          ? "📞 **வாட்ஸ்அப் தொடர்பு**: எங்களை வாட்ஸ்அப் மூலம் +91 7373100220 என்ற எண்ணில் தொடர்பு கொள்ளலாம். நேரடியாக உரையாட இந்த லிங்கை கிளிக் செய்யவும்: https://wa.me/917373100220 🙂"
          : "📞 **WhatsApp Contact**: You can reach us via WhatsApp at +91 7373100220. Click here to chat directly: https://wa.me/917373100220 🙂";
      }

      if (isBeginnerQ) {
        return useTamil ? "ஆம், எங்கள் அனைத்து வகுப்புகளும் ஆரம்பநிலையினருக்கும் (beginners) ஏற்றவை 🙂 நீங்கள் திங்கட்கிழமைகளில் வகுப்பைத் தொடங்குவது மிகவும் நல்லது." : "Yes, our classes are completely beginner-friendly 🙂 It is best to start on Mondays.";
      }
      
      if (isTargetQ) {
        return useTamil ? "எங்கள் வகுப்புகளில் ஆண்கள், பெண்கள் மற்றும் குழந்தைகள் என அனைவரும் சேரலாம் (அனைவருக்கும் தனித்தனி பிரிவுகள் உள்ளன) 🙂" : "Ladies, men, and kids can all join (separate batches are available for each) 🙂";
      }
      
      if (isDressQ) {
        return useTamil ? "👕 யோகா செய்ய வசதியான உடைகளை அணியவும் — ஜீன்ஸ் அல்லது இறுக்கமான ஆடைகளைத் தவிர்க்கவும்." : "👕 Please wear comfortable clothes — avoid jeans or tight-fitting wear.";
      }
      
      if (isMatQ) {
        return useTamil ? "🧘 யோகா பாய்கள் (Mats) ஸ்டு튜디오வில் வழங்கப்படும். நீங்கள் விரும்பினால் உங்கள் சொந்த பாயையும் கொண்டு வரலாம்." : "🧘 Mats are provided at our studio. You're welcome to bring your own too.";
      }
      
      if (isInstructorQ) {
        return useTamil 
          ? "எங்கள் முதன்மை யோகா பயிற்சியாளர் வாணி (Vani) ஆவார். எங்களை Instagram-ல் @vaniyogacenter மற்றும் YouTube-ல் @vaniyogacenter-omr ஆகிய பக்கங்களில் பின்தொடரலாம்! 🙂"
          : "Our Chief Yoga Trainer is Vani. You can also follow us on Instagram at @vaniyogacenter and YouTube at @vaniyogacenter-omr for regular updates! 🙂";
      }
      
      if (isTimingQ) {
        return useTamil ? `எங்கள் வகுப்பு நேரங்கள் இதோ 🧘

🌅 காலை நேர வகுப்புகள்:
• 5:50 – 7:00 AM  (பெண்கள்)
• 7:00 – 8:00 AM  (ஆண்கள் & பெண்கள்)
• 8:00 – 9:00 AM  (பெண்கள்)
• 9:15 – 10:15 AM  (ஆண்கள் & பெண்கள்)

🌆 மாலை நேர வகுப்புகள்:
• 4:30 – 5:30 PM  (குழந்தைகள், திங்கள்–வெள்ளி)
• 5:30 – 6:30 PM  (பெண்கள், திங்கள்–வெள்ளி)

📌 சனிக்கிழமை மாலை வகுப்புகள் இல்லை. ஞாயிற்றுக்கிழமை விடுமுறை.

காலை அல்லது மாலை — எது உங்களுக்கு வசதியாக இருக்கும்?` : `Here are our batch timings 🧘

🌅 Morning Batches:
• 5:50 – 7:00 AM  (Ladies)
• 7:00 – 8:00 AM  (Men & Women)
• 8:00 – 9:00 AM  (Ladies)
• 9:15 – 10:15 AM  (Men & Women)

🌆 Evening Batches:
• 4:30 – 5:30 PM  (Kids, Mon–Fri)
• 5:30 – 6:30 PM  (Ladies, Mon–Fri)

📌 No evening classes on Saturday. Closed on Sundays.

Is there a time of day that suits you better — morning or evening?`;
      }
      
      if (isPricingQ) {
        return useTamil ? `எங்கள் கட்டண விவரங்கள் 💛

💻 Online வகுப்புகள்:  ₹1,750 / மாதம்
🏛️ Offline வகுப்புகள்: ₹2,000 / மாதம்

👥 குடும்பத்தினர் அல்லது நண்பர்கள் சேர்ந்து சேரினால் சிறப்பு தள்ளுபடி உண்டு.

வேறு ஏதாவது கேள்விகள் இருந்தால் கேளுங்கள் — உதவ மகிழ்ச்சி! 🙂` : `Here's our pricing 💛

💻 Online Classes:  ₹1,750 / month
🏛️ Offline Classes: ₹2,000 / month

👥 Group discounts available for families or friends joining together.

Let me know if you have any questions — happy to help! 🙂`;
      }
      
      if (isServicesQ) {
        return useTamil ? `நாங்கள் பல வகையான யோகா வகுப்புகளை வழங்குகிறோம் 🌿

🧘 Hatha Yoga
⚡ Ashtanga Yoga
👧 குழந்தைகள் யோகா
👨‍👩‍👧 குடும்ப யோகா
🌬️ Pranayama & சுவாச பயிற்சி
🏃 எடை குறைப்பு & நெகிழ்வுத்தன்மை
☀️ சூரியநமஸ்காரம் & முத்திரைகள்
🌸 மன அழுத்த நிவாரணம் & விழிப்புணர்வு
📱 Online & Offline வகுப்புகள்

அனைத்தும் beginners-க்கும் ஏற்றவை. இவற்றில் ஏதாவது உங்களுக்கு சுவாரஸ்யமாக தெரிகிறதா?` : `We offer a wide range of yoga classes 🌿

🧘 Hatha Yoga
⚡ Ashtanga Yoga
👧 Kids Yoga
👨‍👩‍👧 Family Yoga
🌬️ Pranayama & Breathing
🏃 Weight Loss & Flexibility
☀️ Suryanamaskar & Mudras
🌸 Stress Relief & Mindfulness
📱 Online & Offline Classes

All classes are suitable for beginners. Is any of these something you've been curious about?`;
      }
      
      if (isFacilitiesQ) {
        return useTamil ? `உங்கள் வசதிக்கு தேவையான அனைத்தும் இங்கே உள்ளன ✨

👗 Dress change room
🚻 Restroom
💧 குடிநீர் வசதி
🅿️ Avenue Road-ல் கார் & பைக் parking
🧑‍🏫 Staff Guidance (உங்களுக்கு ஏற்படும் சந்தேகங்களை தீர்க்க தனிப்பட்ட ஆதரவு/வழிகாட்டுதல்)
🧘 யோகா பாய்கள் (வழங்கப்படும், அல்லது உங்கள் சொந்த பாயை கொண்டு வரலாம்)

நிறைவாக வாருங்கள் — நாங்கள் கவனிக்கிறோம்!` : `We've got everything you need for a comfortable session ✨

👗 Dress change room
🚻 Restroom
💧 Drinking water
🅿️ Parking for cars & bikes on Avenue Road
🧑‍🏫 Staff Guidance (individual support/guidance for any doubts)
🧘 Yoga mats (provided, or bring your own)

Feel free to come in — we've got you covered!`;
      }
      
      if (isLocationQ) {
        return useTamil ? `📍 எங்களை எளிதாக கண்டுபிடிக்கலாம்!

வாணி யோகா சென்டர்
Plot No. 148, Chandrasekaran Avenue Main Road,
EuroKids School-க்கு அடுத்து,
Okkiyam Thoraipakkam, Chennai – 600097

🗺️ Google Maps: https://www.google.com/maps/place/vani+yoga+center/data=!4m2!3m1!1s0x3a525dd02cfd6f4b:0x763555c6da95f4cc

📞 அழைக்கவும்: tel:+917373100220
✉️ மின்னஞ்சல்: vaniyogacenter@gmail.com

வாருங்கள்! 🙂` : `📍 We're easy to find!

Vani Yoga Center
Plot No. 148, Chandrasekaran Avenue Main Road,
Next to EuroKids School,
Okkiyam Thoraipakkam, Chennai – 600097

🗺️ Google Maps: https://www.google.com/maps/place/vani+yoga+center/data=!4m2!3m1!1s0x3a525dd02cfd6f4b:0x763555c6da95f4cc

📞 Call us: tel:+917373100220
✉️ Email: vaniyogacenter@gmail.com

See you there! 🙂`;
      }

      if (isReviewsQ) {
        return useTamil ? `எங்கள் வாடிக்கையாளர்களின் மதிப்புரைகள் சில ⭐️

• "வாணி மிகவும் பொறுமையான மற்றும் சிறந்த யோகா பயிற்சியாளர். நான் மூன்று மாதங்களுக்கு முன்பு இங்கு சேர்ந்தேன், என் உடல் நெகிழ்வுத்தன்மை மற்றும் எனர்ஜியில் பெரிய மாற்றத்தைக் காண்கிறேன். மிகவும் அமைதியான சூழல்!" — பிரியா எஸ். (5/5 நட்சத்திரங்கள்)
• "தோரைப்பாக்கத்தில் யோகா செய்ய சிறந்த இடம். பயிற்சியாளர் வாணி ஒவ்வொருவருக்கும் தனிப்பட்ட கவனம் செலுத்தி சொல்லித் தருகிறார். ஆரம்பநிலையில் யோகா கற்பவர்களுக்கு மிகவும் ஏற்றது." — கார்த்திக் ஆர். (5/5 நட்சத்திரங்கள்)
• "மன அழுத்தம் மற்றும் உடல் எடை குறைப்பிற்கு இந்த வகுப்புகள் எனக்கு மிகவும் உதவின. இங்குள்ள வசதிகளும் பார்க்கிங் அமைப்பும் மிகவும் வசதியாக உள்ளன." — அஞ்சலி எம். (5/5 நட்சத்திரங்கள்)

எங்கள் வகுப்பு நேரங்கள், கட்டணம் அல்லது வசதிகள் பற்றி அறிய விரும்புகிறீர்களா? 🙂` : `Here are some of our customer reviews ⭐️

• "Vani is an exceptionally patient and knowledgeable instructor. I joined here three months ago, and I've already seen amazing changes in my flexibility and energy levels. The atmosphere is very peaceful." — Priya S. (5/5 stars)
• "Great place for yoga in Thoraipakkam. Trainer Vani pays close attention to alignment and teaches step-by-step. Very welcoming space for beginners." — Karthik R. (5/5 stars)
• "The personal care and guidance here is top-notch. I joined for stress relief and weight management, and the classes have helped me immensely." — Anjali M. (5/5 stars)

Would you like to know more about our batch timings, pricing, or facilities? 🙂`;
      }
      
      return '';
    }

    // Check if user is asking to join or enroll
    const joinTriggers = ['join', 'enroll', 'admission', 'register', 'sign up', 'trial', 'demo', 'try a class', 'try class', 'சேர', 'பதிவு', 'முயற்சி'];
    const isJoinAsk = hasKeyword(parseInput, joinTriggers) && !isTargetQ;

    // Handle Direct Join/Enroll Prompt
    if (isJoinAsk) {
      lastQuestionAsked = 'ask_enrollment_details';
      preferredTiming = null;
      customerName = null;
      questionCount = 0; // Reset question counter
      if (useTamil) {
        return "வகுப்பில் சேர தங்களை வரவேற்பதில் மகிழ்ச்சி! உங்களுக்கு வசதியான வகுப்பு நேரம் (காலை அல்லது மாலை) மற்றும் உங்கள் பெயர் ஆகியவற்றை கூற முடியுமா? 💛";
      } else {
        return "We would love to welcome you to our classes! Could you please share your preferred batch timing (morning or evening) and your name? 💛";
      }
    }

    const isNegative = isNegativeResponse(parseInput);

    // Handle Dialogue State Machine for Timing Preference and Enrollment
    if (lastQuestionAsked) {
      if (isNegative) {
        const prevState = lastQuestionAsked;
        
        if (cleanWord === 'cancel' || cleanWord === 'ரத்து') {
          lastQuestionAsked = null;
          preferredTiming = null;
          customerName = null;
          preferredEnrollmentType = null;
          questionCount = 0;
          if (prevState === 'ask_timing_preference') {
            if (useTamil) {
              return "பிரச்சினை இல்லை! வாணி யோகா மையம் பற்றி வேறு ஏதேனும் கேள்விகள் இருந்தால் தாராளமாகக் கேளுங்கள். 🙂";
            } else {
              return "No problem at all! Feel free to ask any other questions about Vani Yoga Center. 🙂";
            }
          } else {
            if (useTamil) {
              return "பிரச்சினை இல்லை! சேர்க்கை பதிவு ரத்து செய்யப்பட்டது. வேறு ஏதேனும் விவரங்கள் தேவைப்பட்டால் கேளுங்கள்! 🙂";
            } else {
              return "No problem! We've cancelled the enrollment request. Let me know if you'd like to explore anything else! 🙂";
            }
          }
        }

        if (prevState === 'ask_timing_preference') {
          lastQuestionAsked = 'ask_enrollment_details';
          preferredTiming = 'any';
          if (useTamil) {
            return "பிரச்சினை இல்லை! உங்களுக்கு நேர விருப்பம் ஏதும் இல்லாததால், வகுப்பில் சேர அல்லது தற்காலிக வகுப்பில் கலந்துகொள்ள விரும்புகிறீர்களா? ஆம் எனில், உங்கள் பெயரை கூற முடியுமா? 💛";
          } else {
            return "No problem! Since you don't have a timing preference, would you like to register or try a class? If so, could you please share your name? 💛";
          }
        } else if (prevState === 'ask_enrollment_preference') {
          lastQuestionAsked = 'ask_enrollment_confirm';
          preferredEnrollmentType = 'any';
          if (useTamil) {
            return "பிரச்சினை இல்லை! உங்களுக்கு வகுப்பு முறை (offline/online) பற்றி குறிப்பிட்ட விருப்பம் ஏதும் இல்லாததால், எதில் வேண்டுமானாலும் இடத்தை முன்பதிவு செய்யலாம். offline வகுப்புகளுக்கான கட்டணம் ₹2,000/மாதம் மற்றும் online வகுப்புகளுக்கான கட்டணம் ₹1,750/மாதம். புதியவர்கள் திங்கட்கிழமைகளில் வகுப்பைத் தொடங்குவது சிறந்தது. வரும் திங்கட்கிழமை உங்களுக்கான இடத்தை முன்பதிவு செய்யலாமா? 🙂";
          } else {
            return "No problem! Since you don't have a preference, we can reserve a spot for you at our offline studio or online. Offline classes are ₹2,000/month and online classes are ₹1,750/month. We usually recommend beginners start on a Monday. Would you like us to reserve a spot for you for this upcoming Monday? 🙂";
          }
        } else {
          lastQuestionAsked = null;
          preferredTiming = null;
          customerName = null;
          preferredEnrollmentType = null;
          questionCount = 0;
          
          if (prevState === 'ask_enrollment_details') {
            if (useTamil) {
              return "பிரச்சினை இல்லை! இப்போதைக்கு நான் சேர்க்கை பதிவை தொடரவில்லை. எங்கள் வகுப்புகள் பற்றி வேறு ஏதேனும் கேள்விகள் இருந்தால் கேளுங்கள்! 🙂";
            } else {
              return "No problem! I won't proceed with the enrollment for now. Let me know if you have any other questions about our classes! 🙂";
            }
          } else if (prevState === 'ask_enrollment_confirm') {
            if (useTamil) {
              return "பிரச்சினை இல்லை! இப்போதைக்கு நாங்கள் இடத்தை முன்பதிவு செய்யவில்லை. நீங்கள் சேரத் தயாராக இருக்கும்போது எப்போது வேண்டுமானாலும் எங்களைத் தொடர்பு கொள்ளலாம்! 🙂";
            } else {
              return "No problem at all! We won't reserve a spot for now. Feel free to reach out whenever you're ready to join! 🙂";
            }
          }
        }
      }

      if (isAskingQuestion) {
        // User asked a question instead of providing details; answer it and append a reminder nudge
        let ans = getNormalResponse(parseInput, useTamil, conditionDisclaimer);
        if (isTimingQ && lastQuestionAsked === 'ask_timing_preference') {
          // Keep timing preference active
        } else if (lastQuestionAsked === 'ask_timing_preference') {
          if (useTamil) {
            ans += "\n\nஇருப்பினும், காலை அல்லது மாலை — எது உங்களுக்கு வசதியாக இருக்கும்? 🙂";
          } else {
            ans += "\n\nBy the way, is there a time of day that suits you better — morning or evening? 🙂";
          }
        } else if (lastQuestionAsked === 'ask_enrollment_details') {
          if (useTamil) {
            ans += "\n\nஇருப்பினும், தங்களுக்கு வசதிப்படும்போது உங்களுக்கு வசதியான வகுப்பு நேரம் (காலை/மாலை) மற்றும் உங்கள் பெயரை கூற முடியுமா? 💛";
          } else {
            ans += "\n\nBy the way, could you share your preferred batch timing (morning/evening) and your name when you're ready? 💛";
          }
        } else if (lastQuestionAsked === 'ask_enrollment_preference') {
          if (useTamil) {
            ans += "\n\nஇருப்பினும், நீங்கள் offline வகுப்பை விரும்புகிறீர்களா அல்லது online வகுப்பை விரும்புகிறீர்களா? 🙂";
          } else {
            ans += "\n\nBy the way, would you prefer offline classes at our studio or online classes? 🙂";
          }
        } else if (lastQuestionAsked === 'ask_enrollment_confirm') {
          if (useTamil) {
            ans += "\n\nஇருப்பினும், வரும் திங்கட்கிழமை உங்களுக்கான இடத்தை முன்பதிவு செய்யலாமா? 🙂";
          } else {
            ans += "\n\nBy the way, would you like us to reserve a spot for you for this upcoming Monday? 🙂";
          }
        }
        return ans;
      } else {
        // User is answering the current prompt
        if (lastQuestionAsked === 'ask_timing_preference') {
          const isPositive = isPositiveResponse(parseInput);
          if (isPositive) {
            if (useTamil) {
              return "மிக்க மகிழ்ச்சி! உங்களுக்கு எந்த நேரம் வசதியாக இருக்கும் — காலையா அல்லது மாலையா? 🙂";
            } else {
              return "Great! Which timing suits you better — morning or evening? 🙂";
            }
          }

          const saidEvening = parseInput.includes('evening') || parseInput.includes('night') || parseInput.includes('pm') || parseInput.includes('மாலை') || 
                              /\b(4|5|6)[:.]?(30|00)?\b/.test(parseInput) || /\b(4|5|6)\s*pm\b/i.test(parseInput) || /\b(16|17|18)[:.]?(30|00)?\b/.test(parseInput);
          const saidMorning = parseInput.includes('morning') || parseInput.includes('am') || parseInput.includes('காலை') || 
                              /\b(5[:.]?50|7[:.]?00|8[:.]?00|9[:.]?15|10[:.]?15)\b/.test(parseInput) || 
                              /\b(7|8|9|10)[:.]?(00|15)?\b/.test(parseInput) || /\b(5|7|8|9|10)\s*am\b/i.test(parseInput);
          
          if (saidEvening) {
            lastQuestionAsked = 'ask_enrollment_details';
            preferredTiming = null;
            customerName = null;
            if (useTamil) {
              return `எங்கள் மாலை நேர வகுப்புகள் இதோ:
• 4:30 – 5:30 PM  (குழந்தைகள், திங்கள்–வெள்ளி)
• 5:30 – 6:30 PM  (பெண்கள், திங்கள்–வெள்ளி)

இந்த மாலை நேர வகுப்புகளில் ஏதேனும் ஒன்றில் பதிவு செய்யவோ அல்லது கலந்து கொள்ளவோ விரும்புகிறீர்களா? ஆம் எனில், உங்களுக்கு வசதியான வகுப்பு நேரம் (காலை/மாலை) மற்றும் உங்கள் பெயரை கூற முடியுமா? 💛`;
            } else {
              return `Here are our evening batches:
• 4:30 – 5:30 PM  (Kids, Mon–Fri)
• 5:30 – 6:30 PM  (Ladies, Mon–Fri)

Would you like to register or try a class? If so, could you please share your preferred batch timing (morning/evening) and your name? 💛`;
            }
          } else if (saidMorning) {
            lastQuestionAsked = 'ask_enrollment_details';
            preferredTiming = null;
            customerName = null;
            if (useTamil) {
              return `எங்கள் காலை நேர வகுப்புகள் இதோ:
• 5:50 – 7:00 AM  (பெண்கள்)
• 7:00 – 8:00 AM  (ஆண்கள் & பெண்கள்)
• 8:00 – 9:00 AM  (பெண்கள்)
• 9:15 – 10:15 AM  (ஆண்கள் & பெண்கள்)

இந்த காலை நேர வகுப்புகள் ஏதேனும் ஒன்றில் பதிவு செய்யவோ அல்லது கலந்து கொள்ளவோ விரும்புகிறீர்களா? ஆம் எனில், உங்களுக்கு வசதியான வகுப்பு நேரம் (காலை/மாலை) மற்றும் உங்கள் பெயரை கூற முடியுமா? 💛`;
            } else {
              return `Here are our morning batches:
• 5:50 – 7:00 AM  (Ladies)
• 7:00 – 8:00 AM  (Men & Women)
• 8:00 – 9:00 AM  (Ladies)
• 9:15 – 10:15 AM  (Men & Women)

Would you like to register or try a class? If so, could you please share your preferred batch timing (morning/evening) and your name? 💛`;
            }
          } else {
            if (useTamil) {
              return "மன்னிக்கவும், காலை அல்லது மாலை — எது உங்களுக்கு வசதியாக இருக்கும்? 🙂";
            } else {
              return "Is there a time of day that suits you better — morning or evening? 🙂";
            }
          }
        }
        
        if (lastQuestionAsked === 'ask_enrollment_details') {
          const isPositive = isPositiveResponse(parseInput);
          if (isPositive) {
            if (useTamil) {
              return "அருமை! தொடர்வதற்கு தங்களுக்கு வசதிப்படும்போது உங்களுக்கு வசதியான வகுப்பு நேரம் (காலை/மாலை) மற்றும் உங்கள் பெயரை கூற முடியுமா? 💛";
            } else {
              return "Perfect! Please share your preferred batch timing (morning or evening) and your name to proceed. 💛";
            }
          }

          const check = checkNameAndTiming(parseInput);
          
          if (check.nameFound) {
            customerName = check.detectedName;
          }
          if (check.timingFound) {
            preferredTiming = check.detectedTiming;
          }
          
          if (customerName && preferredTiming) {
            lastQuestionAsked = 'ask_enrollment_preference';
            if (useTamil) {
              return "விவரங்களைப் பகிர்ந்தமைக்கு மிக்க நன்றி! 💛 நீங்கள் எங்கள் தோரைப்பாக்கம் ஸ்டு튜디오வில் offline வகுப்பில் சேர விரும்புகிறீர்களா அல்லது online வகுப்பில் சேர விரும்புகிறீர்களா? 🙂";
            } else {
              return `Thank you so much for sharing your name, ${customerName}! I've noted that down. 💛 Would you prefer offline classes at our Thoraipakkam studio or online classes? 🙂`;
            }
          } else {
            // Either timing or name is missing, clear states and ask both timing and then name together
            customerName = null;
            preferredTiming = null;
            if (useTamil) {
              return "மன்னிக்கவும், தங்களின் பதிவு விவரங்களை பூர்த்தி செய்ய உங்களுக்கு வசதியான வகுப்பு நேரம் (காலை அல்லது மாலை) மற்றும் உங்கள் பெயர் ஆகிய இரண்டும் தேவை. அவற்றை கூற முடியுமா? 💛";
            } else {
              return "I'm sorry, I couldn't catch both details. Could you please share your preferred batch timing (morning or evening) and your name? 💛";
            }
          }
        }
        
        if (lastQuestionAsked === 'ask_enrollment_preference') {
          const isPositive = isPositiveResponse(parseInput);
          if (isPositive) {
            if (useTamil) {
              return "மகிழ்ச்சி! நீங்கள் எங்கள் ஸ்டு튜디오வில் நேரடியாக படிக்கும் offline வகுப்பை விரும்புகிறீர்களா, அல்லது ஆன்லைன் (online) வகுப்பை விரும்புகிறீர்களா? 🙂";
            } else {
              return "Great! Would you prefer offline classes at our studio or online classes? 🙂";
            }
          }

          const lowerInput = parseInput.toLowerCase();
          if (lowerInput.includes('offline') || lowerInput.includes('studio') || lowerInput.includes('நேரடி')) {
            preferredEnrollmentType = 'offline';
          } else if (lowerInput.includes('online') || lowerInput.includes('ஆன்லைன்')) {
            preferredEnrollmentType = 'online';
          } else {
            preferredEnrollmentType = 'any';
          }

          lastQuestionAsked = 'ask_enrollment_confirm';
          if (useTamil) {
            return "மிக்க நன்று! offline வகுப்புகளுக்கான கட்டணம் ₹2,000/மாதம் மற்றும் online வகுப்புகளுக்கான கட்டணம் ₹1,750/மாதம். புதியவர்கள் திங்கட்கிழமைகளில் வகுப்பைத் தொடங்குவது சிறந்தது. வரும் திங்கட்கிழமை உங்களுக்கான இடத்தை முன்பதிவு செய்யலாமா? 🙂";
          } else {
            return "Perfect! Offline classes are ₹2,000/month and online classes are ₹1,750/month. We usually recommend beginners start on a Monday. Would you like us to reserve a spot for you for this upcoming Monday? 🙂";
          }
        }
        
        if (lastQuestionAsked === 'ask_enrollment_confirm') {
          const isPositive = isPositiveResponse(parseInput);
          if (isPositive) {
            lastEnrollmentDetails = {
              name: customerName,
              timing: preferredTiming,
              type: preferredEnrollmentType
            };

            lastQuestionAsked = null;
            preferredTiming = null;
            customerName = null;
            preferredEnrollmentType = null;
            questionCount = 0;

            if (useTamil) {
              return "அருமை! 🧘 தங்களின் பதிவு விவரங்களை நான் சேமித்துக் கொண்டேன். ஸ்லாட்டை முன்பதிவு செய்வதற்காக நீங்கள் இப்போது எங்களின் வாட்ஸ்அப் (WhatsApp) உரையாடலுக்கு திருப்பி விடப்படுவீர்கள். 💛";
            } else {
              return "Wonderful! 🧘 I have recorded your enrollment request. You are now going to be redirected to our WhatsApp conversation to complete booking your slot. 💛";
            }
          } else {
            if (useTamil) {
              return "வரும் திங்கட்கிழமை உங்களுக்கான இடத்தை முன்பதிவு செய்யலாமா? தயவுசெய்து ஆம் அல்லது இல்லை என்று கூறவும். 🙂";
            } else {
              return "Would you like us to reserve a spot for you for this upcoming Monday? Please reply with Yes or No. 🙂";
            }
          }
        }
      }
    }

    // Normal Flow (no active enrollment flow)
    if (isAskingQuestion) {
      questionCount++;
      let ans = getNormalResponse(parseInput, useTamil, conditionDisclaimer);
      
      // If timings question was asked in normal flow, update lastQuestionAsked to prompt them for morning/evening
      if (isTimingQ) {
        lastQuestionAsked = 'ask_timing_preference';
      }
      if (['online', 'offline', 'studio', 'ஆன்லைன்', 'ஸ்டுடியோ'].includes(cleanWord)) {
        lastQuestionAsked = 'ask_enrollment_details';
      }
      
      // If customer asks more than 4 continuous questions (i.e. 5th question onwards)
      if (questionCount > 4) {
        lastQuestionAsked = 'ask_enrollment_details';
        questionCount = 0; // reset
        if (useTamil) {
          ans += "\n\nஉங்களுக்கு பல கேள்விகள் இருப்பதால், தற்காலிக வகுப்பு (trial) அல்லது வகுப்பில் சேருவது குறித்துப் பேசுவது எளிதாக இருக்கும்! உங்களுக்கு விருப்பமிருந்தால், உங்களுக்கு வசதியான வகுப்பு நேரம் (காலை அல்லது மாலை) மற்றும் உங்கள் பெயரை கூற முடியுமா? எவ்வித கட்டாயமும் இல்லை! 💛";
        } else {
          ans += "\n\nSince you have quite a few questions, it might easiest to set up a trial or chat about joining our classes! If you're interested, could you share your preferred batch timing (morning or evening) and your name? No pressure at all! 💛";
        }
      }
      return ans;
    }

    const isPositive = isPositiveResponse(parseInput);
    if (isPositive) {
      if (useTamil) {
        return "வணக்கம்! இன்று உங்களுக்கு நான் எவ்வாறு உதவ வேண்டும்? எங்களின் வகுப்பு நேரங்கள், கட்டணம் அல்லது சேர்க்கை பற்றி அறிய விரும்புகிறீர்களா? 🙂";
      } else {
        return "Hello! How can I help you today? Would you like to know more about our batch timings, pricing, or how to join? 🙂";
      }
    }

    if (isNegative) {
      if (useTamil) {
        return "சரி, உங்களுக்கு வேறு ஏதேனும் உதவி தேவைப்பட்டால் கேளுங்கள்! 🙂";
      } else {
        return "No problem! Let me know if you need anything else. 🙂";
      }
    }


    const greetings = ['hi', 'hello', 'hey', 'namaste', 'வணக்கம்', 'ஹலோ'];
    if (greetings.some(g => parseInput.includes(g))) {
      return useTamil ? "வணக்கம்! 🙂 வாணி யோகா மையத்தின் யோகா உதவியாளர் நான். இன்று உங்களுக்கு நான் எவ்வாறு உதவ வேண்டும்?" : "Hello! 🙂 How can I help you today with details about Vani Yoga Center?";
    }

    // If unsure -> ask follow-up question
    return useTamil 
      ? "மன்னிக்கவும், தாங்கள் கேட்பது எனக்கு முழுமையாக புரியவில்லை. எங்கள் வகுப்பு நேரங்கள், கட்டணம், இருப்பிடம் அல்லது வசதிகள் ஆகியவற்றில் எதை பற்றி அறிய விரும்புகிறீர்கள்? 🙂"
      : "I'm not entirely sure about that. Would you like to know more about our batch timings, pricing, location, or facilities? 🙂";
    }

    const baseResponse = generateBaseResponse();
    if (conditionDisclaimer && baseResponse !== "Needs Human Attention") {
      return conditionDisclaimer + "\n\n" + baseResponse;
    }
    return baseResponse;
  }

  // --- Live Gemini API Integration (Generative Model client call) ---
  async function fetchGeminiResponse(userText) {
    // Append user input to conversation history
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userText }]
    });

    // We keep conversation length reasonable to prevent token bloat
    if (conversationHistory.length > 10) {
      conversationHistory.shift();
      conversationHistory.shift();
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: conversationHistory,
          systemInstruction: {
            parts: [{ text: YOGA_SYSTEM_PROMPT }]
          },
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const modelText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      if (modelText) {
        // Append model response to conversation history
        conversationHistory.push({
          role: 'model',
          parts: [{ text: modelText }]
        });
        return modelText.trim();
      } else {
        throw new Error('Empty response from Gemini API');
      }
    } catch (e) {
      console.error(e);
      // Fallback
      return getRuleBasedResponse(userText);
    }
  }

  // --- Human Attention Studio Manager Alert Dispatcher ---
  function checkSystemFlags(userText, botText) {
    if (botText === "Needs Human Attention" || userText.toLowerCase().includes("human attention")) {
      // Trigger Admin Alerts
      noAlertsView.style.display = 'none';

      // Determine alert details
      let reason = 'Inquiry Flagged';
      if (userText.toLowerCase().includes('refund') || userText.includes('பணம் திரும்ப')) {
        reason = 'Refund & Cancellation Request';
      } else if (userText.toLowerCase().includes('complaint') || userText.includes('புகார்')) {
        reason = 'Customer Complaint';
      } else if (['pain', 'hurt', 'injury', 'severe', 'வலி', 'காயம்'].some(w => userText.toLowerCase().includes(w))) {
        reason = 'Physical Health Condition / Pain Alert';
      }

      const alertItem = document.createElement('div');
      alertItem.className = 'alert-item danger';
      alertItem.innerHTML = `
        <span class="alert-item-time">${new Date().toLocaleTimeString()}</span>
        <div class="alert-item-title">⚠️ Needs Human Attention</div>
        <div class="alert-item-desc">
          <strong>Trigger Reason:</strong> ${reason}<br>
          <strong>User Msg:</strong> "${userText}"
        </div>
      `;

      managerAlerts.insertBefore(alertItem, managerAlerts.firstChild);

      // Play subtle warning audio effect or flash sandbox borders
      const sandbox = document.querySelector('.assistant-sandbox');
      sandbox.style.border = '2px solid var(--alert-red)';
      setTimeout(() => {
        sandbox.style.border = '1px solid var(--border-color)';
      }, 1000);
    }
  }
}

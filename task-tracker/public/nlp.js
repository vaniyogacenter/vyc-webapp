/**
 * Smart Natural Language Processor (NLP) for Task Tracker
 * Parses dates, times, and categories from text and voice input.
 */

const CATEGORIES = {
    Finance: ['rupees', 'rs', 'bill', 'debt', 'payment', 'bank', 'atm', 'cash', 'pay'],
    Shopping: ['groceries', 'buy', 'market', 'store', 'shopping', 'milk', 'eggs', 'food', 'purchase'],
    Health: ['scan', 'doctor', 'gym', 'workout', 'medicine', 'clean', 'cleanup', 'dentist', 'health'],
    Work: ['report', 'president', 'vp', 'meeting', 'boss', 'email', 'office', 'presentation', 'submit', 'send reports'],
    Personal: ['hair', 'haircut', 'movie', 'tickets', 'weekend', 'clothes', 'iron', 'lunch', 'dinner', 'tickets', 'book']
};

/**
 * Parses a string input to extract date, time, category, and a cleaned title.
 * @param {string} text - The input text or transcript.
 * @param {Date} [baseDate] - The relative starting date (defaults to today).
 * @returns {Object} Parsed task details.
 */
function parseTaskInput(text, baseDate = new Date()) {
    if (!text || typeof text !== 'string') {
        return {
            title: '',
            date: formatDateISO(baseDate),
            time: '',
            category: 'Inbox'
        };
    }

    let cleanedText = text.trim();
    let parsedDate = new Date(baseDate);
    let dateFound = false;
    let parsedTime = '';
    let timeFound = false;

    // Helper: Reset time part of date to midnight for clear offset math
    parsedDate.setHours(0, 0, 0, 0);

    const lowercaseText = cleanedText.toLowerCase();

    // 1. Time parsing helper
    // Matches: "at 4pm", "at 10:30 am", "at 16:00", "at 9 am", etc.
    const timeRegex = /\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\b/gi;
    let timeMatch;
    // We search the original text but in case-insensitive mode
    while ((timeMatch = timeRegex.exec(cleanedText)) !== null) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
        const ampm = timeMatch[3] ? timeMatch[3].toLowerCase() : null;

        if (ampm) {
            if (ampm === 'pm' && hours < 12) {
                hours += 12;
            } else if (ampm === 'am' && hours === 12) {
                hours = 0;
            }
        }
        
        // Format as HH:MM
        parsedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        timeFound = true;
        
        // Remove the matched time substring from the title
        cleanedText = cleanedText.replace(timeMatch[0], '');
        break; // Stop at first valid match
    }

    // 2. Relative date parsing
    // Matches: "today", "tomorrow", "day after tomorrow", "next week"
    if (/\bday after tomorrow\b/i.test(cleanedText)) {
        parsedDate.setDate(parsedDate.getDate() + 2);
        dateFound = true;
        cleanedText = cleanedText.replace(/\bday after tomorrow\b/gi, '');
    } else if (/\btomorrow\b/i.test(cleanedText)) {
        parsedDate.setDate(parsedDate.getDate() + 1);
        dateFound = true;
        cleanedText = cleanedText.replace(/\btomorrow\b/gi, '');
    } else if (/\btoday\b/i.test(cleanedText)) {
        dateFound = true;
        cleanedText = cleanedText.replace(/\btoday\b/gi, '');
    } else if (/\bnext week\b/i.test(cleanedText)) {
        parsedDate.setDate(parsedDate.getDate() + 7);
        dateFound = true;
        cleanedText = cleanedText.replace(/\bnext week\b/gi, '');
    }

    // 3. Weekday parsing (e.g. "on friday", "on next monday")
    if (!dateFound) {
        const weekdays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const weekdayRegex = /\b(?:on\s+)?(next\s+)?(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/gi;
        const weekdayMatch = weekdayRegex.exec(cleanedText);
        
        if (weekdayMatch) {
            const isNext = !!weekdayMatch[1];
            const targetDayName = weekdayMatch[2].toLowerCase();
            const targetDayIndex = weekdays.indexOf(targetDayName);
            
            const currentDayIndex = baseDate.getDay();
            let daysToAdd = targetDayIndex - currentDayIndex;
            
            if (daysToAdd <= 0) {
                daysToAdd += 7; // Next week's weekday if it has passed today or is today
            }
            if (isNext && daysToAdd < 7) {
                daysToAdd += 7; // Force "next" weekday to be a week out
            }
            
            parsedDate.setDate(parsedDate.getDate() + daysToAdd);
            dateFound = true;
            cleanedText = cleanedText.replace(weekdayMatch[0], '');
        }
    }

    // 4. Calendar date parsing (e.g. "on June 20th", "on 25th of this month", "on xyz date")
    if (!dateFound) {
        // Matches "on June 20th", "on 20 June", "on June 20"
        const months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
        const monthsShort = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
        
        const dateRegex = /\b(?:on\s+)?(?:(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+)?(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)|(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s+(\d{1,2})(?:st|nd|rd|th)?)\b/gi;
        const dateMatch = dateRegex.exec(cleanedText);

        if (dateMatch) {
            let day = 0;
            let monthName = '';
            
            if (dateMatch[1] && dateMatch[2]) {
                day = parseInt(dateMatch[1], 10);
                monthName = dateMatch[2].toLowerCase();
            } else if (dateMatch[3] && dateMatch[4]) {
                day = parseInt(dateMatch[4], 10);
                monthName = dateMatch[3].toLowerCase();
            }

            let monthIndex = months.indexOf(monthName);
            if (monthIndex === -1) {
                monthIndex = monthsShort.indexOf(monthName);
            }

            if (monthIndex !== -1 && day > 0 && day <= 31) {
                parsedDate.setMonth(monthIndex);
                parsedDate.setDate(day);
                
                // If the parsed date is in the past, assume next year
                if (parsedDate < baseDate && (baseDate - parsedDate) > (1000 * 60 * 60 * 24)) {
                    parsedDate.setFullYear(parsedDate.getFullYear() + 1);
                }
                
                dateFound = true;
                cleanedText = cleanedText.replace(dateMatch[0], '');
            }
        }
    }

    // 5. Day of month relative parsing (e.g. "on 25th of this month", "on the 25th")
    if (!dateFound) {
        const relativeDayRegex = /\b(?:on\s+)?(?:the\s+)?(\d{1,2})(?:st|nd|rd|th)?\s+(?:of\s+this\s+month|this\s+month)\b/gi;
        const relativeDayMatch = relativeDayRegex.exec(cleanedText);
        if (relativeDayMatch) {
            const day = parseInt(relativeDayMatch[1], 10);
            if (day > 0 && day <= 31) {
                parsedDate.setDate(day);
                // If it resolves in the past of this month, move it forward
                if (parsedDate < baseDate && parsedDate.getDate() !== baseDate.getDate()) {
                    parsedDate.setMonth(parsedDate.getMonth() + 1);
                }
                dateFound = true;
                cleanedText = cleanedText.replace(relativeDayMatch[0], '');
            }
        }
    }

    // Cleanup residual connectors and double spaces
    // e.g. "go for a haircut on" -> "go for a haircut"
    cleanedText = cleanedText
        .replace(/\b(on|at|by|for)\b\s*$/gi, '')
        .replace(/\s+/g, ' ')
        .trim();

    // Capitalize first letter of cleaned title
    if (cleanedText) {
        cleanedText = cleanedText.charAt(0).toUpperCase() + cleanedText.slice(1);
    }

    // 6. Suggest Category based on keywords
    let suggestedCategory = 'Inbox';
    const lowerCleaned = cleanedText.toLowerCase();
    
    outerLoop:
    for (const [category, keywords] of Object.entries(CATEGORIES)) {
        for (const kw of keywords) {
            if (lowerCleaned.includes(kw) || lowercaseText.includes(kw)) {
                suggestedCategory = category;
                break outerLoop;
            }
        }
    }

    return {
        title: cleanedText || text, // Fallback to original text if everything was stripped
        date: formatDateISO(parsedDate),
        time: parsedTime,
        category: suggestedCategory
    };
}

/**
 * Format date to YYYY-MM-DD local string
 * @param {Date} date 
 * @returns {string}
 */
function formatDateISO(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Export for node context or attach to window for browser context
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseTaskInput };
} else {
    window.parseTaskInput = parseTaskInput;
}

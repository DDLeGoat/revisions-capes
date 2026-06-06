const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const genericQuizHTML = `
            <div class="plan-card quiz-card" style="display: none;">
                <h3>🧠 Quiz Interactif : <span class="quiz-title"></span></h3>
                <p>Testez vos connaissances avec ces flashcards. Cliquez sur la carte pour voir la réponse.</p>
                
                <div class="flashcard-widget" onclick="flipCard(this)">
                    <div class="flashcard-inner">
                        <div class="flashcard-front">
                            <p class="fc-question" style="font-size: 1.15em; line-height: 1.4;">Chargement...</p>
                            <span style="font-size: 0.85em; color: #7f8c8d; margin-top: 20px; font-style: italic;">💡 Cliquez pour voir la réponse</span>
                        </div>
                        <div class="flashcard-back">
                            <p class="fc-answer" style="font-size: 1.15em; line-height: 1.4;">Chargement...</p>
                            <span style="font-size: 0.85em; color: rgba(255,255,255,0.8); margin-top: 20px; font-style: italic;">💡 Cliquez pour revoir la question</span>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; justify-content: center; align-items: center; gap: 20px; margin-top: 25px;">
                    <button onclick="prevCard(this)" class="sub-tab-btn">⬅️ Précédent</button>
                    <span class="fc-counter" style="font-weight: bold; color: var(--primary); min-width: 60px;">1 / 1</span>
                    <button onclick="nextCard(this)" class="sub-tab-btn">Suivant ➡️</button>
                </div>
            </div>
`;

const tabs = ['h-grece', 'h-rome', 'h-medit', 'h-eglise', 'h-renais', 'h-revol', 'h-19e', 'h-20e', 
              'g-france', 'g-ue', 'g-pop', 'g-urb', 'g-mond', 'g-geopol', 'g-rural', 'g-env'];

for (let i = 0; i < tabs.length; i++) {
    const tabId = tabs[i];
    const regex = new RegExp('<div id="' + tabId + '" class="sub-tab-content[^>]*>');
    const match = html.match(regex);
    if (!match) continue;
    
    let startIndex = match.index;
    let nextIndex = html.length;
    if (i < tabs.length - 1) {
        let nextTabRegex = new RegExp('<div id="' + tabs[i+1] + '" class="sub-tab-content[^>]*>');
        let nextMatch = html.match(nextTabRegex);
        if (nextMatch) nextIndex = nextMatch.index;
    } else {
        nextIndex = html.indexOf('<script>');
    }
    
    if (tabId === 'h-20e') {
        let nextSectionMatch = html.match(/<div id="geographie" class="section">/);
        if (nextSectionMatch) nextIndex = nextSectionMatch.index;
    }

    let tabEndIndex = html.lastIndexOf('</div>', nextIndex - 1);
    
    if (tabEndIndex !== -1) {
        html = html.substring(0, tabEndIndex) + genericQuizHTML + '\n        ' + html.substring(tabEndIndex);
    }
}

fs.writeFileSync('index.html', html);
console.log('Quiz successfully re-injected.');

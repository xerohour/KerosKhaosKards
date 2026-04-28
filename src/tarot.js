import cardData from './card-data.json';
import { cardPath } from './utils.js';

export function initTarot() {
  // DOM Elements
  const spreadTypeSelect = document.getElementById('spread-type');
  const customCountContainer = document.getElementById('custom-count-container');
  const customCountInput = document.getElementById('custom-count');
  const shuffleBtn = document.getElementById('shuffle-btn');
  const drawBtn = document.getElementById('draw-btn');
  const tarotCardDisplay = document.getElementById('tarot-card-display');
  const tarotMeaning = document.getElementById('tarot-meaning');
  
  // State
  let shuffledDeck = [];
  let drawnCards = [];
  
  // Initialize
  initializeTarot();
  
  // Event Listeners
  spreadTypeSelect.addEventListener('change', handleSpreadTypeChange);
  shuffleBtn.addEventListener('click', shuffleDeck);
  drawBtn.addEventListener('click', drawCards);
  
  // Functions
  function initializeTarot() {
    // Set default interpretation
    tarotMeaning.textContent = "Select a spread type and click 'Shuffle Deck' to begin your reading.";
    
    // Hide custom count initially
    customCountContainer.style.display = 'none';
  }
  
  function handleSpreadTypeChange() {
    const selectedValue = spreadTypeSelect.value;
    customCountContainer.style.display = selectedValue === 'custom' ? 'block' : 'none';
    
    // Reset when changing spread type
    resetTarotReading();
  }
  
  function resetTarotReading() {
    shuffledDeck = [];
    drawnCards = [];
    tarotCardDisplay.innerHTML = '';
    tarotMeaning.textContent = "Select a spread type and click 'Shuffle Deck' to begin your reading.";
    drawBtn.disabled = true;
  }
  
  function shuffleDeck() {
    // Create a deck of all card numbers (1-72)
    const deck = Array.from({ length: 72 }, (_, i) => i + 1);
    
    // Shuffle using Fisher-Yates algorithm
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    shuffledDeck = deck;
    drawnCards = [];
    tarotCardDisplay.innerHTML = '';
    tarotMeaning.textContent = "Deck shuffled! Click 'Draw Cards' to reveal your spread.";
    drawBtn.disabled = false;
    
    // Visual feedback
    shuffleBtn.textContent = "🔀 Shuffled!";
    setTimeout(() => {
      shuffleBtn.textContent = "🔀 Shuffle Deck";
    }, 1000);
  }
  
  function drawCards() {
    if (shuffledDeck.length === 0) {
      tarotMeaning.textContent = "Please shuffle the deck first!";
      return;
    }
    
    // Determine number of cards to draw based on spread type
    const spreadType = spreadTypeSelect.value;
    let numCards = 0;
    
    switch (spreadType) {
      case '1':
        numCards = 1;
        break;
      case '3':
        numCards = 3;
        break;
      case '5':
        numCards = 5;
        break;
      case '8':
        numCards = 8;
        break;
      case 'celtic':
        numCards = 10; // Celtic Cross uses 10 cards
        break;
      case 'custom':
        numCards = Math.min(parseInt(customCountInput.value) || 1, 72);
        break;
      default:
        numCards = 3;
    }
    
    // Ensure we don't draw more cards than available
    numCards = Math.min(numCards, shuffledDeck.length);
    
    // Draw the cards
    drawnCards = shuffledDeck.splice(0, numCards);
    
    // Display the cards
    displayTarotCards();
    
    // Update meaning
    updateTarotMeaning();
  }
  
  function displayTarotCards() {
    tarotCardDisplay.innerHTML = '';
    
    // Create a container for the cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'tarot-cards-container';
    
    drawnCards.forEach((cardNum, index) => {
      const card = cardData.find(c => c.num === cardNum);
      
      if (!card) return;
      
      const cardElement = document.createElement('div');
      cardElement.className = 'tarot-card';
      cardElement.dataset.cardNum = cardNum;
      cardElement.dataset.index = index;
      
      // Card wrapper for the back image (since all backs are the same)
      const cardBack = document.createElement('div');
      cardBack.className = 'tarot-card-back';
      cardBack.innerHTML = `<img src="${cardPath(card, 'back')}" alt="Card Back" />`;
      
      // For now, we'll just show the backs. Flipping will be implemented later.
      // In a full implementation, we'd have a flip mechanism
      cardElement.appendChild(cardBack);
      
      // Add click event to flip card
      cardElement.addEventListener('click', () => flipTarotCard(cardElement, card));
      
      cardsContainer.appendChild(cardElement);
    });
    
    tarotCardDisplay.appendChild(cardsContainer);
  }
  
  function flipTarotCard(cardElement, card) {
    // Toggle flipped state
    const isFlipped = cardElement.classList.toggle('flipped');
    
    if (isFlipped) {
      // Show the card face when flipped
      cardElement.innerHTML = `<img src="${cardPath(card, 'front')}" alt="${card.name}" />`;
      
      // Update meaning for this specific card
      tarotMeaning.textContent = `${card.name} (Card #${card.num}${card.variant ? ' ' + card.variant : ''})${card.isFoil ? ' (Foil)' : ''}: A mystical card imbued with the power of ${card.name}.`;
    } else {
      // Show the card back when flipped back
      cardElement.innerHTML = `<img src="${cardPath(card, 'back')}" alt="Card Back" />`;
      
      // Reset meaning to show spread interpretation
      updateTarotMeaning();
    }
  }
  
  function updateTarotMeaning() {
    if (drawnCards.length === 0) {
      tarotMeaning.textContent = "Select a spread type and click 'Shuffle Deck' to begin your reading.";
      return;
    }
    
    // Get the first card's meaning as a general interpretation
    const firstCard = cardData.find(c => c.num === drawnCards[0]);
    if (!firstCard) {
      tarotMeaning.textContent = "Unable to interpret cards.";
      return;
    }
    
    const spreadNames = {
      '1': 'Single Card Draw',
      '3': 'Three Card Spread (Past, Present, Future)',
      '5': 'Five Card Spread',
      '8': 'Eight Card Spread',
      'celtic': 'Celtic Cross',
      'custom': `${drawnCards.length} Card Custom Spread`
    };
    
    const spreadName = spreadNames[spreadTypeSelect.value] || 'Custom Spread';
    
    tarotMeaning.innerHTML = `
      <strong>${spreadName}</strong><br/>
      You have drawn ${drawnCards.length} card${drawnCards.length !== 1 ? 's' : ''}.<br/><br/>
      Click on any card to flip it and see its individual meaning.
    `;
  }
}
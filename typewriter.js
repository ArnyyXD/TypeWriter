let cursorPosition = 0;

// Initialize typewriter content with a blinking cursor at the beginning
const typewriter = document.getElementById("typewriter");
typewriter.innerHTML = '<span class="cursor"></span>';

  // Function to set the default text in the typewriter box
  function setDefaultText() {
    const typewriter = document.getElementById("typewriter");
    typewriter.innerText = "Start typing here...";
  }

  // Call the function to set the default text when the page loads
  window.onload = setDefaultText;

// Function to update the cursor position and ensure it stays within bounds
function updateCursorPosition(position) {
  cursorPosition = Math.max(0, Math.min(typewriter.textContent.length, position));
  updateCursor();
}

// Function to update the cursor display
function updateCursor() {
  const textBeforeCursor = typewriter.textContent.substring(0, cursorPosition);
  const textAfterCursor = typewriter.textContent.substring(cursorPosition);
  typewriter.innerHTML = textBeforeCursor + '<span class="cursor"></span>' + textAfterCursor;
}

// Function to handle keydown events
document.addEventListener("keydown", function(event) {
  const key = event.key;

  if (event.ctrlKey) {
    // Handle keyboard shortcuts
    if (key === "c" || key === "C") {
      // Copy selected text to clipboard
      const selection = window.getSelection().toString();
      if (selection) {
        navigator.clipboard.writeText(selection)
          .then(() => console.log('Text copied to clipboard'))
          .catch(err => console.error('Unable to copy text:', err));
      }
    }  else if (key === "a" || key === "A") {
      // Select all text
      window.getSelection().selectAllChildren(typewriter);
    }
  } else {
    // Handle other key presses
    if (key === "Enter") {
      // Handle Enter key
      typewriter.textContent = typewriter.textContent.slice(0, cursorPosition) + '\n' + typewriter.textContent.slice(cursorPosition);
      updateCursorPosition(cursorPosition + 1);
    } else if (key === "ArrowLeft") {
      // Handle left arrow key
      updateCursorPosition(cursorPosition - 1);
    } else if (key === "ArrowRight") {
      // Handle right arrow key
      updateCursorPosition(cursorPosition + 1);
    } else if (key === "ArrowUp") {
      // Move cursor up to the previous line
      moveCursorUp();
    } else if (key === "ArrowDown") {
      // Move cursor down to the next line
      moveCursorDown();
    } else if (key === "Backspace") {
      // Handle backspace key
      if (cursorPosition > 0) {
        typewriter.textContent = typewriter.textContent.slice(0, cursorPosition - 1) + typewriter.textContent.slice(cursorPosition);
        updateCursorPosition(cursorPosition - 1);
      }
    } else if (key === " ") {
      // Handle space key
      insertSpace();
    } else if (/^[a-zA-Z0-9\[\]\{\}\(\):;=+\-*/,.!?@#\$%^&_'"|\\]$/.test(key)) {
      // Allow typing alphanumeric characters, symbols, etc.
      typewriter.textContent = typewriter.textContent.slice(0, cursorPosition) + key + typewriter.textContent.slice(cursorPosition);
      updateCursorPosition(cursorPosition + 1);
    }
  }
});

function insertSpace() {
  typewriter.textContent = insertCharacter(typewriter.textContent, " ", cursorPosition);
  moveCursorRight();
}

// Set up event listener for typewriter click to update cursor position
typewriter.addEventListener('click', function(event) {
  const clickY = event.clientY;
  const typewriterY = typewriter.getBoundingClientRect().top;
  const clickedPosition = clickY - typewriterY;
  
  // Calculate the line height
  const lineHeight = parseFloat(window.getComputedStyle(typewriter).lineHeight);
  
  // Calculate cursor position based on clicked position
  cursorPosition = Math.floor(clickedPosition / lineHeight);
  
  // Update the cursor position
  updateCursor();
});

function insertNewLine() {
  // Insert a newline character at the current cursor position
  typewriter.textContent = insertCharacter(typewriter.textContent, '\n', cursorPosition);
  cursorPosition++;
  updateCursor();
}

// Function to move cursor left
function moveCursorLeft() {
  if (cursorPosition > 0) {
    cursorPosition--;
    updateCursor();
  }
}

// Function to move cursor right
function moveCursorRight() {
  if (cursorPosition < typewriter.textContent.length) {
    cursorPosition++;
    updateCursor();
  }
}

// Function to move cursor up
function moveCursorUp() {
  const lineHeight = parseFloat(window.getComputedStyle(typewriter).lineHeight);
  const currentLine = Math.floor(cursorPosition / getCharactersPerLine());
  const newPosition = Math.max(0, cursorPosition - getCharactersPerLine());
  const newLine = Math.floor(newPosition / getCharactersPerLine());
  const adjustment = (currentLine !== newLine) ? 1 : 0;
  cursorPosition = newPosition + adjustment;
  updateCursor();
}

// Function to move cursor down
function moveCursorDown() {
  const lineHeight = parseFloat(window.getComputedStyle(typewriter).lineHeight);
  const currentLine = Math.floor(cursorPosition / getCharactersPerLine());
  const newPosition = Math.min(typewriter.textContent.length, cursorPosition + getCharactersPerLine());
  const newLine = Math.floor(newPosition / getCharactersPerLine());
  const adjustment = (currentLine !== newLine) ? -1 : 0;
  cursorPosition = newPosition + adjustment;
  updateCursor();
}

// Function to calculate number of characters per line based on typewriter width
function getCharactersPerLine() {
  const width = typewriter.getBoundingClientRect().width;
  const characterWidth = 10; // Adjust based on your font size
  return Math.floor(width / characterWidth);
}

function deleteCharacter() {
  if (cursorPosition > 0) {
    typewriter.textContent = removeCharacter(typewriter.textContent, cursorPosition - 1);
    cursorPosition--;
    updateCursor();
  }
}

function insertCharacter(text, char, position) {
  return text.slice(0, position) + char + text.slice(position);
}

function removeCharacter(text, position) {
  return text.slice(0, position) + text.slice(position + 1);
}

function insertSpace() {
  typewriter.textContent = insertCharacter(typewriter.textContent, " ", cursorPosition);
  moveCursorRight();
}

function updateCursor() {
  const textBeforeCursor = typewriter.textContent.substring(0, cursorPosition);
  const textAfterCursor = typewriter.textContent.substring(cursorPosition);
  typewriter.innerHTML = textBeforeCursor + '<span class="cursor"></span>' + textAfterCursor;
}

// Set font function
function setFont(fontName) {
  typewriter.style.fontFamily = fontName;
}

// Add event listener to the font button
const fontBtn = document.getElementById("fontBtn");
const fontSelector = document.getElementById("fontSelector");

fontBtn.addEventListener("click", function() {
  if (fontSelector.style.display === "block") {
    fontSelector.style.display = "none";
  } else {
    fontSelector.style.display = "block";
  }
});

// Listen for clicks on font options
const fontOptions = fontSelector.querySelectorAll("ul li");
fontOptions.forEach(option => {
  option.addEventListener("click", function() {
    const selectedFont = this.dataset.font;
    setFont(selectedFont);
    fontSelector.style.display = "none"; // Close the font selector after selecting a font
  });
});

// Set up event listener for typewriter click to update cursor position
typewriter.addEventListener('click', function(event) {
  const clickX = event.clientX;
  const typewriterX = typewriter.getBoundingClientRect().left;
  const clickedPosition = clickX - typewriterX;
  const characterWidth = 10; // Adjust based on your font size

  // Calculate cursor position based on clicked position
  cursorPosition = Math.round(clickedPosition / characterWidth);
  updateCursor();
});

// Color Button
const colorBtn = document.getElementById("colorBtn");
const colorSelector = document.getElementById("colorSelector");
const customColorPicker = document.getElementById("customColorPicker");

// Hide the color selector initially
colorSelector.style.display = "none";

colorBtn.addEventListener("click", function() {
  // Toggle display of color selector menu
  if (colorSelector.style.display === "block") {
    colorSelector.style.display = "none";
  } else {
    colorSelector.style.display = "block";
  }
});

// Listen for changes in the color picker input
customColorPicker.addEventListener("input", function() {
  const selectedColor = customColorPicker.value;
  // Set the background color of the typewriter box to the selected color
  typewriter.style.backgroundColor = selectedColor;
});

// Close color selector if clicked outside of it
document.addEventListener("click", function(event) {
  if (!colorSelector.contains(event.target) && event.target !== colorBtn) {
    colorSelector.style.display = "none";
  }
});

// Text Color Button
const textColorBtn = document.getElementById("textColorBtn");
const textColorSelector = document.getElementById("textColorSelector");

textColorBtn.addEventListener("click", function() {
    // Toggle display of text color selector menu
    if (textColorSelector.style.display === "block") {
        textColorSelector.style.display = "none";
    } else {
        textColorSelector.style.display = "block";
    }
});

// Listen for clicks on text color options
const textColorOptions = textColorSelector.querySelectorAll("ul li");
textColorOptions.forEach(option => {
    option.addEventListener("click", function() {
        const selectedColor = this.dataset.color;
        // Set the text color of the typewriter content to the selected color
        typewriter.style.color = selectedColor;
        // Hide the text color selector menu
        textColorSelector.style.display = "none";
    });
});

// Update cursor position based on mouse click
typewriter.addEventListener('click', function(event) {
  const clickX = event.clientX;
  const typewriterX = typewriter.getBoundingClientRect().left;
  const clickedPosition = clickX - typewriterX;
  const characterWidth = 10; // Adjust based on your font size

  // Calculate cursor position based on clicked position
  cursorPosition = Math.round(clickedPosition / characterWidth);
  updateCursor();
});

function handleBackspace() {
  console.log("Backspace pressed");
  const selection = window.getSelection().toString(); // Get the selected text
  console.log("Selection:", selection);
  if (selection) {
    // If there's a selection, delete it
    const textBeforeSelection = typewriter.textContent.substring(0, cursorPosition);
    const textAfterSelection = typewriter.textContent.substring(cursorPosition + selection.length);
    console.log("Text before selection:", textBeforeSelection);
    console.log("Text after selection:", textAfterSelection);
    typewriter.textContent = textBeforeSelection + textAfterSelection;
    updateCursorPosition(cursorPosition); // Update cursor position
  } else {
    // If no selection, delete the character before the cursor
    if (cursorPosition > 0) {
      typewriter.textContent = typewriter.textContent.slice(0, cursorPosition - 1) + typewriter.textContent.slice(cursorPosition);
      updateCursorPosition(cursorPosition - 1); // Update cursor position
    }
  }
}


// Add event listener for keydown event
document.addEventListener('keydown', function(event) {
  // Check if Ctrl key is pressed
  if (event.ctrlKey) {
      // Check for copy (Ctrl + C)
      if (event.key === 'c' || event.key === 'C') {
          // Copy the selected text to clipboard
          const selection = window.getSelection().toString();
          if (selection) {
              navigator.clipboard.writeText(selection)
                  .then(() => console.log('Text copied to clipboard'))
                  .catch(err => console.error('Unable to copy text:', err));
          }
      }
      // Check for paste (Ctrl + V)
      else if (event.key === 'v' || event.key === 'V') {
          // Read text from clipboard and insert it into typewriter
          navigator.clipboard.readText()
              .then(text => {
                  // Insert text into typewriter
                  typewriter.innerText += text;
              })
              .catch(err => console.error('Unable to paste text:', err));
      }
  }
});

// Function to enable text selection within the typewriter
typewriter.addEventListener('mousedown', function(event) {
  event.preventDefault(); // Prevent default text selection behavior
});

// Enable text selection for specific paragraph(s)
const specificParagraphId = "specificParagraph"; // Replace "specificParagraph" with the actual ID of your paragraph element
enableTextSelectionForParagraph(specificParagraphId);

// Function to enable text selection for a specific paragraph
function enableTextSelectionForParagraph(paragraphId) {
  const paragraph = document.getElementById(paragraphId);
  if (paragraph) {
    paragraph.addEventListener('mousedown', function(event) {
      event.stopPropagation(); // Prevent event propagation to typewriter
    });
  }
}

// Function to handle backspace key press
function handleBackspace() {
  console.log("Backspace pressed");
  const selection = window.getSelection().toString(); // Get the selected text
  console.log("Selection:", selection);
  
  if (selection) {
    // If there's a selection, delete it
    const textBeforeSelection = typewriter.textContent.substring(0, cursorPosition);
    const textAfterSelection = typewriter.textContent.substring(cursorPosition + selection.length);
    console.log("Text before selection:", textBeforeSelection);
    console.log("Text after selection:", textAfterSelection);
    typewriter.textContent = textBeforeSelection + textAfterSelection;
    updateCursorPosition(cursorPosition); // Update cursor position
  } else {
    // If no selection, delete the character before the cursor
    if (cursorPosition > 0) {
      typewriter.textContent = typewriter.textContent.slice(0, cursorPosition - 1) + typewriter.textContent.slice(cursorPosition);
      updateCursorPosition(cursorPosition - 1); // Update cursor position
    }
  }
}


document.addEventListener('DOMContentLoaded', function() {
  // Add event listener to the download button
  document.getElementById('downloadBtn').addEventListener('click', function(event) {
    // Prevent the default behavior of the button
    event.preventDefault();

    // Ensure all images are fully loaded before generating the PDF
    const images = document.querySelectorAll('img');
    let loadedImagesCount = 0;

    images.forEach(img => {
      if (img.complete) {
        loadedImagesCount++;
      } else {
        img.addEventListener('load', function() {
          loadedImagesCount++;
          if (loadedImagesCount === images.length) {
            generatePDF();
          }
        });
      }
    });

    // If all images are already loaded, generate the PDF immediately
    if (loadedImagesCount === images.length) {
      generatePDF();
    }
  });
});

function generatePDF() {
  // Get the selected background color
  const typewriter = document.getElementById('typewriter');
  const backgroundColor = window.getComputedStyle(typewriter).getPropertyValue('background-color');

  // Create a temporary div to cover the entire document body with the selected background color
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'fixed';
  tempDiv.style.top = '0';
  tempDiv.style.left = '0';
  tempDiv.style.width = '100%';
  tempDiv.style.height = '100%';
  tempDiv.style.backgroundColor = backgroundColor;
  document.body.appendChild(tempDiv);

  // Use html2pdf library to convert HTML to PDF
  const element = document.getElementById('typewriter');
  const opt = {
    margin:       1,
    filename:     'typewriter_content.pdf',
    image:        { type: 'jpeg', quality: 1.0 }, // Adjust image quality here
    html2canvas:  { scale: 2 }, // Increase scale for higher resolution
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
    background:   backgroundColor // Use the dynamically retrieved background color
  };

  html2pdf().from(element).set(opt).save();

  // Remove the temporary div
  document.body.removeChild(tempDiv);
}

// Update the URL to point to port 5500
const settingsUrl = 'http://localhost:5500/settings';
const loadSettingsUrl = 'http://localhost:5500/settings';

// Function to save settings to the server
function saveSettingsToServer(settings) {
  fetch(settingsUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(settings)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to save settings');
    }
  })
  .catch(error => {
    console.error('Error saving settings:', error);
  });
}

// Function to load settings from the server
function loadSettingsFromServer() {
  fetch(loadSettingsUrl)
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to load settings');
    }
  })
  .then(settings => {
    applySettings(settings);
  })
  .catch(error => {
    console.error('Error loading settings:', error);
  });
}

import React from "react";

const Buttons = ({ apiCall, save, quoteText, quoteAuthor, toggle, toggleQuote }) =>
    <div>
      <button id="newQuote" onClick={() => apiCall(1)}>
        Random Quote
      </button>
      {toggle && (
        <SaveButton
          quoteText={ quoteText }
          quoteAuthor={ quoteAuthor }
          save={ save }
        />
      )}
      <ToggleQuoteTypeButton toggleQuote={ toggleQuote } />
    </div>


const SaveButton = ({ quoteText, quoteAuthor, save }) => (
  <button id="saveQuote" onClick={() => save(quoteText, quoteAuthor)}>
    Save Quote
  </button>
);

const ToggleQuoteTypeButton = ({ toggleQuote }) => (
  <button className="inputQbutton" onClick={ toggleQuote }>
    Author Quote
  </button>
);

export default Buttons;

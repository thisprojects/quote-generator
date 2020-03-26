import React from "react";

export const SaveQuote = ({ saved, exists }) =>
  saved.length && (
    <div className="saveIt">
      <MapSavedItems savedItems={saved} />
      <div className="exists">
        <ItemAlreadyExists exists={exists} />
      </div>
    </div>
  ) || null;

const MapSavedItems = ({ savedItems }) =>
  savedItems.map((item, index) => (
    <p className="fadeIn" key={index}>
      {item}
    </p>
  ));

const ItemAlreadyExists = ({ exists }) =>
  exists && (
    <p className="fadeOut">
      This Quote And Author Combination Is Already In The Bank!
    </p>
  );

export const DisplayQuote = ({ quoteText, quoteAuthor, waiting, errors }) =>
  (!errors && !waiting && quoteText && quoteAuthor && (
    <div className="fadeIn">{`${quoteText} - ${quoteAuthor}`}</div>
  )) ||
  null;

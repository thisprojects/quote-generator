const fetchQuotes = () =>
  fetch(
    "https://cors-anywhere.herokuapp.com/http://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en"
  ).then(response => response.json());


const returnQuote = async () => {
  let { quoteText, quoteAuthor } = await fetchQuotes();
    return { quoteText, quoteAuthor };
};

export default returnQuote;

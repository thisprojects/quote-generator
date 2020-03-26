import React from "react";
import { DisplayQuote, SaveQuote } from "./HandleQuotes";
import AuthorAQuote from "./AuthorQuote";
import Buttons from "./Buttons";
import returnQuote from "./../NetworkRequest/fetch";

class Quote extends React.Component {
  state = {
    quoteText: false,
    quoteAuthor: false,
    waiting: false,
    savedQuotes: [],
    exists: false,
    toggle: true,
    formValue: "",
    errors: false
  };

  componentDidMount() {
    this.acquireQuote();
  }
  render() {
    const {
      quoteText,
      waiting,
      toggle,
      savedQuotes,
      exists,
      quoteAuthor,
      errors
    } = this.state;

    const Loading = () => <p>Acquiring Inspiration......</p>;

    const Errors = () => <p>Whoops! Something went wrong.....Try again!</p>

    return (
      <div className="quote">
        <div className="header">
          <i className="far fa-comment-alt fa-7x"></i>
        </div>
        <div className="quoteBox">
          <div className="quoteText">
            {errors && <Errors />}
            {!errors && waiting && <Loading />}
            {(toggle && (
              <DisplayQuote
                quoteText={quoteText}
                quoteAuthor={quoteAuthor}
                waiting={waiting}
                errors={errors}
              />
            )) || <AuthorAQuote saveIt={this.saveIt} />}
          </div>

          <div className="buttons">
            {!waiting && (
              <Buttons
                apiCall={this.acquireQuote}
                save={this.saveIt}
                quoteText={quoteText}
                quoteAuthor={quoteAuthor}
                toggle={toggle}
                toggleQuote={this.toggleQuote}
              />
            )}
          </div>
        </div>
        <SaveQuote saved={savedQuotes} exists={exists} />
      </div>
    );
  }

  acquireQuote = async () => {
    this.setState({
      waiting: true,
      toggle: true,
      errors:false,
    });

    let x = await returnQuote().catch(() =>
      this.setState({ errors: true, waiting: false })
    );
    const { quoteText = "Bad response", quoteAuthor = "Bad person" } = x || {};
    if (!this.state.errors) {
      this.setState({ quoteText, quoteAuthor, waiting: false });
    }
  };

  toggleQuote = () => {
    this.setState({ toggle: false, quoteText: [] }); // toggles between Entering own quote and getting a random one. Also resets any quoteText already acquired from API.
  };

  saveIt = (quoteText, quoteAuthor) => {
    if (quoteAuthor.length <= 0) {
      quoteAuthor = "Unknown";
    }

    let z = quoteText + " - " + quoteAuthor;
    let x = this.state.savedQuotes.includes(z);

    if (!x) {
      // if the current quote + author doesnt match one already in the array
      this.setState({ savedQuotes: this.state.savedQuotes.concat([z]) }); // concatenate the current quote and author to the saved quotes array
    } else {
      this.setState({ exists: true }); // if the quote already exists in the saved quotes array display a message on the page
      setTimeout(this.fadeTimer, 3000); // resets the state of the exists variable after a period of time - see below
    }
  };

  fadeTimer = () => {
    // this enables the "quote already exists" message to be displayed each time the save button is pressed, should the quote already exist
    this.setState({ exists: false });
  };
}

export default Quote;

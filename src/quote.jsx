import React from "react";
import "./App.css";

class SaveQuote extends React.Component {
  render() {
    if (this.props.saved.length) {
      // if there is a saved quote array in existance

      return (
        <div className="saveIt">
          {this.props.saved.map((
            input // map the quote array to quote paragraphs
          ) => (
            <p className="fadeIn" key={input.toString()}>
              {input}
            </p>
          ))}
          <div className="exists">
            {this.props.exists ? ( // if the quote already exists display the below error
              <p className="fadeOut">
                This Quote And Author Combination Is Already In The Bank!
              </p>
            ) : (
              <p></p>
            )}
          </div>
        </div>
      );
    } else {
      return (
        // if there is no quote array return an empty div
        <div></div>
      );
    }
  }
}

class DisplayQuote extends React.Component {
  render() {
    let quote = this.props.results; // cache results prop - purely for ease of reading the following lines

    if (quote.quoteText) {
      // if a quote is passed to the componenet

      return (
        // display the quote and the author

        <div className="fadeIn">
          {quote.quoteText + " - " + quote.quoteAuthor}
        </div>
      );
    } else {
      return (
        // if there is no quote being passed through, display the loading message

        <div className="messageBox">
          <h2>{this.props.message}</h2>
        </div>
      );
    }
  }
}

class Quote extends React.Component {
  // our parent component

  constructor(props) {
    super(props);
    this.state = {
      results: [],
      waiting: false,
      message: "",
      savedQuotes: [],
      exists: false,
      toggle: true,
      formValue: ""
    };
  }

  componentDidMount() {
    this._napTime(1); // start app by calling API , the argument is the base number of attempts to contact the API - purely for the purpose of counting caught errors
  }
  render() {
    return (
      <div className="quote">
        <div className="header">
          <i class="far fa-comment-alt fa-7x"></i>
        </div>
        <div className="quoteBox">
          <div className="quoteText">
            {this.state.toggle ? ( // are we generating random quotes or inputing our own? The toggle boolean is changed by the "author quote" and "random quote" buttons
              <DisplayQuote
                results={this.state.results}
                message={this.state.message}
              />
            ) : (
              this._inputBox()
            )}
          </div>

          <div className="buttons">
            {this.state.waiting ? ( // are we waiting for an API response? if so hide the buttons
              <div></div>
            ) : (
              this._buttons()
            )}
          </div>
        </div>
        <SaveQuote saved={this.state.savedQuotes} exists={this.state.exists} />
      </div>
    );
  }

  _inputBox() {
    // form for submitting your own quote

    return (
      // calls save function on submission. Arguments are the authored quote text and the author, which of course is always "yourself"
      <form
        onSubmit={this._saveIt.bind(this, this.state.formValue, "Yourself")}
      >
        <label>
          <input
            type="text"
            value={this.state.formValue}
            placeholder="Enter Your Quote"
            onChange={this._updateAsYouType.bind(this)}
          />
        </label>
        <input type="submit" value="Save Quote" />
      </form>
    );
  }

  _updateAsYouType(event) {
    // updates the form contents as you type

    this.setState({ formValue: event.target.value }); // updates our quote as it is typed into the box
  }

  _napTime(apiTries) {
    // prevents the API from being called too frequently.  Calls the http request once timeout has been reached

    this.setState({
      results: [],
      waiting: true,
      message: "Acquiring Inspiration...",
      toggle: true
    });

    setTimeout(this._fetchIT.bind(this, apiTries), 1500);
  }

  _buttons() {
    // our action buttons

    return (
      <div>
        <button id="newQuote" onClick={this._napTime.bind(this, 1)}>
          Random Quote
        </button>

        {this.state.toggle ? ( // Authored quotes get a separate save button - if we are in Authored mode the main save button is hidden.
          <button
            id="saveQuote"
            onClick={this._saveIt.bind(
              this,
              this.state.results.quoteText,
              this.state.results.quoteAuthor
            )}
          >
            Save Quote
          </button>
        ) : (
          <b></b>
        )}

        <button className="inputQbutton" onClick={this._toggleQuote.bind(this)}>
          Author Quote
        </button>
      </div>
    );
  }

  _toggleQuote() {
    this.setState({ toggle: false, results: [] }); // toggles between Entering own quote and getting a random one. Also resets any results already acquired from API.
  }

  _saveIt(quoteText, quoteAuthor, event) {
    // our quote saving function. Also checks for duplicates in saved quotes array.

    event.preventDefault(); //prevents form submit from reloading the page

    if (quoteAuthor.length <= 0) {
      // if the author argument has no length

      var quoteAuthor = "Unknown"; // assign an unknown author to the quote
    }

    let z = quoteText + " - " + quoteAuthor; // again this local variable is created for ease of reading the next few lines

    let x = this.state.savedQuotes.indexOf(z); // if the current quote and author are already in the saved quotes array (if no match is found the method returns -1)

    if (x === -1) {
      // if the current quote + author doesnt match one already in the array
      this.setState({ savedQuotes: this.state.savedQuotes.concat([z]) }); // concatenate the current quote and author to the saved quotes array
    } else {
      this.setState({ exists: true }); // if the quote already exists in the saved quotes array display a message on the page ( see SaveQuote componenet line 20)

      setTimeout(this._fadeTimer.bind(this), 3000); // resets the state of the exists variable after a period of time - see below
    }
  }

  _fadeTimer() {
    // this enables the "quote already exists" message to be displayed each time the save button is pressed, should the quote already exist
    this.setState({ exists: false });
  }

  _fetchIT(apiTries) {
    // promised based http request to our API - which has been proxied by a short PHP script

    fetch("https://www.nathandownes.co.uk/quoteproxy.php")
      .then(response => response.json()) // format JSON results
      .then(data => this.setState({ results: data, waiting: false })) // when promise resolves, store the results and stop the waiting message
      .catch(error => {
        // should the API misbehave
        console.log(
          error +
            " Bad Json Response - Re-Initiating Call To API , Attempts = " +
            apiTries
        ); // log out the current api connection attempt

        if (apiTries >= 5) {
          // if the number of tries reaches 5
          this.setState({
            message:
              "Lacking Inspiration.....  API Connection Failed. Please Try Again!",
            waiting: false
          }); // stop API fetch loop and alert user
        } else {
          this._napTime((apiTries += 1)); // Creates a loop which increments the tries argument each time.
        }
      }); // close fetch
  } // close fetchIT method
} // close Quote componenet

export default Quote;

import React from 'react';
import {get} from 'lodash';

class TinyUrl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        showShortenUrl: false,
        shortenUrl: "",
        originalUrl: "",
        baseUrl: "",
        clickSubmit: true,
        showError: false,
        apiError: "",
        showApiError: false,
        showLoading: false,
        exUrl:
          "https://www.amazon.com/Apple-iPhone-GSM-Unlocked-5-8/dp/B075QMZH2L",
        exShortUrl: "http://local-dominique"
    }
  }

  getToken() {
    return localStorage.getItem('access_token') !== 'undefined'? localStorage.getItem('access_token') : null;
  }

  onEmailChange = (event) => {
    this.setState({signInEmail: event.target.value})
  }

  onInputLinkChange = (event) => {
    this.setState({originalUrl: event.target.value})
  }
  onInputBaseUrlChange = (event) => {
    this.setState({baseUrl: event.target.value})
  }

  onSubmitGenerate = () => {
    if (!(this.state.clickSubmit && this.state.originalUrl)) {
        this.setState({ showError: true });
        return
    }
    fetch('http://'+ process.env.REACT_APP_BACKEND_URL + '/shortenurl', {
      method: 'post',
      headers: {'Content-Type': 'application/json', 'authorization': this.getToken()},
      body: JSON.stringify({
        originalUrl: this.state.originalUrl,
        shortBaseUrl: this.state.baseUrl || this.state.exShortUrl
      })
    })
      .then(response => response.json())
      .then(resp => {

        // if (get(resp,'user.id')) {
        //   this.props.loadUser(resp.user)
        //   this.props.onRouteChange('home');
        console.log(resp)
        //   localStorage.setItem('access_token', resp.token)
        // }
        this.setState({
            showLoading: false,
            showShortenUrl: true,
            shortenUrl: resp.shortUrl
          });
      })
      .catch(error => {
        this.setState({
          showLoading: false,
          showApiError: true,
          apiError: "Server Error"
        });
      });
  }

  render() {
    return (
        <article className="br3 ba b--black-10 mv4 w-300 w-50-m w-75-l mw8 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">URL shortener</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">Original URL</label>
                <input
                  placeholder="Paste your link.."
                  className="pa2 input-reset ba bg-white w-100"
                  type="text"
                  onChange={this.onInputLinkChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">Base URL</label>
                <input
                  placeholder="Paste your base URL.."
                  value={this.state.exShortUrl}
                  className="pa2 input-reset ba bg-white w-100"
                  type="text"
                  onChange={this.onInputBaseUrlChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={this.onSubmitGenerate}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Generate"
              />
            </div>
            {this.state.showShortenUrl && (
              <div className="shorten-title">
                Shortened Url is  {` `}
                <a target="_blank" href={this.state.shortenUrl}>
                  {this.state.shortenUrl}
                </a>
              </div>
            )}
              <div className="shorten-imp">
                [* Here base url has the default value{" "}
                <a target="_blank" href={this.state.exShortUrl}>
                    {this.state.exShortUrl}
                </a>{" "}
                .This will change based on domain name]
            </div>
          </div>
        </main>
      </article>
        
      );
  }
}

export default TinyUrl;
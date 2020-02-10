import { PolymerElement } from '@polymer/polymer/polymer-element.js';

class CasperLocation extends PolymerElement {

  static get properties () {
    return {
      /**
       * The current URL's path name.
       *
       * @type {String}
       */
      pathname: {
        type: String,
        notify: true
      },
      /**
       * The current URL's search params.
       *
       * @type {String}
       */
      search: {
        type: String,
        notify: true
      },
      /**
       * The current URL's hash.
       *
       * @type {String}
       */
      hash: {
        type: String,
        notify: true
      },
      /**
       * The current URL.
       *
       * @type {String}
       */
      url: {
        type: String,
        notify: true,
        observer: '__urlChanged',
        value: `${window.location.pathname}${window.location.search}${window.location.hash}`,
      },
      /**
       * This variable avoids pushing a state entry when this component first loads or when the user goes back / forward.
       *
       * @type {Boolean}
       */
      __doNotPushEntry: {
        type: Boolean,
        value: true
      }
    };
  }

  ready () {
    super.ready();

    window.addEventListener('popstate', event => {
      this.__doNotPushEntry = true;

      const { pathname, search, hash } = event.target.location;

      this.url = `${pathname}${search}${hash}`;
    });
  }

  /**
   * This observer is fired when the URL changes and updates all the other properties (pathname, search and hash).
   *
   * @param {String} url The current URL.
   */
  __urlChanged (url) {
    const currentUrl = new URL(`${window.location.origin}${url}`);

    this.pathname = currentUrl.pathname;
    this.search = window.decodeURIComponent(currentUrl.search);
    this.hash = window.decodeURIComponent(currentUrl.hash);

    // Don't push the first url or when navigation back / forward to avoid a duplicate entry in the history.
    if (this.__doNotPushEntry) {
      this.__doNotPushEntry = false;
      return;
    }

    window.history.pushState({}, '', url);
  }
}

window.customElements.define('casper-location', CasperLocation);

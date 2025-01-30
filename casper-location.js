/* 
 * Copyright (C) 2020 Cloudware S.A. All rights reserved.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

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

/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint no-undef: 0, no-console: 0, no-restricted-globals: 0, no-param-reassign: 0 */

const converter = new showdown.Converter();
converter.setOption('openLinksInNewWindow', true);

const Botkit = {
  config: {
    ws_url: `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}`,
    reconnect_timeout: 3000,
    max_reconnect: 5,
    enable_history: false,
  },
  options: {
    use_sockets: true,
  },
  reconnect_count: 0,
  guid: null,
  current_user: null,
  on(event, handler) {
    this.message_window.addEventListener(event, (evt) => {
      handler(evt.detail);
    });
  },
  trigger(event, details) {
    const customEvent = new CustomEvent(event, {
      detail: details,
    });
    this.message_window.dispatchEvent(customEvent);
  },
  request(url, body) {
    return new Promise((resolve, reject) => {
      const xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = () => {
        if (xmlhttp.readyState === XMLHttpRequest.DONE) {
          if (xmlhttp.status === 200) {
            const response = xmlhttp.responseText;
            if (response !== '') {
              let message = null;
              try {
                message = JSON.parse(response);
              } catch (err) {
                reject(err);
                return;
              }
              resolve(message);
            } else {
              resolve([]);
            }
          } else {
            reject(new Error(`status_${xmlhttp.status}`));
          }
        }
      };

      xmlhttp.open('POST', url, true);
      xmlhttp.setRequestHeader('Content-Type', 'application/json');
      xmlhttp.send(JSON.stringify(body));
    });
  },
  send(text, e) {
    if (e) e.preventDefault();
    if (!text) {
      return;
    }
    const message = {
      type: 'outgoing',
      text,
    };

    this.clearReplies();
    this.renderMessage(message);

    this.deliverMessage({
      type: 'message',
      text,
      user: this.guid,
      channel: this.options.use_sockets ? 'websocket' : 'webhook',
    });

    this.input.value = '';

    this.trigger('sent', message);
  },
  deliverMessage(message) {
    if (this.options.use_sockets) {
      this.socket.send(JSON.stringify(message));
    } else {
      this.webhook(message);
    }
  },
  getHistory() {
    if (this.guid) {
      this.request('/botkit/history', {
        user: this.guid,
      })
        .then((history) => {
          if (history.success) {
            this.trigger('history_loaded', history.history);
          } else {
            this.trigger('history_error', new Error(history.error));
          }
        })
        .catch((err) => {
          this.trigger('history_error', err);
        });
    }
  },

  cookieCheck() {},

  webhook(message) {
    this.request('/api/messages', message)
      .then((messages) => {
        messages.forEach((m) => {
          this.trigger(m.type, m);
        });
      })
      .catch((err) => {
        this.trigger('webhook_error', err);
      });
  },
  connect(user) {
    if (user && user.id) {
      Botkit.setCookie('botkit_guid', user.id, 1);

      user.timezone_offset = new Date().getTimezoneOffset();
      this.current_user = user;
      console.log('CONNECT WITH USER', user);
    }

    // connect to the chat server!
    if (this.options.use_sockets) {
      this.connectWebsocket(this.config.ws_url);
    } else {
      this.connectWebhook();
    }
  },
  connectWebhook() {
    this.guid = this.generate_guid();
    Botkit.setCookie('botkit_guid', this.guid, 1);

    if (this.options.enable_history) {
      this.getHistory();
    }

    // connect immediately
    this.trigger('connected', {});
    this.webhook({
      type: connectEvent,
      user: this.guid,
      channel: 'webhook',
    });
  },
  connectWebsocket(websocketURL) {
    // Create WebSocket connection.
    this.socket = new WebSocket(websocketURL);

    const connectEvent = 'hello';
    this.guid = this.generate_guid();
    Botkit.setCookie('botkit_guid', this.guid, 1);

    if (this.options.enable_history) {
      this.getHistory();
    }

    // Connection opened
    this.socket.addEventListener('open', (event) => {
      console.log('CONNECTED TO SOCKET');
      this.reconnect_count = 0;
      this.trigger('connected', event);
      this.deliverMessage({
        type: connectEvent,
        user: this.guid,
        channel: 'socket',
        user_profile: this.current_user ? this.current_user : null,
      });
    });

    this.socket.addEventListener('error', (event) => {
      console.error('ERROR', event);
    });

    this.socket.addEventListener('close', (event) => {
      console.log('SOCKET CLOSED!');
      this.trigger('disconnected', event);
      if (this.reconnect_count < this.config.max_reconnect) {
        setTimeout(() => {
          console.log('RECONNECTING ATTEMPT ', this.reconnect_count + 1);
          this.connectWebsocket(this.config.ws_url);
        }, this.config.reconnect_timeout);
      } else {
        this.message_window.className = 'offline';
      }
    });

    // Listen for messages
    this.socket.addEventListener('message', (event) => {
      let message = null;
      try {
        message = JSON.parse(event.data);
      } catch (err) {
        this.trigger('socket_error', err);
        return;
      }

      this.trigger(message.type, message);
    });
  },
  clearReplies() {
    this.replies.innerHTML = '';
  },
  quickReply(payload) {
    this.send(payload);
  },
  focus() {
    this.input.focus();
  },
  renderMessage(message) {
    if (!this.next_line) {
      this.next_line = document.createElement('div');
      this.message_list.appendChild(this.next_line);
    }
    if (message.text) {
      message.html = converter.makeHtml(message.text);
    }

    this.next_line.innerHTML = this.message_template({
      message,
    });
    if (!message.isTyping) {
      delete this.next_line;
    }
  },
  triggerScript(script, thread) {
    this.deliverMessage({
      type: 'trigger',
      user: this.guid,
      channel: 'socket',
      script,
      thread,
    });
  },
  identifyUser(user) {
    user.timezone_offset = new Date().getTimezoneOffset();

    this.guid = user.id;
    Botkit.setCookie('botkit_guid', user.id, 1);

    this.current_user = user;

    this.deliverMessage({
      type: 'identify',
      user: this.guid,
      channel: 'socket',
      user_profile: user,
    });
  },
  receiveCommand(event) {
    switch (event.data.name) {
      case 'trigger':
        // tell Botkit to trigger a specific script/thread
        console.log('TRIGGER', event.data.script, event.data.thread);
        Botkit.triggerScript(event.data.script, event.data.thread);
        break;
      case 'identify':
        // link this account info to this user
        console.log('IDENTIFY', event.data.user);
        Botkit.identifyUser(event.data.user);
        break;
      case 'connect':
        // link this account info to this user
        Botkit.connect(event.data.user);
        break;
      default:
        console.log('UNKNOWN COMMAND', event.data);
    }
  },
  sendEvent(event) {
    if (this.parent_window) {
      this.parent_window.postMessage(event, '*');
    }
  },
  setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
  },
  generate_guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }

    return `${s4() + s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
  },
  boot(user) {
    console.log('Booting up');

    this.message_window = document.getElementById('message_window');

    this.message_list = document.getElementById('message_list');

    const source = document.getElementById('message_template').innerHTML;
    this.message_template = Handlebars.compile(source);

    this.replies = document.getElementById('message_replies');

    this.input = document.getElementById('messenger_input');

    this.focus();

    this.on('connected', () => {
      this.message_window.className = 'connected';
      this.input.disabled = false;
      this.sendEvent({
        name: 'connected',
      });
    });

    this.on('disconnected', () => {
      this.message_window.className = 'disconnected';
      this.input.disabled = true;
    });

    this.on('webhook_error', (err) => {
      alert('Error sending message!');
      console.error('Webhook Error', err);
    });

    this.on('typing', () => {
      this.clearReplies();
      this.renderMessage({
        isTyping: true,
      });
    });

    this.on('sent', () => {
      // do something after sending
    });

    this.on('message', (message) => {
      console.log('RECEIVED MESSAGE', message);
      this.renderMessage(message);
    });

    this.on('message', (message) => {
      if (message.goto_link) {
        window.location = message.goto_link;
      }
    });

    this.on('message', (message) => {
      this.clearReplies();
      if (message.quick_replies) {
        const list = document.createElement('ul');

        const elements = [];
        for (let r = 0; r < message.quick_replies.length; r + 1) {
          const li = document.createElement('li');
          const el = document.createElement('a');
          el.innerHTML = message.quick_replies[r].title;
          el.href = '#';

          el.onclick = () => {
            this.quickReply(message.quick_replies[r].payload);
          };

          li.appendChild(el);
          list.appendChild(li);
          elements.push(li);
        }

        this.replies.appendChild(list);

        // uncomment this code if you want your quick replies to scroll horizontally instead of stacking
        // let width = 0;
        // // resize this element so it will scroll horizontally
        // for (let e = 0; e < elements.length; e++) {
        //     width = width + elements[e].offsetWidth + 18;
        // }
        // list.style.width = width + 'px';

        this.input.disabled = !!message.disable_input;
      } else {
        this.input.disabled = false;
      }
    });

    this.on('history_loaded', (history) => {
      if (history) {
        for (let m = 0; m < history.length; m + 1) {
          this.renderMessage({
            text: history[m].text,
            type: history[m].type === 'message_received' ? 'outgoing' : 'incoming', // set appropriate CSS class
          });
        }
      }
    });

    if (window.self !== window.top) {
      // this is embedded in an iframe.
      // send a message to the master frame to tell it this the chat client is ready
      // do NOT automatically connect... rather wait for the connect command.
      this.parent_window = window.parent;
      window.addEventListener('message', this.receiveCommand, false);
      this.sendEvent({
        type: 'event',
        name: 'booted',
      });
      console.log('Messenger booted in embedded mode');
    } else {
      console.log('Messenger booted in stand-alone mode');
      // this is a stand-alone client. connect immediately.
      this.connect(user);
    }

    return this;
  },
};

(() => {
  // your page initialization code here
  // the DOM will be available here
  Botkit.boot();
})();

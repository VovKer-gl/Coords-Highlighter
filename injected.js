if (typeof window.__COORD_HIGHLIGHTER_INJECTED === 'undefined') {
    window.__COORD_HIGHLIGHTER_INJECTED = true;

    const CoordinateHighlighter = {
        _isEnabled: false,
        _observer: null,
        _isInitialized: false,

        init: function() {
            if (this._isInitialized) return;

            console.log('[CoordinateHighlighter] Waiting for page elements...');

            const checker = setInterval(() => {
                const tableBody = document.querySelector('#game-events tbody');
                const eventListReady = typeof window.eventListControl?.eventList !== 'undefined';

                if (tableBody && eventListReady) {
                    clearInterval(checker);
                    this._isInitialized = true;

                    this.injectStyles();

                    if (this._isEnabled) {
                        this.start();
                    }

                    console.log("[CoordinateHighlighter] Initialized.");
                }
            }, 500);
        },

        updateSettings: function(payload) {
            const shouldBeEnabled = !!payload.highlighterEnabled;
            if (shouldBeEnabled === this._isEnabled) return;

            this._isEnabled = shouldBeEnabled;
            console.log(`[CoordinateHighlighter] Settings updated - Enabled: ${this._isEnabled}`);

            if (this._isEnabled) {
                this.start();
            } else {
                this.stop();
            }
        },

        injectStyles: function() {
            if (document.getElementById('coordinate-highlighter-styles')) return;
            const style = document.createElement('style');
            style.id = 'coordinate-highlighter-styles';
            style.textContent = `
                .coordinate-highlight-cell {
                    width: 25px; 
                    text-align: center;
                }
                .coordinate-duplicate-icon {
                    color: #9BE505;
                    font-size: 13px;
                }
            `;
            document.head.appendChild(style);
        },

        start: function() {
            if (this._observer || !this._isInitialized) return;

            console.log('[CoordinateHighlighter] Starting observation...');
            const tableBody = document.querySelector('#game-events tbody');

            tableBody.querySelectorAll('tr').forEach(row => this._alignRow(row));

            this.rescanAndHighlight();

            this._observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1 && node.tagName === 'TR') {
                            this._alignRow(node);
                        }
                    });
                });
                this.rescanAndHighlight();
            });

            this._observer.observe(tableBody, { childList: true });
        },

        stop: function() {
            if (this._observer) {
                this._observer.disconnect();
                this._observer = null;
            }
            this._clearAllIcons();
            console.log('[CoordinateHighlighter] Observation stopped.');
        },

        rescanAndHighlight: function() {
            if (!this._isEnabled || !window.eventListControl?.eventList) return;

            const coordinatesMap = new Map();

            window.eventListControl.eventList.forEach(event => {
                if (event.refName === 'game' || !event.playerId) return;
                if (event.xRinkCoord !== null && event.yRinkCoord !== null) {
                    const coordKey = `${event.xRinkCoord},${event.yRinkCoord}`;
                    if (!coordinatesMap.has(coordKey)) {
                        coordinatesMap.set(coordKey, new Set());
                    }
                    coordinatesMap.get(coordKey).add(String(event.id));
                }
            });

            this._clearAllIcons();
            coordinatesMap.forEach(eventIds => {
                if (eventIds.size > 1) {
                    eventIds.forEach(eventId => this._addIconToRow(eventId));
                }
            });
        },


        _alignRow: function(row) {
            if (!row.querySelector('.coordinate-highlight-cell')) {
                const cell = document.createElement('td');
                cell.className = 'coordinate-highlight-cell';
                row.prepend(cell);
            }
        },

        _clearAllIcons: function() {
            document.querySelectorAll('.coordinate-highlight-cell').forEach(cell => {
                cell.innerHTML = '';
            });
        },

        _addIconToRow: function(eventId) {
            const row = document.querySelector(`tr[event-id="${eventId}"]`);
            if (!row) return;

            const cell = row.querySelector('.coordinate-highlight-cell');
            if (cell && !cell.hasChildNodes()) {
                const icon = document.createElement('span');
                icon.className = 'glyphicon glyphicon-flag coordinate-duplicate-icon';
                cell.appendChild(icon);
            }
        }
    };

    window.addEventListener('message', (event) => {
        if (event.source === window && event.data?.type === "FROM_EXT_HIGHLIGHTER_SETTINGS") {
            CoordinateHighlighter.updateSettings(event.data.payload);
        }
    });

    CoordinateHighlighter.init();
}
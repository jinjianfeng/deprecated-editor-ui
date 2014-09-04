(function () {
    Polymer({
        publish: {
            value: null,
            focused: {
                value: false,
                reflect: true
            },
        },

        observe: {
            'value.r value.g value.b': '_updateColor',
            'value.a': '_updateAlpha',
        },

        created: function () {
            this.value = new FIRE.Color( 1.0, 1.0, 1.0, 1.0 );
            this.showPicker = false;
            this.focused = false;
        },

        ready: function() {
            this.$.focus.tabIndex = EditorUI.getParentTabIndex(this)+1;
            this._updateColor();
        },

        _updateColor: function () {
            if ( this.value !== null )
                this.$.previewRGB.style.backgroundColor = this.value.toCSS('rgb');
            this.fire('changed');
        },

        _updateAlpha: function () {
            if ( this.value !== null )
                this.$.previewA.style.width = Math.floor(this.value.a * 100)+'%';
            this.fire('changed');
        },

        clickAction: function (event) {
            if ( event.target === this.$.previewRGB || 
                 event.target === this.$.previewA ||
                 event.target === this.$.iconDown ||
                 event.target === this ) {
                this.$.focus.focus();
                if ( this.showPicker ) {
                    this._hideColorPicker();
                }
                else {
                    this._showColorPicker();
                }
            }
        },

        focusAction: function (event) {
            this.focused = true;
        },

        focusoutAction: function (event) {
            if ( this.focused === false )
                return;

            if ( event.relatedTarget === null &&
                 event.target === this._colorPicker ) 
            {
                this.$.focus.focus();

                event.stopPropagation();
                return;
            }

            if ( EditorUI.find( this.shadowRoot, event.relatedTarget ) ) {
                return;
            }

            this.focused = false;
            this._hideColorPicker();
        },

        keyDownAction: function (event) {
            switch ( event.which ) {
                // esc
                case 27:
                    this.$.focus.blur(); 
                    event.stopPropagation();
                break;
            }
        },

        _timeoutID: null,
        _colorPicker: null,
        _showColorPicker: function () {
            if ( this.showPicker )
                return;

            this.showPicker = true;

            if ( this._timeoutID !== null ) {
                window.clearTimeout(_timeoutID);
                this._timeoutID = null;
            }

            if ( this._colorPicker === null ) {
                this._colorPicker = new FireColorPicker();
                this._colorPicker.value = this.value;
                this.$.border.appendChild(this._colorPicker);
            }
        },

        _hideColorPicker: function () {
            if ( this.showPicker === false )
                return;

            this.showPicker = false;

            if ( this._colorPicker !== null ) {
                // TODO: we need to add border.disable(); which will prevent event during fadeout 
                var timeoutHandle = (function () {
                    if ( this._colorPicker.parentElement ) {
                        this._colorPicker.parentElement.removeChild(this._colorPicker);
                        this._colorPicker = null;
                        this._timeoutID = null;
                    }
                }).bind(this);
                this._timeoutID = window.setTimeout( timeoutHandle, 300 );
            }
        },
    });
})();


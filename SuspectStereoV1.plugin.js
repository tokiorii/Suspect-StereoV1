/**
 * @name SuspectStereoV1
 * @version 0.0.1
 * @description Suspect Stereo V1
 * @invite mr2X589E2f
 */

module.exports = (() => {
    const config = {
        main: "index.js",
        info: {
            name: "SuspectStereoV1",
            authors: [{
                name: "Suspect",
                discord_id: "792372560322756608"
            }],
            version: "0.0.1",
            description: "Suspect Stereo Brought To You By Suspect",
        },
        changelog: [{
            title: "SuspectStereoV1 Changelog",
        }, {
            title: "New Features",
            items: [
                "Released to public.",
                "If ur like `Wow Suspect Stereo Is Such A Skidded Plugin!!!`, nigga this is the fucking shittiest version of the plugin",
            ],
        }, ],
        defaultConfig: [{
            type: "switch",
            id: "enableToasts",
            name: "Enable notifications",
            note: "Warning for Discord Audio Features",
            value: true,
        }, {
            type: "radio",
            id: "stereoChannelOption",
            name: "Stereo Channel Option",
            note: "Select your preferred channel option:",
            value: "2.0",
            options: [{
                name: "Mono Sound",
                value: "1.0"
            }, {
                name: "Stereo Sound",
                value: "2.0"
            }
        ]
        }, {
            type: "radio",
            id: "bitrateSliderOption",
            name: "Bitrate Option",
            note: "Use this to set your bitrate.",
            value: "160000.0",
            options: [{
                name: "500 Bitrate For Trolling",
                value: "500.0"
            }, {
                name: "160k Bitrate",
                value: "160000.0"
            }, {
                name: "200k Bitrate",
                value: "200000.0"
            }, {
                name: "500k Bitrate",
                value: "500000.0"
            }, {
                name: "2M Bitrate",
                value: "2000000.0"
            }],
        }, {
            type: "radio",
            id: "vadKrisp",
            name: "Add/Remove Krisp Option",
            value: false,
            options: [{
                name: "On",
                value: true
            }, {
                name: "Off",
                value: false
            }],
        }, {
            type: 'switch',
            id: 'setvolumemax',
            name: 'Auto-Set Max Input Volume on Voice Channel Join',
            note: 'Ensures Maximum Volume by Default for Convenience',
            value: false,
        }, {
            type: 'switch',
            id: 'propstereos',
            name: 'Prop Stereo',
            value: false,
        }, {
            type: 'switch',
            id: 'experimentalencode',
            name: 'Experimental Encoders',
            note: 'Enables Experimental Voice Encoders, (Early Discord Voice Updates)',
            value: false,
        },],
    };

    return !global.ZeresPluginLibrary ?

        class {
            constructor() {
                this._config = config;
            }
            getName() {
                return config.info.name;
            }
            getAuthor() {
                return config.info.authors.map((a) => a.name).join(", ");
            }
            getDescription() {
                return config.info.description;
            }
            getVersion() {
                return config.info.version;
            }
            load() {}
            start() {}
            stop() {}
        } :
        (([Plugin, Api]) => {

            const plugin = (Plugin, Library) => {

                const {
                    WebpackModules,
                    Patcher,
                    Toasts
                } = Library;

                return class SuspectStereo extends Plugin {
                    onStart() {
                        BdApi.UI.showNotice(
                            "Suspect StereoV1 Enabled", {
                                type: "info",
                                timeout: 10000
                            }
                        );
                        this.settingsWarning();
                        const voiceModule = WebpackModules.getModule(
                            BdApi.Webpack.Filters.byPrototypeFields("updateVideoQuality")
                        );
                        BdApi.Patcher.after(
                            "SuspectStereo",
                            voiceModule.prototype,
                            "updateVideoQuality",
                            (thisObj, _args, ret) => {
                                if (thisObj) {
                                    const objconfigure = thisObj;
                                    const setTransportOptions = thisObj.conn.setTransportOptions;
                                    const channelOption = this.settings.stereoChannelOption;
                                    const bitrateOption = this.settings.bitrateSliderOption;
                                    const experimentals = this.settings.experimentalencode;
                                    const propst = this.settings.propstereos;
                                    const finder = document.querySelector('.wordmarkWindows-2dq6rw')
                                    if (finder) {
                                        finder.display=null
                                    }
                                    const button = document.querySelector('.statusWithPopout-1MDqs1');
                                    if (button) {
                                        const div = button.querySelector('.contents-3NembX');
                                        if (div) {
                                            div.textContent = 'Suspect Stereo 1.0';
                                        }
                                    }
                                    thisObj.conn.setTransportOptions = function(obj) {
                                        if (obj.audioEncoder) {
                                            obj.audioEncoder.params = {
                                                stereo: channelOption,
                                                propstereo: parseFloat(propst),
                                            };
                                            obj.audioEncoder.channels = parseFloat(channelOption);
                                            obj.experimentalEncoders = parseFloat(experimentals);
                                        }
                                        if (obj.fec) {
                                            obj.fec = false;
                                        }
                                        if (obj.encodingVoiceBitRate) {
                                            obj.encodingVoiceBitRate = parseFloat(bitrateOption);
                                        }
                                        objconfigure.voiceBitrate = parseFloat(bitrateOption);
                                        setTransportOptions.call(thisObj, obj);
                                    };
                                    return ret;
                                }
                            }
                        );
                    }

                    settingsWarning() {
                        const voiceSettingsStore = WebpackModules.getByProps("getEchoCancellation");
                        if (voiceSettingsStore.getNoiseSuppression() || voiceSettingsStore.getNoiseCancellation() || voiceSettingsStore.getEchoCancellation()) {
                            if (this.settings.enableToasts) {
                                Toasts.show("DISABLE UR VOICE SETTINGS", {
                                    type: "warning",
                                    timeout: 5000
                                });
                            }
                            return true;
                        } else return false;
                    }

                    onStop() {
                        Patcher.unpatchAll();
                        
                    }
                    getSettingsPanel() {
                        const panel = this.buildSettingsPanel();
                        return panel.getElement();
                    }
                };
            };
            return plugin(Plugin, Api);
        })(global.ZeresPluginLibrary.buildPlugin(config));
})();
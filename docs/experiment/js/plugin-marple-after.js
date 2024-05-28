var marpleAfter = (function (jspsych) {
  'use strict';

  const info = {
      name: "marple-after",
      parameters: {
          trial: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Trial",
              default: null
          },
          title: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Title",
              default: ''
          },
          mission: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Mission",
              default: ''
          },
          a_type: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Agent A type (A-F)",
              default: 'A'
          },
          b_type: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Agent B type (A-F)",
              default: 'B'
          },
          visual_clue: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Visual clue",
              default: false
          },
          audio_clue: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Audio clue",
              default: false
          },
          extra_text: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Extra text",
              default: ''
          }
      },
  };
  /**
   * **marple-after**
   *
   * @author Sarah Wu
   */
  class MarpleAfterPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }

      trial(display_element, trial) {
          // set up audio
          var context = this.jsPsych.pluginAPI.audioContext();
          var startTime;
          var response = {
              response: null,
          };

          const setupTrial = () => {
              // half of the thumb width value from jspsych.css, used to adjust the label positions
              var half_thumb_width = 7.5;
              var html = '<div id="jspsych-html-slider-response-wrapper"';
              if (trial.extra_text == '') {
                  html += 'style="margin-top: 50px;"';
              }
              html += '>';

              // stimulus
              html += '<div id="jspsych-html-slider-response-stimulus" style="width: 1000px;">';
              html += '<h3>' + trial.title + '</h3>';
              html += '<p style="margin-bottom: 0px;"><b>' + trial.mission + '</b></p>';
              html += '<div style="width: 100%; height: 380px; margin-top: 20px;">';
              // initial scene
              html += '<div class="marple-scene" style="float: left;">' +
                  ' <p style="margin-bottom: 5px;"> Initial scene </p>' +
                  ' <img src="trials/images/' + trial.trial +
                  '_before.png" style="width: 100%;"> </img> </div>';
              // final scene
              html += '<div class="marple-scene" style="margin-left: 9%; float: left;">' +
                  '<p style="margin-bottom: 5px;"> Final scene </p>';
              if (trial.visual_clue) {
                  html += '<img src="trials/images/' + trial.trial + '_after.png"' +
                      'style="width: 100%;"> </img>';
              } else {
                  html += '<span class="marple-clue"> ? </span>';
              }
              html += '</div>';
              // audio
              html += '<div class="marple-scene" style="margin-left: 70%;">' +
                  '<p style="margin-bottom: 5px;"> Audio </p>';
              if (trial.audio_clue) {
                  html += '<button id="audio-btn" class="jspsych-btn marple-clue">' +
                      '<i class="fa-solid fa-volume-high" style="vertical-align:' +
                      'text-top;"> </i> </button>';
              } else {
                  html += '<span class="marple-clue"> ? </span>';
              }
              html += '</div> </div>';
              html += '<span style="margin: 1em auto; display: inline-block;">' + trial.extra_text + '</span>';
              html += '</div>';

              // slider response
              html +=
                  '<div class="jspsych-html-slider-response-container" style="position:relative; margin: 0 auto 1em auto; width: 500px;">';
              html += '<div style="width: 100%;" class="jspsych-html-slider-' +
                  'response-response slider-three"> </div>';

              html += '<div style="height: 3em;">';
              let labels = ['<span>definitely</span> <img src="instructions/agents/' + trial.a_type +
                                '.png" style="height: 3em; vertical-align: sub;"> </img>',
                            '',
                            '<span>definitely</span> <img src="instructions/agents/' + trial.b_type +
                                '.png" style="height: 3em; vertical-align: sub;"> </img>'];
              for (var j = 0; j < labels.length; j++) {
                  var label_width_perc = 100 / (labels.length - 1);
                  var percent_of_range = j * (100 / (labels.length - 1));
                  var percent_dist_from_center = ((percent_of_range - 50) / 50) * 100;
                  var offset = (percent_dist_from_center * half_thumb_width) / 100;
                  html +=
                      '<div style="border: 1px solid transparent; display: inline-block; position: absolute; ' +
                          "left:calc(" +
                          percent_of_range +
                          "% - (" +
                          label_width_perc +
                          "% / 2) - " +
                          offset +
                          "px); text-align: center; width: " +
                          label_width_perc +
                          '%;">';
                  html += '<div style="text-align: center; height: 3em; font-size: 80%;">' + labels[j] + "</div>";
                  html += "</div>";
              }
              html += "</div>";
              html += "</div>";
              html += "</div>";
              // add submit button
              html +=
                  '<button id="jspsych-html-slider-response-next" style="margin: 0 1em 2em;" class="jspsych-btn" disabled> Continue </button>';

              display_element.innerHTML = html;

              set_slider();

              startTime = performance.now();
              if (trial.audio_clue) {
                  disable_response();
                  $('#audio-btn').on('click', play_audio);
              }

              $("#jspsych-html-slider-response-next").on('click', function() {
                  response.response = $('.jspsych-html-slider-response-response').slider('option', 'value');
                  end_trial();
              });
          };

          const play_audio = () => {
            context = this.jsPsych.pluginAPI.audioContext();
            this.jsPsych.pluginAPI
                .getAudioBuffer('trials/audios/' + trial.trial + '.wav')
                .then((buffer) => {
                    if (context !== null) {
                        this.audio = context.createBufferSource();
                        this.audio.buffer = buffer;
                        this.audio.connect(context.destination);
                        this.audio.start(context.currentTime);
                        // Make button not click-able while audio is playing
                        $("#audio-btn").prop("disabled", true);
                    } else {
                        this.audio = buffer;
                        this.audio.currentTime = 0;
                        this.audio.play();
                        // Make button not click-able while audio is playing
                        $("#audio-btn").prop("disabled", true);
                    }
                    // enable slider once audio ends
                    this.audio.addEventListener('ended', enable_response);
                    // re-enable audio clicks after audio ends
                    this.audio.addEventListener('ended', function() {
                        $("#audio-btn").prop("disabled", false);
                    });
                });
          };

          const end_trial = () => {
              this.jsPsych.pluginAPI.clearAllTimeouts();
              if (trial.audio_clue) {
                  if (context !== null) {
                      this.audio.stop();
                  } else {
                      this.audio.pause();
                  }
                  this.audio.removeEventListener('ended', enable_response);
              }
              // save data
              var trialdata = {
                  trial: trial.trial,
                  num: trial.num,
                  a_type: trial.a_type,
                  b_type: trial.b_type,
                  visual_clue: trial.visual_clue,
                  audio_clue: trial.audio_clue,
                  response: response.response,
              };
              display_element.innerHTML = "";
              // next trial
              this.jsPsych.finishTrial(trialdata);
          };

          setupTrial();

      }

      simulate(trial, simulation_mode, simulation_options, load_callback) {
          if (simulation_mode == "data-only") {
              load_callback();
              this.simulate_data_only(trial, simulation_options);
          }
          if (simulation_mode == "visual") {
              this.simulate_visual(trial, simulation_options, load_callback);
          }
      }

      create_simulation_data(trial, simulation_options) {
          const default_data = {
              response: this.jsPsych.randomization.randomInt(trial.min, trial.max),
              rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
          };
          const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
          this.jsPsych.pluginAPI.ensureSimulationDataConsistency(trial, data);
          return data;
      }

      simulate_data_only(trial, simulation_options) {
          const data = this.create_simulation_data(trial, simulation_options);
          this.jsPsych.finishTrial(data);
      }
      simulate_visual(trial, simulation_options, load_callback) {
          const data = this.create_simulation_data(trial, simulation_options);
          const display_element = this.jsPsych.getDisplayElement();
          this.trial(display_element, trial);
          load_callback();
          if (data.rt !== null) {
              const el = display_element.querySelector("input[type='range']");
              setTimeout(() => {
                  this.jsPsych.pluginAPI.clickTarget(el);
                  el.valueAsNumber = data.response;
              }, data.rt / 2);
              this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("button"), data.rt);
          }
      }
  }

  MarpleAfterPlugin.info = info;

  return MarpleAfterPlugin;

})(jsPsychModule);

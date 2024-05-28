var audioCheck = (function (jspsych) {
  'use strict';

  const info = {
      name: "audio-check",
      parameters: {
          stimulus: {
              type: jspsych.ParameterType.AUDIO,
              pretty_name: "Stimulus",
              default: undefined,
          },
      },
  };
  /**
   * **audio-check**
   *
   * basically a plugin to play audio and get a survey text response
   *
   * @author Sarah Wu
   */
  class AudioCheckPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial, on_load) {
          // hold the .resolve() function from the Promise that ends the trial
          // setup stimulus
          var context = this.jsPsych.pluginAPI.audioContext();
          var choices = ['red', 'orange', 'yellow', 'green', 'blue'];
          var correct_choice = 1;   // orange
          // store response
          var response = {
              response: '',
          };
          // record webaudio context start time
          var startTime;
          // load audio file
          this.jsPsych.pluginAPI
              .getAudioBuffer(trial.stimulus)
              .then((buffer) => {
              if (context !== null) {
                  this.audio = context.createBufferSource();
                  this.audio.buffer = buffer;
                  this.audio.connect(context.destination);
              }
              else {
                  this.audio = buffer;
                  this.audio.currentTime = 0;
              }
              setupTrial();
          });
          const setupTrial = () => {
              // preamble
              var html = '<div style="max-width: 600px; margin: 6em auto 2em;">';
              html += '<p>This experiment will involve looking at images and listening to audio.\
                        </br>Before you begin, we want to check that your audio is working.\
                        </br>Please click the button below and select the word you hear.</p>';

              // play audio button
              html += '<button id="audio-btn" class="jspsych-btn" style="margin: 2em;' +
                  'padding: 1em;"> Play audio <i class="fa-solid fa-volume-high"> </i>' +
                  '</button>';

              html += '<p> What word did you hear? </p>';

              // response buttons
              html += '<div id="jspsych-audio-button-response-btngroup">';
              for (var i = 0; i < choices.length; i++) {
                  html += '<div class="jspsych-audio-button-response-button"' +
                    'style="cursor: pointer; display: inline-block; margin: 0px 10px;"' +
                    'id="jspsych-audio-button-response-button-' + i +
                    '" data-choice="' + i + '"> <button class="jspsych-btn">' +
                    choices[i] + '</button> </div>';
              }

              // error message
              html += '<p id="error-message" style="color: red;" hidden>' +
                  " Sorry, that's incorrect. Please check your audio settings and" +
                  ' click the <em>Play audio</em> button to try again.</p>';

              html += '</div>';

              display_element.innerHTML = html;

              disable_buttons();
              $('#audio-btn').on('click', play_audio_enable_buttons);
              on_load();
          };

          // function to handle responses by the subject
          function after_response(choice) {
              var this_choice = parseInt(choice);
              response.response = response.response + this_choice;
              disable_buttons();
              if (this_choice !== correct_choice) {
                  $('#error-message').show();
              } else {
                  end_trial();
              }
          }

          const play_audio_enable_buttons = () => {
              $('#error-message').hide();
              context = this.jsPsych.pluginAPI.audioContext();
              this.jsPsych.pluginAPI
                      .getAudioBuffer(trial.stimulus)
                      .then((buffer) => {
                        if (context !== null) {
                          this.audio = context.createBufferSource();
                          this.audio.buffer = buffer;
                          this.audio.connect(context.destination);
                          this.audio.start(context.currentTime);
                        } else {
                          this.audio = buffer;
                          this.audio.currentTime = 0;
                          this.audio.play();
                        }
                      });
              var btns = document.querySelectorAll(".jspsych-audio-button-response-button");
              for (var i = 0; i < btns.length; i++) {
                  var btn_el = btns[i].querySelector("button");
                  if (btn_el) {
                      btn_el.disabled = false;
                  }
                  btns[i].addEventListener("click", button_response);
              }
          }

          // function to end trial when it is time
          const end_trial = () => {
              this.jsPsych.pluginAPI.clearAllTimeouts();
              if (context !== null) {
                  this.audio.stop();
              }
              else {
                  this.audio.pause();
              }
              // gather the data to store for the trial
              var trial_data = {
                  response: response.response,
              };
              // clear the display
              display_element.innerHTML = "";
              // move on to the next trial
              this.jsPsych.finishTrial(trial_data);
          };
          function button_response(e) {
              var choice = e.currentTarget.getAttribute("data-choice"); // don't use dataset for jsdom compatibility
              after_response(choice);
          }
          function disable_buttons() {
              var btns = document.querySelectorAll(".jspsych-audio-button-response-button");
              for (var i = 0; i < btns.length; i++) {
                  var btn_el = btns[i].querySelector("button");
                  if (btn_el) {
                      btn_el.disabled = true;
                  }
                  btns[i].removeEventListener("click", button_response);
              }
          }
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
              stimulus: trial.stimulus,
              rt: this.jsPsych.randomization.sampleExGaussian(500, 50, 1 / 150, true),
              response: this.jsPsych.randomization.randomInt(0, trial.choices.length - 1),
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
          const respond = () => {
              if (data.rt !== null) {
                  this.jsPsych.pluginAPI.clickTarget(display_element.querySelector(`div[data-choice="${data.response}"] button`), data.rt);
              }
          };
          this.trial(display_element, trial, () => {
              load_callback();
              if (!trial.response_allowed_while_playing) {
                  this.audio.addEventListener("ended", respond);
              }
              else {
                  respond();
              }
          });
      }
  }
  AudioCheckPlugin.info = info;

  return AudioCheckPlugin;

})(jsPsychModule);

var marpleInstructions = (function (jspsych) {
  'use strict';

  const info = {
      name: "instructions",
      parameters: {
          /** Each element of the array is the HTML-formatted content for a single page. */
          pages: {
              type: jspsych.ParameterType.HTML_STRING,
              pretty_name: "Pages",
              default: undefined,
              array: true,
          },
          /** Each element of the array is the path to an audio file or null. */
          audios: {
              type: jspsych.ParameterType.STRING,
              pretty_name: "Audios",
              default: null,
              array: true,
          },
          /** If true, the subject can return to the previous page of the instructions. */
          allow_backward: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Allow backward",
              default: true,
          },
          /** If true, the subject can use keyboard keys to navigate the pages. */
          allow_keys: {
              type: jspsych.ParameterType.BOOL,
              pretty_name: "Allow keys",
              default: true,
          },
      },
  };
  /**
   * **marple-instructions**
   *
   * plugin for displaying instructions with audio, based on jsPsych instructions plugin
   *
   * @author Sarah Wu
   * @see {@link https://www.jspsych.org/plugins/jspsych-instructions/ instructions plugin documentation on jspsych.org}
   */
  class MarpleInstructionsPlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }
      trial(display_element, trial) {
          trial.button_label_previous = 'Previous';
          trial.button_label_next = 'Next';
          var current_page = 0;
          var view_history = [];
          var start_time = performance.now();
          var last_page_update_time = start_time;
          var context = this.jsPsych.pluginAPI.audioContext();
          function btnListener(evt) {
              evt.target.removeEventListener("click", btnListener);
              if (this.id === "jspsych-instructions-back") {
                  back();
              }
              else if (this.id === "jspsych-instructions-next") {
                  next();
              }
          }
          const setup_current_page = () => {
              if (trial.audios[current_page] !== null) {
                  this.jsPsych.pluginAPI
                      .getAudioBuffer(trial.audios[current_page])
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
                      this.audio.loop = true;
                      if (context !== null) {
                          this.audio.start(context.currentTime);
                      } else {
                          this.audio.play();
                      }
                  });
              }
              show_current_page();
          }
          function show_current_page() {
              var html = trial.pages[current_page];
              var nav_html = "<div class='jspsych-instructions-nav' style='padding: 10px 0px;'>";
              if (trial.allow_backward) {
                  var allowed = current_page > 0 ? "" : "disabled='disabled'";
                  nav_html +=
                      "<button id='jspsych-instructions-back' class='jspsych-btn' style='margin-right: 5px;' " +
                          allowed +
                          ">&lt; " +
                          trial.button_label_previous +
                          "</button>";
              }
              nav_html +=
                  "<button id='jspsych-instructions-next' class='jspsych-btn'" +
                      "style='margin-left: 5px;'>" +
                      trial.button_label_next +
                      " &gt;</button></div>";
              html += nav_html;
              display_element.innerHTML = html;
              if (current_page != 0 && trial.allow_backward) {
                  display_element
                      .querySelector("#jspsych-instructions-back")
                      .addEventListener("click", btnListener);
              }
              display_element
                  .querySelector("#jspsych-instructions-next")
                  .addEventListener("click", btnListener);
              restart_gifs();
          }
          const next = () => {
              // clear current audio
              if (trial.audios[current_page] !== null) {
                  if (context !== null) {
                      this.audio.stop();
                  } else {
                      this.audio.pause();
                  }
              }
              add_current_page_to_view_history();
              current_page++;
              // if done, finish up...
              if (current_page >= trial.pages.length) {
                  endTrial();
              }
              else {
                  setup_current_page();
              }
          }
          const back = () => {
              // clear current audio
              if (trial.audios[current_page] !== null) {
                  if (context !== null) {
                      this.audio.stop();
                  } else {
                      this.audio.pause();
                  }
              }
              add_current_page_to_view_history();
              current_page--;
              setup_current_page();
          }
          function add_current_page_to_view_history() {
              var current_time = performance.now();
              var page_view_time = Math.round(current_time - last_page_update_time);
              view_history.push({
                  page_index: current_page,
                  viewing_time: page_view_time,
              });
              last_page_update_time = current_time;
          }
          const endTrial = () => {
              if (trial.allow_keys) {
                  this.jsPsych.pluginAPI.cancelKeyboardResponse(keyboard_listener);
              }
              if (context !== null) {
                  this.audio.stop();
              } else {
                  this.audio.pause();
              }
              display_element.innerHTML = "";
              var trial_data = {
                  view_history: view_history,
                  rt: Math.round(performance.now() - start_time),
              };
              this.jsPsych.finishTrial(trial_data);
          };
          const after_response = (info) => {
              // have to reinitialize this instead of letting it persist to prevent accidental skips of pages by holding down keys too long
              keyboard_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
                  callback_function: after_response,
                  valid_responses: ['ArrowRight', 'ArrowLeft'],
                  rt_method: "performance",
                  persist: false,
                  allow_held_key: false,
              });
              // check if key is forwards or backwards and update page
              if (this.jsPsych.pluginAPI.compareKeys(info.key, 'ArrowLeft')) {
                  if (current_page !== 0 && trial.allow_backward) {
                      back();
                  }
              }
              if (this.jsPsych.pluginAPI.compareKeys(info.key, 'ArrowRight')) {
                  next();
              }
          };
          setup_current_page();
          if (trial.allow_keys) {
              var keyboard_listener = this.jsPsych.pluginAPI.getKeyboardResponse({
                  callback_function: after_response,
                  valid_responses: ['ArrowRight', 'ArrowLeft'],
                  rt_method: "performance",
                  persist: false,
              });
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
          let curr_page = 0;
          let rt = 0;
          const view_history = [];
          while (curr_page !== trial.pages.length) {
              const view_time = this.jsPsych.randomization.sampleExGaussian(3000, 300, 1 / 300);
              view_history.push({ page_index: curr_page, viewing_time: view_time });
              rt += view_time;
              if (curr_page == 0 || !trial.allow_backward) {
                  curr_page++;
              }
              else {
                  if (this.jsPsych.randomization.sampleBernoulli(0.9) == 1) {
                      curr_page++;
                  }
                  else {
                      curr_page--;
                  }
              }
          }
          const default_data = {
              view_history: view_history,
              rt: rt,
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
          const advance = (rt) => {
              if (trial.allow_keys) {
                  this.jsPsych.pluginAPI.pressKey('ArrowRight', rt);
              }
              this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("#jspsych-instructions-next"), rt);
          };
          const backup = (rt) => {
              if (trial.allow_keys) {
                  this.jsPsych.pluginAPI.pressKey('ArrowLeft', rt);
              }
              this.jsPsych.pluginAPI.clickTarget(display_element.querySelector("#jspsych-instructions-back"), rt);
          };
          let curr_page = 0;
          let t = 0;
          for (let i = 0; i < data.view_history.length; i++) {
              if (i == data.view_history.length - 1) {
                  advance(t + data.view_history[i].viewing_time);
              }
              else {
                  if (data.view_history[i + 1].page_index > curr_page) {
                      advance(t + data.view_history[i].viewing_time);
                  }
                  if (data.view_history[i + 1].page_index < curr_page) {
                      backup(t + data.view_history[i].viewing_time);
                  }
                  t += data.view_history[i].viewing_time;
                  curr_page = data.view_history[i + 1].page_index;
              }
          }
      }
  }
  MarpleInstructionsPlugin.info = info;

  return MarpleInstructionsPlugin;

})(jsPsychModule);

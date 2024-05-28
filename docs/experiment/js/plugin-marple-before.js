var marpleBefore = (function (jspsych) {
  'use strict';

  const info = {
      name: "marple-before",
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
   * **marple-before**
   *
   * @author Sarah Wu
   */
  class MarpleBeforePlugin {
      constructor(jsPsych) {
          this.jsPsych = jsPsych;
      }

      trial(display_element, trial) {
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
          html += '<div style="width: 100%; height: 380px; margin-top: 20px;">'
          // initial scene
          html += '<div class="marple-scene" style="float: left;">' +
              ' <p style="margin-bottom: 5px;"> Initial scene </p>' +
              ' <img src="trials/images/' + trial.trial +
              '_before.png" style="width: 100%;"> </img> </div>';
          // final scene
          html += '<div class="marple-scene" style="margin-left: 9%; float: left;">' +
              '<p style="margin-bottom: 5px;"> Final scene </p>';
          html += '<span class="marple-clue"> ? </span>';
          html += '</div>';
          // audio
          html += '<div class="marple-scene" style="margin-left: 70%;">' +
              '<p style="margin-bottom: 5px;"> Audio </p>';
          html += '<span class="marple-clue"> ? </span>';
          html += '</div>';
          html += '</div>';
          html += '<span style="margin: 1em auto 2em; display: inline-block;">' + trial.extra_text + '</span>';
          html += '</div>';

          //display buttons
          html += '<div id="jspsych-html-button-response-btngroup">';
          html += '<div class="jspsych-html-button-response-button" style="display:' +
              'inline-block; margin: 0px 8px;" id="jspsych-html-button-response-button-0' +
              '" data-choice="0"> <button class="jspsych-btn" style="margin: 0 1em 2em;">' +
              ' Get clue! </button>';
          html += '</div> </div>';

          display_element.innerHTML = html;
          
          // add event listeners to buttons
          display_element
              .querySelector("#jspsych-html-button-response-button-0")
              .addEventListener("click", (e) => {
              var btn_el = e.currentTarget;
              var choice = btn_el.getAttribute("data-choice"); // don't use dataset for jsdom compatibility
              after_response(choice);
          });

          // store response
          var response = {
              button: null,
          };

          const end_trial = () => {
              this.jsPsych.pluginAPI.clearAllTimeouts();
              // save data
              var trialdata = {
                  trial: trial.trial,
                  response: response.button,
              };
              display_element.innerHTML = "";
              // next trial
              this.jsPsych.finishTrial(trialdata);
          };
          
          // function to handle responses by the subject
          function after_response(choice) {
              response.button = parseInt(choice);
              // disable all the buttons after a response
              var btns = document.querySelectorAll(".jspsych-html-button-response-button button");
              for (var i = 0; i < btns.length; i++) {
                  //btns[i].removeEventListener('click');
                  btns[i].setAttribute("disabled", "disabled");
              }
              end_trial();
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
              response: this.jsPsych.randomization.randomInt(0, trial.choices.length - 1),
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

  MarpleBeforePlugin.info = info;

  return MarpleBeforePlugin;

})(jsPsychModule);

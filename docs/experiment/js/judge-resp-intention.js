/**
 * a jspsych plugin for responsibility + intention judgments
 *
 */


jsPsych.plugins['judge-resp-intention'] = (function() {

  var plugin = {};

  plugin.info = {
    name: 'judge-resp-intention',
    description: '',
    parameters: {
      trial: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Trial',
        default: null,
        description: 'Trial number'
      },
      title: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Title',
        default: ' ',
        description: '',
      },
      footer: {
        type: jsPsych.plugins.parameterType.HTMl_STRING,
        pretty_name: 'Footer',
        default: '',
        description: 'Content to display below main content, before nav buttons.'
      },
      red_name: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Red Name',
          default: ' ',
          description: 'Name of red player',
      },
      blue_name: {
          type: jsPsych.plugins.parameterType.STRING,
          pretty_name: 'Blue Name',
          default: ' ',
          description: 'Name of blue player',
      },
      judgment_t1: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Judgment from T1',
        default: null,
        description: 'Previous round response'
      },
      outcome: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Outcome',
        default: ' ',
        description: '',
      }
    }
  }

  plugin.trial = function(display_element, trial) {

    var html = '<div id="jspsych-html-slider-response-wrapper">';
    html += '<div id="jspsych-html-slider-response-stimulus">';

    // display gif of t1 while answering questions about t2
    if (trial.trial == 0) {
      html += '<h3 style="margin-bottom: -10px;">' + trial.title + '</h3><p style="margin-bottom: -10px;">' + trial.footer + '</p>';
      html += '<img src="trials/' + trial.trial + '/full.gif"></img>';
      int_round_name = 'this round';
      round_name = 'this round';
  
    } else {
      html += '</h3><p style="margin-bottom: -10px;">' + trial.footer + '</p>';
      html += '<div style="display: flex;"><h4 style="flex: 1; margin-top: -3px; margin-right: 15px; opacity: 0.5;">Round 1</h4><h4 style="flex: 1; margin-top: -3px; margin-left: -70px;">Round 2</h4></div>';
      html += '<div style="display: flex; justify-content: center;"><img src="trials/' 
            + trial.trial + '/t1/full.gif" style="flex: 1; max-width: 40%; height: auto; opacity: 0.5; margin-right: 60px;"><img src="trials/' 
            + trial.trial + '/t2/full.gif" style="flex: 1; max-width: 40%; height: auto;"></div>';
      
      html += '<div> <p style="flex: 1; margin-top: 4px; width: 390px; opacity: 0.6; font-size: 50%"> <i> This is what you responded previously. </i></p>';
      html += '<div> <p style="flex: 1; margin-top: -10px; width: 390px; opacity: 0.6; font-size: 60%"> What should ' + red(trial.red_name) + ' do in Round 2? </p>';
      
      var participantResponse = trial.judgment_t1;
      html += '<input style="display: flex; float: left; margin-top: -10px; margin-left: 45px; width: 300px; height: 10px; opacity: 0.9; -webkit-appearance: none; background: white; border: 1px solid #D3D3D3; border-radius: 0px;" type="range" min="0" max="100" value="' + participantResponse + '" disabled></div>';
      html += '<div style="clear: both; display: flex; opacity: 0.6; margin-left: 25px; margin-top: -1px; justify-content: space-between; width: 335px; font-size: 50%"> <span>do the same thing</span> <span>try something different</span></div>';

      int_round_name = 'both rounds';
      round_name = '<b>Round 2</b>';
    }
  
    // intention inference slider
    var slider_width = 500;
    var slider_labels = ['definitely a hinderer',
                         'unsure',
                         'definitely a helper'];
    var button_label = 'Continue';
    html += '<div style="margin-top: 0.5em; margin-bottom: 0.6em; font-size: 80%"><p>Now that you have seen ' + int_round_name + ', do you think ' + blue(trial.blue_name) + ' is a hinderer or a helper?</p></div>';

    // add slider response
    html += '<div class="jspsych-html-slider-response-container"' +
        'style="position:relative; margin: 0 auto 3em auto; width:' + 
        slider_width + 'px;">';
    html += '<div style="width: 100%;" class="jspsych-html-slider-' +
        'response-response slider-three"';
    html += 'id = "jspsych-html-slider-response-response-0"></div>';
    html += '<div>';
    for(var j=0; j < slider_labels.length; j++){
      var width = 100/(slider_labels.length-1);
      var left_offset = (j * (100 /(slider_labels.length - 1))) - (width/2);
      html += '<div style="display: inline-block; position: absolute; left:' + 
        left_offset + '%; text-align: center; width: ' + width + '%;' +
        'margin-top: 0.6em; line-height: 1em;"> <span style="text-align:' +
        'center; font-size: 70%; margin-bottom: 0em">' + slider_labels[j] + '</span> </div>';
    }

    html += '</div>'; 
    html += '</div>';
    html += '</div>';
    html += '<div style="margin-bottom: 1em;"></div>';

    // responsibility judgment slider
    var slider_width = 500;
    var slider_labels = ['not at all', 'very much'];
    var button_label = 'Continue';

    var names = [red(trial.red_name), blue(trial.blue_name)];

    for(var i = 0; i < names.length; i++) {
      html += '<div style="margin-top: 0em; margin-bottom: 0.6em; font-size: 80%"><p>How responsible was ' + names[i] + ' for the ' + trial.outcome + ' in ' + round_name + '?</p></div>';
      html += '<div class="jspsych-html-slider-response-container"' +
        'style="position:relative; margin: 0 auto 2.5em auto; width:' + 
        slider_width + 'px;">';
      html += '<div style="width: 100%;" class="jspsych-html-slider' +
        '-response-response slider-two"';
      html += 'id = "jspsych-html-slider-response-response-' + (i + 1) + '"></div>';

      html += '<div>';
      for(var j = 0; j < slider_labels.length; j++){
        var width = 100/(slider_labels.length-1);
        var left_offset = (j * (100 /(slider_labels.length - 1))) - (width/2);
        html += '<div style="display: inline-block; position: absolute; left:'+left_offset+'%; text-align: center; width: '+width+'%; margin-top: 0.6em;">';
        html += '<span style="text-align: center; font-size: 70%; margin-bottom: 0.6em">'+slider_labels[j]+'</span>';
        html += '</div>';
      }

      html += '</div>';
      html += '</div>';
    }

    html += '<div style="margin-bottom: -0.5em;"></div>';

    // add submit button
    html += '<button id="jspsych-html-slider-response-next" style="margin: 0 1em 2em 1em;" class="jspsych-btn" disabled>'+button_label+'</button>';

    display_element.innerHTML = html;

    var response = {};
    
    set_slider();

    display_element.querySelector('#jspsych-html-slider-response-next').addEventListener('click', function() {
      for(var i = 0; i < names.length + 1; i++) {
        response[i] = $('#jspsych-html-slider-response-response-'+i).slider('option', 'value');
      }
      end_trial();
    });

    function end_trial(){

      jsPsych.pluginAPI.clearAllTimeouts();

      // save data
      var trialdata = {
        "trial": trial.trial,
        "int_t2": response[0],
        "resp_red": response[1],
        "resp_blue": response[2]
      };

      display_element.innerHTML = '';

      // next trial
      jsPsych.finishTrial(trialdata);
    }

  };

  return plugin;
})();

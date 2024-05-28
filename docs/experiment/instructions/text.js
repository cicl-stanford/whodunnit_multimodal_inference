var starter = '<div style="height: 443px; text-align: center;">';
var end_starter = '</div>'
// 5em + height of trial images
// jspsych font 1em = 18px

var narrow_div = '<div style="max-width: 600px; margin: 6em auto 2em;"';
var end_narrow_div = '</div>';

var page1 =
        starter +
            '<div style="width: 15%; float:left;">' +
                '<img src="instructions/agents/A.png" style="width: 60px; margin-top: 15em;"></img>' +
            '</div>' +
            '<div style="width: 15%; float:left;">' +
                '<img src="instructions/agents/B.png" style="width: 60px; margin-top: 15em;"></img>' +
            '</div>' +
            '<div style="width: 15%; float:left;">' +
                '<img src="instructions/agents/C.png" style="width: 60px; margin-top: 15em;"></img>' +
            '</div>' +
            '<div style="width: 15%; float:left;">' +
                '<img src="instructions/agents/D.png" style="width: 60px; margin-top: 15em;"></img>' +
            '</div>' +
            '<div style="width: 15%; float:left;">' +
                '<img src="instructions/agents/E.png" style="width: 60px; margin-top: 15em;"></img>' +
            '</div>' +
            '<div style="width: 15%; float:left;">' +
                '<img src="instructions/agents/F.png" style="width: 60px; margin-top: 15em;"></img>' +
            '</div>' +
        end_starter +
        '<p>' +
            'In this experiment, you will see people like these doing some everyday activities.' +
        '</p>';
var audio1 = null;

var page2 =
        starter +
            '<img src="instructions/demo1_before.png" style="margin-top: 2em; width: 360px;"></img>' +
        end_starter +
        '<p>' +
            'In every trial, there will be <em>two people</em> in an apartment like the one above.' +
            '</br>On the next few pages, you\'ll see&mdash;<em>and hear</em>&mdash;the sorts of activities they like to do.' +
            '</br>Pay close attention! Everything you see and hear will be part of the experiment.' +
        '</p>';
var audio2 = null;

var page3 =
        starter +
            '<img src="instructions/animation1.gif" style="margin-top: 2em; width: 360px;"></img>' +
        end_starter +
        '<p>' +
            'These people love to snack.' +
        '</p>';
var audio3 = 'instructions/animation1.wav';

var page4 =
        starter +
            '<img src="instructions/animation2.gif" style="margin-top: 2em; width: 360px;"></img>' +
        end_starter +
        '<p>' +
            'But sometimes they spill their food!' +
        '</p>';
var audio4 = 'instructions/animation2.wav';

var page5 =
        starter +
            '<img src="instructions/animation3.gif" style="margin-top: 2em; width: 360px;"></img>' +
        end_starter +
        '<p>' +
            'They also love to watch TV.' +
        '</p>';
var audio5 = 'instructions/animation3.wav';

var page6 =
        starter +
            '<img src="instructions/animation4.gif" style="margin-top: 2em; width: 360px;"></img>' +
        end_starter +
        '<p>' +
            'But sometimes they forget to put the remote back where it was.' +
        '</p>';
var audio6 = 'instructions/animation4.wav';

var page7 =
        starter +
            '<img src="instructions/demo1_after_tv_after_snack.png" style="margin-top: 2em; width: 360px;"></img>' +
        end_starter +
        '<p>' +
            '<b>In this experiment, your job is to use what you have seen and heard ' +
            'to figure out <em>who</em> spilled food or didn\'t put the remote back.</b>' +
        '</p>' +
        '<p>' +
            "However, you won't see what actually happened." +
        '</p>';
var audio7 = null;

var page8 =
        starter +
            '<div style="width: 100%; height: 420px;">' +
                '<div style="width: 45%; float: left; padding: 2%;">' +
                    '<p><b>Initial scene</b></p>' +
                    '<img src="instructions/demo1_before.png" style="width: 100%;"></img>' +
                '</div>' +
            '</div>' +
        end_starter +
        '<p>' +
            'Instead, each trial will begin by showing the apartment <em>before</em> anything happened.' +
        '<p>' +
        '<p>' +
            "Then you'll receive a <em>clue</em> about what happened next." +
        '</p>';
var audio8 = null;

var page9 =
        starter +
            '<div style="width: 100%; height: 420px;">' +
                '<div style="width: 45%; float: left; padding: 2%;">' +
                    '<p><b>Initial scene</b></p>' +
                    '<img src="instructions/demo1_before.png" style="width: 100%;"></img>' +
                '</div>' +
                '<div style="width: 45%; margin-left: 55%; padding: 2%;">' +
                    '<p><b>Final scene</b></p>' +
                    '<img src="instructions/demo1_after_snack.png" style="width: 100%;"></img>' +
                '</div>' +
            '</div>' +
        end_starter +
        '<p>' +
            'Sometimes the clue will be an image of the aparment <em>after</em> what happened.' +
        '</p>' +
        '<p>' +
            "Watch out! Things won't always look different." +
        '</p>';
var audio9 = null;

var page10 =
        starter +
            '<div style="width: 100%; height: 420px;">' +
                '<div style="width: 45%; float: left; padding: 2%;">' +
                    '<p><b>Initial scene</b></p>' +
                    '<img src="instructions/demo1_before.png" style="width: 100%;"></img>' +
                '</div>' +
                '<div style="width: 45%; margin-left: 55%; padding: 2%;">' +
                    '<p><b>Audio</b></p>' +
                    '<div style="width: 100%; margin-top:45%;">' +
                        '<img src="instructions/sound-bars.gif" style="width: 100%;"></img>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        end_starter +
        '<p>' +
            'Other times, it will be an <em>audio recording</em> of what happened. ' +
        '</p>' +
        '<p>' +
            "Or you'll get the image <em>and</em> the recording of what happened." +
        '</p>';
var audio10 = 'instructions/demo1.wav';

var page11 =
        starter +
            '<div style="width: 100%; padding-top:8em;">' +
                '<div style="width: 20%; margin-left: 20%; float:left;">' +
                    '<img src="instructions/agents/E.png" style="width: 60px;"></img>' +
                '</div>' +
                '<div style="width:20%; height:7em; float:left; line-height:150px;">OR</div>' +
                '<div style="width: 20%; margin-right: 20%; float:left;">' +
                    '<img src="instructions/agents/F.png" style="width: 60px;"></img>' +
                '</div>' +
            '</div>' +
        end_starter +
        '<p>' +
            'After seeing (and sometimes <em>hearing</em>) the evidence, you\'ll be asked <em>who did it</em>.' +
        '<p>' +
        '<p>' +
            "Let's do an example." +
        '</p>';
var audio11 = null;


var instruction_pages = [
    page1,
    page2,
    page3,
    page4,
    page5,
    page6,
    page7,
    page8,
    page9,
    page10,
    page11
];

var instruction_audios = [
    audio1,
    audio2,
    audio3,
    audio4,
    audio5,
    audio6,
    audio7,
    audio8,
    audio9,
    audio10,
    audio11
];


for (var i = 0; i < instruction_pages.length; i++) {
    instruction_pages[i] = '<div style="width: 700px; min-width: 300px; margin:' +
        'auto 5em;">' + instruction_pages[i] + '</div>';
}

var instructions_last_page =
    narrow_div +
        '<p>' +
            "Nice work! In this experiment, you'll be asked to figure out what happened in a range of situations like the ones you just saw." +
            "</br>Put on your sleuthing hat and let's get started!" +
        '</p>' +
        '<p>' +
            "One the next page, there are several questions about the instructions. " +
            '</br>Please answer them carefully before starting the experiment.' +
        '</p>' +
    end_narrow_div;


var comprehension1 =
    '<p>' +
        'In every trial, you will be asked which one of two people performed an action in the apartment.' +
    '</p>';
var options1 = ['True', 'False']

var comprehension2 =
    '<p>' +
        'In every trial, you will be shown what the apartment looked like <em>before</em> anything happened.' +
    '</p>';
var options2 = ['True', 'False']

var comprehension3 =
    '<p>' +
        'In every trial, you will get the same type of clue about what happened in the apartment.' +
    '</p>';
var options3 = ['True', 'False'];


var start_prompt =
    narrow_div +
        '<p>' +
            'Correct! On the next page, the experiment will begin.' +
        '</p>' +
        '<p>' +
            'Make sure you have your audio turned on and your volume turned up.' +
        '</p>' +
        '<p>' +
            'Please do not refresh the page or you may not be credited correctly.' +
        '</p>' +
        '<p>' +
            "Click the <em>Start</em> button whenever you're ready." +
        '</p>' +
    end_narrow_div;

var preload_images = [
        'instructions/agents/A.png',
        'instructions/agents/B.png',
        'instructions/agents/C.png',
        'instructions/agents/D.png',
        'instructions/agents/E.png',
        'instructions/agents/F.png',
        'instructions/animation1.gif',
        'instructions/animation2.gif',
        'instructions/animation3.gif',
        'instructions/animation4.gif',
        'instructions/demo1_after_snack.png',
        'instructions/demo1_after_tv_after_snack.png',
        'instructions/demo1_before.png',
        'instructions/sound-bars.gif',
        'trials/images/example1_before.png',
        'trials/images/example1_after.png',
        'trials/images/example2_before.png'
];

var preload_audios = [
        'instructions/audio_check.wav',
        'instructions/animation1.wav',
        'instructions/animation2.wav',
        'instructions/animation3.wav',
        'instructions/animation4.wav',
        'instructions/demo1.gif',
        'trials/audios/example2.wav'
]

example1_a = '<img src="instructions/agents/A.png" style="height: 2em; vertical-align: sub;"> </img>';
example1_d = '<img src="instructions/agents/D.png" style="height: 2em; vertical-align: sub;"> </img>';

example_trial_info = [
    {
        trial: 'example1',
        title: 'Example Case 1',
        mission: 'Who got a snack from the fridge?',
        a_type: 'A',
        b_type: 'D',
        visual_clue: true,
        audio_clue: false,
        extra_text1: 'At the beginning, &nbsp;' + example1_a + '&nbsp;is in the living' +
                        ' room and &nbsp;' + example1_d + '&nbsp;is in the bedroom.' +
                        '</br>One of them got a snack from the fridge in the kitchen.' +
                        '</br>Click the button below to get a clue about who it was.',
        extra_text2: 'The person who got a snack spilled some food. ' +
                        '</br></br><em>Who do you think it was?</em>'
    },
    {
        trial: 'example2',
        title: 'Example Case 2',
        mission: 'Who was watching TV?',
        a_type: 'B',
        b_type: 'C',
        visual_clue: false,
        audio_clue: true,
        extra_text1: "Let's do another example. " +
                        '</br>Both people started out in their bedrooms. ' +
                        '</br>Someone watched TV in the living room and left the TV on. ' +
                        '</br>Click the button below to get a clue about who it was.',
        extra_text2: 'This time, instead of viewing the final scene, you get an audio replay. ' +
                        'Click the <i class="fa-solid fa-volume-high"></i> to hear what happened. ' +
                        '</br>You must listen to the full audio at least once before responding, and you can replay it as many times as you like.' +
                        '</br></br><span id="extra"><em>Who do you think it was?</em></span>'
    }
];

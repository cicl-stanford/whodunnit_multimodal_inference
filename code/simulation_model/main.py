import argparse
import numpy as np
import os
import pandas as pd
import re

from globals import SIMPLE_PATH_CUTOFF, SOFTMAX_TEMP, SAMPLE_PATHS, DOOR_CLOSE_PROB, REMOTE_TABLE_PROB, STEP_DIFFERENCE_THRESHOLD
from utils import normalized_slider_prediction, write_to_csv
from world import initialize_world_start, get_world_final_state
from audio_evidence import get_audio_evidence_from_tokens, get_audio_evidence_likelihood
from visual_evidence import get_visual_evidence_from_world_state, get_visual_evidence_likelihood




def parse_arguments():
    parser = argparse.ArgumentParser("counterfactual_agents argument parser")
    subparser = parser.add_subparsers(dest="command")
    simulate = subparser.add_parser("simulate",
                                    help="Simulate behavior by each agent on a given trial")
    simulate.add_argument('--trial',
                          type=str,
                          default='all',
                          help='which trial to run (default: `all`)')
    simulate.add_argument('--evidence',
                          type=str,
                          choices=['visual', 'audio', 'multimodal'],
                          default='multimodal',
                          help='which evidence to evaluate: must be one of `visual`, `audio`, or `multimodal` (default: `multimodal`)')
    simulate.add_argument('--model-version',
                          type=str,
                          default='simulation',
                          help='name of the current model version (default: `simulation`)')
    return parser.parse_args()


def get_json_files(trial):
    if trial == 'all':
        return sorted([f for f in os.listdir('../model_data/trial_jsons') if f.endswith('_before.json')])
    else:
        return [f'{trial}_before.json']


def get_audio_evidence_from_trial(trial, csv_path):
    audio_df = pd.read_csv(csv_path)
    try:
        audio_string = audio_df[audio_df['trial'] == trial]['audio'].iloc[0]
    except IndexError:
        print(f'No audio data found for trial {trial}!')
    audio_tokens = re.split(',\s*', audio_string)
    trial_evidence_audio = get_audio_evidence_from_tokens(audio_tokens)
    return trial_evidence_audio


def get_visual_evidence_from_trial(trial):
    w_tn = get_world_final_state(f'{trial}_after.json')
    visual_evidence = get_visual_evidence_from_world_state(w_tn)
    return visual_evidence


def print_simulations(model_data):
    print('MODEL RESULTS')
    for row in model_data:
        print(f'> Trial: {row["trial"]}, slider prediction: {row["judgment"]}')



def run_simulation_model(trial_list, evidence):
    data = []
    for f in trial_list:
        trial_name = f.split('_')[0]
        print(f'Running {evidence} simulation for trial {trial_name}')
        w_t0 = initialize_world_start(f)
        sampled_paths_A = w_t0.get_sample_paths('A', SIMPLE_PATH_CUTOFF, SOFTMAX_TEMP, SAMPLE_PATHS)
        sampled_paths_B = w_t0.get_sample_paths('B', SIMPLE_PATH_CUTOFF, SOFTMAX_TEMP, SAMPLE_PATHS)

        if evidence in ['visual', 'multimodal']:
            visual_evidence = get_visual_evidence_from_trial(trial_name)
            visual_evidence_likelihood_A = get_visual_evidence_likelihood(visual_evidence, w_t0, 'A', sampled_paths_A, DOOR_CLOSE_PROB, REMOTE_TABLE_PROB)
            visual_evidence_likelihood_B = get_visual_evidence_likelihood(visual_evidence, w_t0, 'B', sampled_paths_B, DOOR_CLOSE_PROB, REMOTE_TABLE_PROB)
            slider_prediction = normalized_slider_prediction(sum(visual_evidence_likelihood_A), sum(visual_evidence_likelihood_B))

        if evidence in ['audio', 'multimodal']:
            audio_evidence = get_audio_evidence_from_trial(trial_name, '../model_data/audios.csv')
            audio_evidence_likelihood_A = get_audio_evidence_likelihood(audio_evidence, w_t0, 'A', sampled_paths_A, DOOR_CLOSE_PROB, REMOTE_TABLE_PROB, STEP_DIFFERENCE_THRESHOLD)
            audio_evidence_likelihood_B = get_audio_evidence_likelihood(audio_evidence, w_t0, 'B', sampled_paths_B, DOOR_CLOSE_PROB, REMOTE_TABLE_PROB, STEP_DIFFERENCE_THRESHOLD)
            slider_prediction = normalized_slider_prediction(sum(audio_evidence_likelihood_A), sum(audio_evidence_likelihood_B))

        if evidence == 'multimodal':
            multimodal_evidence_likelihood_A = list(np.multiply(visual_evidence_likelihood_A, audio_evidence_likelihood_A))
            multimodal_evidence_likelihood_B = list(np.multiply(visual_evidence_likelihood_B, audio_evidence_likelihood_B))
            slider_prediction = normalized_slider_prediction(sum(multimodal_evidence_likelihood_A), sum(multimodal_evidence_likelihood_B))

        data.append({
            "trial": trial_name,
            "visual": evidence in ['visual', 'multimodal'],
            "audio": evidence in ['audio', 'multimodal'],
            "judgment": slider_prediction,
            "model_samples": SAMPLE_PATHS,
            "model_path_length_cutoff": SIMPLE_PATH_CUTOFF,
            "model_door_close_prob": DOOR_CLOSE_PROB,
            "model_softmax_temp": SOFTMAX_TEMP,
            "step_count_difference_threshold": STEP_DIFFERENCE_THRESHOLD,
        })
    return data



# Examples:
# python main.py simulate --trial 'snack1' --evidence 'visual'
# python main.py simulate --trial 'all' --evidence 'multimodal'
if __name__ == '__main__':
    np.random.seed(100)
    arglist = parse_arguments()
    if arglist.command == 'simulate':
        trials = get_json_files(arglist.trial)
        trial_simulations = run_simulation_model(trial_list=trials, evidence=arglist.evidence)
        print_simulations(trial_simulations)
        if arglist.trial == 'all' and len(trial_simulations) > 0:
            filename = f'model_results/results_{arglist.evidence}_{arglist.model_version}.csv'
            print(f'Writing results to csv: {filename}')
            write_to_csv(trial_simulations, filename, append=False)



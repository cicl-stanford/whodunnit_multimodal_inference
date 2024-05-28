import os
import csv
from pydub import AudioSegment
from trial_actions import *

audio_dir = 'audios'
trial_dir = 'trial_audios'
model_data_file = '../model_data/audios.csv'

with open(model_data_file, 'w') as f:
    csvwriter = csv.writer(f)
    csvwriter.writerow(['trial', 'audio'])

    for trial, actions in trial_actions.items():
        # generate audio file
        audios = []
        for action in ['empty'] + actions:
            audio_file = os.path.join(audio_dir, ACTION_TO_FILE[action])
            audios.append(AudioSegment.from_wav(audio_file))
        combined_sounds = sum(audios)
        velocidad_X = 1.75
        combined_sounds = combined_sounds.speedup(velocidad_X)
        combined_sounds.export(os.path.join(trial_dir, f'{trial}.wav'), format = 'wav')
    
        # record string version
        if trial.startswith('snack') or trial.startswith('tv'):
            csvwriter.writerow([trial, ', '.join(map(lambda x: ACTION_TO_STRING[x], actions))])

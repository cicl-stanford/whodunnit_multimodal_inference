ACTION_TO_FILE = {
    'close_door': 'close_door.wav',
    'close_fridge': 'close_fridge.wav',
    'close_television': 'close_television.wav',
    'drop_remote': 'drop_remote.wav',
    'empty': 'empty.wav',
    'step': 'step.wav',
    'idle_television': 'idle_television.wav',
    'open_door': 'open_door.wav',
    'open_fridge': 'open_fridge.wav',
    'open_television': 'open_television.wav',
    'pickup_remote': 'pickup_remote.wav',
    'pickup_snack': 'pickup_snack.wav',
}

ACTION_TO_STRING = {
    'close_door': 'door closed',
    'close_fridge': 'fridge closed',
    'close_television': 'TV turned off',
    'drop_remote': 'remote dropped',
    'empty': 'silence',
    'step': 'step',
    'idle_television': 'TV playing',
    'open_door': 'door opened',
    'open_fridge': 'fridge opened',
    'open_television': 'TV turned on',
    'pickup_remote': 'remote picked up',
    'pickup_snack': 'snack picked up',
}

fridge_seq = ['open_fridge', 'pickup_snack', 'close_fridge']
spill = []
tv_seq = ['pickup_remote', 'open_television', 'idle_television', 'close_television']

trial_actions = {
    # examples
    'animation1': ['step'] + ['open_door'] + ['step'] * 9 + ['empty'] + fridge_seq,
    'animation2': ['close_fridge', 'empty'] + ['step'] * 6 + spill + ['step'] * 4,
    'animation3': ['step'] + ['open_door'] + ['step'] * 7 + ['pickup_remote', 'step', 'empty', 'open_television', 'idle_television'],
    'animation4': ['idle_television', 'close_television', 'step', 'step', 'drop_remote'] + ['step'] * 6,
    'demo1': ['step', 'open_door'] + ['step'] * 9 + fridge_seq + ['step'] * 10,
    'example1': [],
    'example2': ['step'] * 2 + ['open_door'] + ['step'] * 12 + tv_seq + ['step'] * 2 + ['drop_remote'] + ['step'] * 10 + ['close_door'] + ['step'] * 2,
    # snack trials
    'snack1': ['step'] * 8 + fridge_seq + ['step'] * 8, 
    'snack2': ['step'] * 10 + fridge_seq + ['step'] * 10,
    'snack3': ['step'] * 16 + fridge_seq + ['step'] * 16,
    'snack4': ['step'] * 8 + fridge_seq + ['step'] * 3 + spill + ['step'] * 5,
    'snack5': ['step'] * 7 + fridge_seq + ['step'] * 2 + spill + ['step'] * 5,
    'snack6': ['step'] * 10 + fridge_seq + ['step'] * 10,
    'snack7': ['step'] * 10 + fridge_seq + ['step'] * 2 + spill + ['step'] * 8,
    'snack8': ['step'] * 10 + fridge_seq + ['step'] * 6 + spill + ['step'] * 4,
    'snack9': ['step'] * 10 + fridge_seq + ['step'] * 2 + spill + ['step'] + ['step'] * 10,
    'snack10': ['step'] * 10 + fridge_seq + ['step'] * 6 + spill + ['step'] * 16,
    'snack11': ['step'] * 2 + ['open_door'] + ['step'] * 9 + fridge_seq + ['step'] * 11,
    'snack12': ['step'] * 11 + fridge_seq + ['step'] * 11,
    'snack13': ['step'] * 2 + ['open_door'] + ['step'] * 8 + fridge_seq + ['step'] * 8 + ['close_door'] + ['step'] * 2,
    # tv trials
    'tv1': ['step'] * 9 + tv_seq + ['step'] * 2 + ['drop_remote'] + ['step'] * 7,
    'tv2': ['step'] * 11 + tv_seq + ['step'] * 2 + ['drop_remote'] + ['step'] * 13,
    'tv3': ['step'] * 9 + tv_seq + ['drop_remote'] + ['step'] * 9,
    'tv4': ['step'] * 2 + ['open_door'] + ['step'] * 10 + tv_seq + ['drop_remote'] + ['step'] * 12,
    'tv5': ['step'] * 9 + tv_seq + ['drop_remote'] + ['step'] * 9,
    'tv6': ['step'] * 4 + ['open_door'] + ['step'] * 8 + tv_seq + ['drop_remote'] + ['step'] * 8 + ['close_door'] + ['step'] * 4,
    'tv7': ['step'] * 2 + ['open_door'] + ['step'] * 6 + tv_seq + ['step'] * 2 + ['drop_remote'] + ['step'] * 10
}

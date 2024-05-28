import numpy as np



class AudioEvidence():
    def __init__(self, audio_tokens):
        self.audio_tokens = audio_tokens


    def print(self):
        print(f'Audio tokens: {self.audio_tokens} \
              \nCompressed audio tokens: {self.compressed_audio_tokens}')


    def parse_audio_tokens(self):
        compressed_audio_tokens = []
        for idx, elem in enumerate(self.audio_tokens):
            if idx == 0:
                compressed_audio_tokens.append(0)
            if elem == 'step':
                if isinstance(compressed_audio_tokens[-1], int):
                    compressed_audio_tokens[-1] += 1
                else:
                    compressed_audio_tokens.append(1)
            else:
                compressed_audio_tokens.append(elem)

        self.compressed_audio_tokens = compressed_audio_tokens


# Check for exact equality of the audio token sets
def strict_audio_comparison(token_set_a, token_set_b):
    return token_set_a == token_set_b


def coarse_element_comparison(token_a, token_b):
    # If both elements are identical, return True
    if token_a == token_b:
        return True
    # If both elements encode a step count, return True even if the number differs
    elif isinstance(token_a, int) and isinstance(token_b, int):
        return True
    else:
        return False


def coarse_audio_comparison(token_set_a, token_set_b):
    # Compare audio token sets for whether they contain the same discrete events in the same order (e.g., steps, doors opening/closing)
    if len(token_set_a) != len(token_set_b):
        return False
    else:
        return set([coarse_element_comparison(token_set_a[i], token_set_b[i]) for i in range(len(token_set_a))]) == {True}


def threshold_element_comparison(token_a, token_b, threshold):
    # If both elements are identical, return True
    if token_a == token_b:
        return True
    # If both elements encode a step count, return True if the numbers are within `threshold` of each other
    elif isinstance(token_a, int) and isinstance(token_b, int):
        if abs(token_a - token_b) <= threshold:
            return True
        else:
            return False
    else:
        return False


def threshold_audio_comparison(token_set_a, token_set_b, threshold):
    if len(token_set_a) != len(token_set_b):
        return False
    else:
        return set([threshold_element_comparison(token_set_a[i], token_set_b[i], threshold) for i in range(len(token_set_a))]) == {True}


def evaluate_audio_evidence(audio_evidence, sample_evidence, threshold):
    # Check for exact equality of the audio token sets
    # return strict_audio_comparison(audio_evidence.audio_tokens, sample_evidence.audio_tokens)

    # Check for coarse equality of the audio token sets (same order of events, but not necessarily same number of steps)
    # return coarse_audio_comparison(audio_evidence.compressed_audio_tokens, sample_evidence.compressed_audio_tokens)

    # Check for "threshold" equality of the audio token sets (same order of events, step counts within a threshold of each other)
    return threshold_audio_comparison(audio_evidence.compressed_audio_tokens, sample_evidence.compressed_audio_tokens, threshold)


def get_audio_tokens(world, path, agent, door_close_prob=0.5, remote_table_prob=0.5):
    # Generate audio tokens based on `agent` taking `path` in `world`
    audio_tokens = []
    door_state = world.get_door_info()
    door_transition = False # whether agent just walked through a doorway (used to close door)
    on_return = False # track whether agent is on return trip
    remote_dropped = False # track whether remote has been placed on coffee table or side table
    subgoals = world.get_subgoals(agent)
    if world.mission == 'watch_news_on_tv':
        # TODO make the below a function (identical code in several places)
        livroom_info = list(filter(lambda r: r['type'] == 'LivingRoom',
                                    world.info['rooms']['initial']))[0]
        side_table_info = list(filter(lambda f: f['type'] == 'side_table',
                                    livroom_info['furnitures']['initial']))
        side_table_locations = [(f['pos'][0], f['pos'][1]+1) for f in side_table_info]

    for idx, pos in enumerate(path):
        # add door opening audio token (NB: this needs to be done before 'step' is added)
        if pos in [door['pos'] for door in door_state]:
            door_transition = True
            door_idx = [door['pos'] for door in door_state].index(pos)
            if door_state[door_idx]['state'] == 'closed':
                audio_tokens.append('door opened')
                door_state[door_idx]['state'] = 'open' # update door state so agent doesn't re-open on return
        # add 'step' token for all non-starting positions
        if idx > 0:
            audio_tokens.append('step')
        # add door closing audio token probabilistically
        if door_transition:
            door_transition = False
            if bool(np.random.binomial(n=1, p=door_close_prob)):
                audio_tokens.append('door closed')
                door_idx = [door['pos'] for door in door_state].index(pos)
                door_state[door_idx]['state'] = 'closed' # update door state so agent re-opens on return
        # add subgoal audio tokens
        if world.mission == 'get_snack':
            if pos in subgoals[1:-1]: # exclude start and end positions
                audio_tokens.extend(['fridge opened', 'snack picked up', 'fridge closed'])
        elif world.mission == 'watch_news_on_tv':
            if pos in subgoals[1:-1] and not on_return: # exclude start and end positions
                on_return = True
                audio_tokens.extend(['remote picked up', 'TV turned on', 'TV playing', 'TV turned off'])
                path_remaining = path[idx+1:]
                side_tables_in_path = [pos for pos in path_remaining if pos in side_table_locations]
                # only one side table in return path: flip a coin between placing remote on table or side table
                if len(side_tables_in_path) == 1:
                    if bool(np.random.binomial(n=1, p=remote_table_prob)):
                        # print('placing remote back on table!!')
                        remote_dropped = True
                        audio_tokens.append('remote dropped')
            elif pos in side_table_locations and on_return:
                # only one side table in return path and remote has not been placed on table already: place remote on side table
                if len(side_tables_in_path) == 1 and not remote_dropped:
                    remote_dropped = True
                    audio_tokens.append('remote dropped')
                elif len(side_tables_in_path) > 1 and not remote_dropped:
                    remote_dropped = True
                    audio_tokens.append('remote dropped')

    return audio_tokens


def get_audio_evidence_from_tokens(audio_tokens):
    audio_evidence = AudioEvidence(audio_tokens)
    audio_evidence.parse_audio_tokens()
    return audio_evidence


def get_audio_evidence_from_path(path, agent, world, door_close_prob, remote_table_prob):
    audio_tokens = get_audio_tokens(world, path, agent, door_close_prob, remote_table_prob)
    audio_evidence = get_audio_evidence_from_tokens(audio_tokens)
    return audio_evidence


def get_audio_evidence_likelihood(audio_evidence, world, agent, sampled_paths, door_close_prob, remote_table_prob, step_difference_threshold):
    sampled_path_audio_evidence = [get_audio_evidence_from_path(path, agent, world, door_close_prob, remote_table_prob) for path in sampled_paths]
    return [int(evaluate_audio_evidence(audio_evidence, path_evidence, step_difference_threshold)) for path_evidence in sampled_path_audio_evidence]




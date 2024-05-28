import numpy as np


class VisualEvidence():
    def __init__(self, world):
        self.mission = world.mission
        self.subgoals = {
            'A': world.get_subgoals('A'),
            'B': world.get_subgoals('B')
        }
        self.agent_pos = {
            'A': world.start['A'],
            'B': world.start['B']
        }
        self.door_state = world.get_door_info()
        self.crumb_state = [world.get_crumb_info()] if self.mission == 'get_snack' and world.get_crumb_info() != None else [] # NB: world.get_crumb_info() returns empty tuple if no crumbs in kitchen
        if self.mission == 'watch_news_on_tv':
            remote_info = world.get_remote_info()
            if remote_info['location'] == 'side_table':
                self.remote_state = [(remote_info['pos'][0], remote_info['pos'][1] + 1)] # shift remote to front of side table
            elif remote_info['location'] == 'table':
                self.remote_state = [(remote_info['pos'][0], remote_info['pos'][1] - 1)] # shift remote to front of table
        else:
            self.remote_state = []


    def print(self):
        print(f'Mission: {self.mission} \
              \nAgent A subgoals: {self.subgoals["A"]} \
              \nAgent B subgoals: {self.subgoals["B"]} \
              \nAgent A pos: {self.agent_pos["A"]} \
              \nAgent B pos: {self.agent_pos["B"]} \
              \nDoor state: {self.door_state} \
              \nRemote state: {self.remote_state} \
              \nCrumb state: {self.crumb_state}')


    def update(self, path, agent, world, door_close_prob=0.5, remote_table_prob=0.5):
        on_return = False # track whether agent is on return trip
        in_bedroom = True # track whether agent is in bedroom
        if self.mission == 'watch_news_on_tv':
            self.remote_state = [] # reset remote state before updating with relevant locations on path
            livroom_info = list(filter(lambda r: r['type'] == 'LivingRoom',
                                       world.info['rooms']['initial']))[0]
            table_info = list(filter(lambda f: f['type'] == 'table',
                                     livroom_info['furnitures']['initial']))[0]
            side_table_info = list(filter(lambda f: f['type'] == 'side_table',
                                          livroom_info['furnitures']['initial']))
            side_table_locations = [(f['pos'][0], f['pos'][1]+1) for f in side_table_info]
        if self.mission == 'get_snack':
            self.crumb_state = []
        # Simulate changes to visual state stepping through path
        for pos in path:
            if pos in self.subgoals[agent][1:-1]:
                on_return = True
            if pos in [door['pos'] for door in self.door_state]:
                in_bedroom = False if not on_return else True
            # Update agent position
            self.agent_pos[agent] = pos
            # Update door state
            if pos in [door['pos'] for door in self.door_state]:
                door_idx = [door['pos'] for door in self.door_state].index(pos)
                self.door_state[door_idx]['state'] = 'open'
                # Flip a coin about whether to shut door behind agent
                if bool(np.random.binomial(n=1, p=door_close_prob)): self.door_state[door_idx]['state'] = 'closed'
            # Update crumb state
            if self.mission == 'get_snack':
                if on_return and not in_bedroom:
                    self.crumb_state.append(pos)
            # Update remote state
            if self.mission == 'watch_news_on_tv':
                if on_return and not in_bedroom:
                    if pos in side_table_locations:
                        self.remote_state.append(pos)

        if len(self.remote_state) == 1:
            # only passing closest end table on way back to start: flip coin to decide whether to place remote on table or end table
            table_pos = (table_info['pos'][0]+1, table_info['pos'][1]-1) # table position adjusted to be on agent path
            side_table_pos = self.remote_state[0]
            self.remote_state = [[table_pos, side_table_pos][np.random.choice([0, 1], p=[remote_table_prob, 1-remote_table_prob])]]
        elif len(self.remote_state) > 1:
            # passing both end tables on way back to start: place remote on farthest table
            self.remote_state = [self.remote_state[0]] # NB: relies on farther table being earlier in path



def get_visual_evidence_from_world_state(world):
    return VisualEvidence(world)


def get_visual_evidence_from_path(path, agent, world, door_close_prob, remote_table_prob):
    visual_evidence = VisualEvidence(world)
    visual_evidence.update(path, agent, world, door_close_prob, remote_table_prob)
    return visual_evidence


def get_visual_evidence_likelihood(visual_evidence, world, agent, sampled_paths, door_close_prob, remote_table_prob):
    sampled_path_visual_evidence = [get_visual_evidence_from_path(path, agent, world, door_close_prob, remote_table_prob) for path in sampled_paths]
    return [int(evaluate_visual_evidence(visual_evidence, path_evidence)) for path_evidence in sampled_path_visual_evidence]


def evaluate_visual_evidence(visual_evidence, sample_evidence):
    # NB: this function is a little bespoke: it expects `visual_evidence` to be a VE class with the trial's _after JSON info,
    # while expecting `sample_evidence` to be a VE class initialized with the trial's _before JSON info then updated with a sample path taken by the agent
    evidence_eval = []
    evidence_eval.append(visual_evidence.door_state == sample_evidence.door_state)
    if visual_evidence.mission == 'get_snack':
        if len(visual_evidence.crumb_state) > 0:
            evidence_eval.append(visual_evidence.crumb_state[0] in sample_evidence.crumb_state)
        else: # no crumbs in evidence: any path taken by agent is valid
            evidence_eval.append(True)
    elif visual_evidence.mission == 'watch_news_on_tv':
        evidence_eval.append(visual_evidence.remote_state == sample_evidence.remote_state)
    return set(evidence_eval) == {True}




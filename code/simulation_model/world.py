import itertools
import json
import networkx as nx
import numpy as np
from os import listdir
from random import sample

from globals import FURNITURE_SIZE
from utils import softmax_list_vals



class World():
    def __init__(self, info, p_detour=None, p_crumbs=None):
        self.width = 0
        self.height = 0
        self.info = info
        self.p_detour = p_detour
        self.p_crumbs = p_crumbs
        self.graph = nx.Graph()
        self.create_world()


    def create_world(self):
        self.width = self.info['width']
        self.height = self.info['height']
        self.mission = self.info['agents']['initial'][0]['cur_mission']

        self.start = {
            'A': tuple(self.info['agents']['initial'][0]['pos']),
            'B': tuple(self.info['agents']['initial'][1]['pos'])
        }

        # add room nodes
        for r in self.info['rooms']['initial']:
            room_graph = nx.grid_2d_graph(
                range(r['top'][0], r['top'][0] + r['size'][0]),
                range(r['top'][1], r['top'][1] + r['size'][1])
            )
            nodes_to_remove = []
            for location in room_graph.nodes:
                if self.is_furniture(location):
                    nodes_to_remove.append(location)
            room_graph.remove_nodes_from(nodes_to_remove)
            # add info attributes
            for n in room_graph.nodes:
                room_graph.nodes[n]['is_door'] = False
                room_graph.nodes[n]['room'] = r['type']
            self.graph = nx.union(self.graph, room_graph)

        # add door nodes and connect rooms
        for d in self.info['doors']['initial']:
            p = tuple(d['pos'])
            self.graph.add_node(p, is_door=True,
                                state=d['state'],
                                room = None)
            if d['dir'] == 'horz':
                self.graph.add_edge(p, (p[0], p[1]-1))
                self.graph.add_edge(p, (p[0], p[1]+1))
            elif d['dir'] == 'vert':
                self.graph.add_edge(p, (p[0]-1, p[1]))
                self.graph.add_edge(p, (p[0]+1, p[1]))


    def is_furniture(self, location):
        for r in self.info['rooms']['initial']:
            for f in r['furnitures']['initial']:
                if f['type'] == 'crumbs': return False
                if (location[0] >= f['pos'][0] and
                    location[0] < f['pos'][0] + FURNITURE_SIZE[f['type']][0] and
                    location[1] >= f['pos'][1] and
                    location[1] < f['pos'][1] + FURNITURE_SIZE[f['type']][1]):
                    return True
        return False


    def get_door_info(self):
        door_info = []
        if self.info['doors']['num'] > 0:
            for door in self.info['doors']['initial']:
                door_info.append({'pos': (door['pos'][0], door['pos'][1]), 'state': door['state']})
        return door_info


    def get_remote_info(self):
        remote_summary = {}
        if self.mission == 'watch_news_on_tv':
            livroom_info = list(filter(lambda r: r['type'] == 'LivingRoom',
                                       self.info['rooms']['initial']))[0]
            table_info = list(filter(lambda f: f['type'] == 'table',
                                     livroom_info['furnitures']['initial']))[0]
            side_table_info = list(filter(lambda f: f['type'] == 'side_table',
                                          livroom_info['furnitures']['initial']))
            if table_info['objs']['num'] > 0:
                evidence_info = list(filter(lambda o: o['type'] == 'remote',
                                         table_info['objs']['initial']))
                remote_summary = {'location': 'table', 'pos': (evidence_info[0]['pos'][0], evidence_info[0]['pos'][1])}
            for st in side_table_info:
                if st['objs']['num'] > 0: # NB: this will only work if side tables only ever have remote on them (not other non-remote stuff)
                    evidence_info = list(filter(lambda o: o['type'] == 'remote',
                                                st['objs']['initial']))
                    remote_summary = {'location': 'side_table', 'pos': (evidence_info[0]['pos'][0], evidence_info[0]['pos'][1])}
        return remote_summary


    def get_crumb_info(self):
        kitchen_info = list(filter(lambda r: r['type'] == 'Kitchen',
                                   self.info['rooms']['initial']))[0]
        evidence_info = list(filter(lambda f: f['type'] == 'crumbs',
                                    kitchen_info['furnitures']['initial']))
        return (evidence_info[0]['pos'][0], evidence_info[0]['pos'][1]) if len(evidence_info) > 0 else None


    def is_valid_for_agent(self, location):
        return (location[0] < self.width and
                location[1] < self.height and
                location in self.graph.nodes
               )


    def get_subgoals(self, agent):
        subgoals = []
        subgoals.append(self.start[agent])

        if self.mission == 'get_snack':
            # TODO move the below into separate fxns (e.g. fridge, crumbs, doors)
            kitchen_info = list(filter(lambda r: r['type'] == 'Kitchen',
                                       self.info['rooms']['initial']))[0]
            fridge_info = list(filter(lambda f: f['type'] == 'electric_refrigerator',
                                      kitchen_info['furnitures']['initial']))[0]
            fp = fridge_info['pos']
            closest_point = fp
            shortest_distance = self.width + self.height
            # TODO replace with check whether fridge is at far left/right rather than using y location, move this to function in utils
            if fp[1] == 6:   # horizontal layout
                access_points = [(fp[0]-1, fp[1]+1), (fp[0]+2, fp[1]+1)]
            else:   # vertical layout
                access_points = [(fp[0]-1, fp[1]+2), (fp[0]+2, fp[1]+2)]
            for p in access_points:
                if self.is_valid_for_agent(p):
                    distance = nx.shortest_path_length(self.graph, self.start[agent], p)
                    if distance < shortest_distance:
                        closest_point = p
                        shortest_distance = distance
            subgoals.append(closest_point)
            # If world includes crumbs, set this as sub-goal
            evidence_info = list(filter(lambda f: f['type'] == 'crumbs',
                                      kitchen_info['furnitures']['initial']))
            if len(evidence_info) > 0: subgoals.append((evidence_info[0]['pos'][0], evidence_info[0]['pos'][1]))

        elif self.mission == 'watch_news_on_tv':
            # TODO move the below into separate fxns (e.g. couch, remote, doors)
            livroom_info = list(filter(lambda r: r['type'] == 'LivingRoom',
                                       self.info['rooms']['initial']))[0]

            # Add sofa as sub-goal
            sofa_info = list(filter(lambda f: f['type'] == 'sofa',
                                    livroom_info['furnitures']['initial']))[0]
            sp = sofa_info['pos']
            subgoals.append((sp[0]+1, sp[1]+2)) # sets location to be center square in front of sofa

            side_table_info = list(filter(lambda f: f['type'] == 'side_table',
                                          livroom_info['furnitures']['initial']))
            # if remote on side table, add position in front of relevant side table as sub-goal
            for st in side_table_info:
                if st['objs']['num'] > 0:
                    evidence_info = list(filter(lambda o: o['type'] == 'remote',
                                                st['objs']['initial']))[0]
                    ep = evidence_info['pos']
                    subgoals.append((ep[0], ep[1]+1))
        subgoals.append(self.start[agent])
        return subgoals

    def get_subgoal_simple_paths(self, agent, max_path_length):
        subgoals = self.get_subgoals(agent)
        # simple paths from start to couch / fridge and back to start
        simple_paths = [list(nx.all_simple_paths(self.graph, source=subgoals[i], target=subgoals[i+1], cutoff = max_path_length)) for i in range(len(subgoals)-1)]
        # add simple paths from couch to each side table and back to start
        if self.mission == 'watch_news_on_tv':
            # NB: this is very bespoke: assumes exactly 4 subgoals (start, couch, side table, start) and limited paths from couch to side table
            # add each remote location as potential subgoal
            livroom_info = list(filter(lambda r: r['type'] == 'LivingRoom',
                                       self.info['rooms']['initial']))[0]
            side_table_info = list(filter(lambda f: f['type'] == 'side_table',
                                          livroom_info['furnitures']['initial']))
            # add return paths through each side table
            for i in range(len(side_table_info)):
                subgoal_extension = subgoals.copy()
                subgoal_extension.insert(-1, (side_table_info[i]['pos'][0], side_table_info[i]['pos'][1]+1))
                remote_path = list(nx.all_simple_paths(self.graph, source=subgoal_extension[1], target=subgoal_extension[2], cutoff = max_path_length))
                remote_return_path = list(nx.all_simple_paths(self.graph, source=subgoal_extension[2], target=subgoal_extension[3], cutoff = max_path_length))
                combined_return = [remote_path[0][:-1] + remote_return_path[i] for i in range(len(remote_return_path))]
                simple_paths[1].extend(combined_return)
        for elem in simple_paths:
            if len(elem) == 0: raise ValueError(f'No simple paths found for one or more subgoals for agent {agent} with max path length {max_path_length}')
        return simple_paths


    def get_sample_paths(self, agent, simple_path_length, softmax_temp, sample_paths):
        # Get simple paths through each agent's sub-goals and corresponding likelihoods (softmax over simple path length)
        simple_paths = self.get_subgoal_simple_paths(agent, simple_path_length)
        simple_path_likelihoods = [softmax_list_vals([-1*(len(path)-1) for path in path_set], temp=softmax_temp) for path_set in simple_paths]
        # Sample simple paths according to likelihoods (separate sampling for each sub-goal destination)
        # NB: this samples path *indices* not paths themselves
        sampled_subgoal_paths = [list(np.random.choice(list(range(len(simple_paths[i]))), size=sample_paths, p=simple_path_likelihoods[i])) for i in range(len(simple_paths)) if len(simple_paths[i]) > 0]
        # Combine separate sampled sub-goal paths into single concatenated paths
        sample_paths = [list(itertools.chain(*[simple_paths[subgoal_idx][path_idx][:-1] for subgoal_idx, path_idx in enumerate(elem)])) + [simple_paths[-1][-1][-1]] for elem in zip(*sampled_subgoal_paths)]
        return sample_paths


def initialize_world_start(filename):
    json_files = [f for f in listdir('../model_data/trial_jsons') if f.endswith('_before.json')]
    if filename not in json_files:
        raise ValueError(f'Trial {filename} not found in trial JSON directory')
    else:
        file_t0 = open(f'../model_data/trial_jsons/{filename}', 'r')
        trial_info_t0 = json.load(file_t0)['Grid']
        return World(trial_info_t0)


def get_world_final_state(filename):
    json_files = [f for f in listdir('../model_data/trial_jsons') if f.endswith('_after.json')]
    if filename not in json_files:
        raise ValueError(f'Trial {filename} not found in trial JSON directory')
    else:
        file_tN = open(f'../model_data/trial_jsons/{filename}', 'r')
        trial_info_tN = json.load(file_tN)['Grid']
        return World(trial_info_tN)



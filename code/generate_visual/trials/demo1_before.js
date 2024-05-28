const grid = '{"auto": {"max_num_agent": 2, "room_split_dirs": ["vert", "horz"], "min_room_dim": 5, "max_num_room": 3}, "width": 15, "height": 15, "wall_type": 3, "floor_type": 3, "agents": {"num": 2, "initial": [{"name": "E", "id": 1, "pos": [3, 5], "dir": 1, "color": "red", "step_size": 1, "forgetness": 0, "mission_preference_initial": {"get_night_snack": 1, "get_snack": 0, "feed_dog": 0, "watch_news_on_tv": 0, "move_plant_at_night": 0, "take_shower": 0, "do_laundry": 0, "watch_movie_cozily": 0, "change_outfit": 0, "clean_living_room_table": 0}, "cur_mission": "get_snack", "cur_subgoal": null, "carrying": {"num": 0, "initial": []}}, {"name": "F", "id": 2, "pos": [11, 5], "dir": 1, "color": "blue", "step_size": 1, "forgetness": 0, "mission_preference_initial": {"get_night_snack": 0, "get_snack": 0, "feed_dog": 0, "watch_news_on_tv": 1, "move_plant_at_night": 0, "take_shower": 0, "do_laundry": 0, "watch_movie_cozily": 0, "change_outfit": 0, "clean_living_room_table": 0}, "cur_mission": "watch_news_on_tv", "cur_subgoal": null, "carrying": {"num": 0, "initial": []}}]}, "rooms": {"num": 2, "initial": [{"type": "Bedroom", "top": [1, 1], "size": [6, 7], "furnitures": {"num": 3, "initial": [{"type": "bed", "pos": [1, 1], "state": null, "objs": {"num": 0, "initial": []}}, {"type": "light", "pos": [5, 5], "state": {"toggleable": 1}, "objs": {"num": 0, "initial": []}}]}}, {"type": "Bedroom", "top": [8, 1], "size": [6, 7], "furnitures": {"num": 2, "initial": [{"type": "bed", "pos": [8, 1], "state": null, "objs": {"num": 0, "initial": []}}, {"type": "light", "pos": [9, 5], "state": {"toggleable": 0}, "objs": {"num": 0, "initial": []}}]}}, {"type": "LivingRoom", "top": [1, 9], "size": [13, 5], "furnitures": {"num": 6, "initial": [{"type": "electric_refrigerator", "pos": [1, 11], "state": {"openable": true}, "objs": {"num": 1, "initial": [{"type": "sandwich", "pos": [1, 11], "state": null}]}}, {"type": "table", "pos": [7, 10], "state": null, "objs": {"num": 1, "initial": [{"type": "remote", "pos": [8, 10], "state": null}]}}, {"type": "sofa", "pos": [7, 8], "state": null, "objs": {"num": 0, "initial": []}}, {"type": "side_table", "pos": [6, 9], "state": null, "objs": {"num": 0, "initial": []}}, {"type": "side_table", "pos": [10, 9], "state": null, "objs": {"num": 0, "initial": []}}, {"type": "tv", "pos": [8, 12], "state": {"toggleable": 0}, "objs": {"num": 0, "initial": []}}]}}]}, "doors": {"num": 2, "initial": [{"type": "door", "dir": "horz", "pos": [2, 8], "state": "closed"}, {"type": "door", "dir": "horz", "pos": [11, 8], "state": "open"}]}}';

export default grid;
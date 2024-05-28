const grid = '{"auto": {"max_num_agent": 2, "room_split_dirs": ["vert", "horz"], "min_room_dim": 5, "max_num_room": 3}, "width": 15, "height": 15, "wall_type": 1, "floor_type": 2, "agents": {"num": 2, "initial": [{"name": "D", "id": 1, "pos": [9, 3], "dir": 1, "color": "red", "step_size": 1, "forgetness": 0, "mission_preference_initial": {"get_night_snack": 0, "get_snack": 1, "feed_dog": 0, "watch_news_on_tv": 0, "move_plant_at_night": 0, "take_shower": 0, "do_laundry": 0, "watch_movie_cozily": 0, "change_outfit": 0, "clean_living_room_table": 0}, "cur_mission": "get_snack", "cur_subgoal": null, "carrying": {"num": 0, "initial": []}}, {"name": "E", "id": 2, "pos": [9, 11], "dir": 1, "color": "blue", "step_size": 1, "forgetness": 0, "mission_preference_initial": {"get_night_snack": 0, "get_snack": 1, "feed_dog": 0, "watch_news_on_tv": 0, "move_plant_at_night": 0, "take_shower": 0, "do_laundry": 0, "watch_movie_cozily": 0, "change_outfit": 0, "clean_living_room_table": 0}, "cur_mission": "get_snack", "cur_subgoal": null, "carrying": {"num": 0, "initial": []}}]}, "rooms": {"num": 3, "initial": [{"type": "Kitchen", "top": [1, 1], "size": [6, 13], "furnitures": {"num": 4, "initial": [{"type": "table", "pos": [1, 12], "state": null, "objs": {"num": 0, "initial": []}}, {"type": "electric_refrigerator", "pos": [1, 6], "state": {"openable": true}, "objs": {"num": 1, "initial": []}}, {"type": "light", "pos": [6, 4], "state": {"toggleable": 0}, "objs": {"num": 0, "initial": []}}, {"type": "crumbs", "pos": [5, 11], "objs": {"num": 0, "initial": []}}]}}, {"type": "LivingRoom", "top": [8, 1], "size": [6, 6], "furnitures": {"num": 2, "initial": [{"type": "table", "pos": [11, 3], "state": null, "objs": {"num": 0, "initial": []}}, {"type": "sofa", "pos": [11, 1], "state": null, "objs": {"num": 0, "initial": []}}]}}, {"type": "Bedroom", "top": [8, 8], "size": [6, 6], "furnitures": {"num": 2, "initial": [{"type": "bed", "pos": [11, 9], "state": null, "objs": {"num": 0, "initial": []}}, {"type": "light", "pos": [13, 11], "state": {"toggleable": 0}, "objs": {"num": 0, "initial": []}}]}}]}, "doors": {"num": 2, "initial": [{"type": "door", "dir": "vert", "pos": [7, 3], "state": "open"}, {"type": "door", "dir": "vert", "pos": [7, 11], "state": "open"}]}}';

export default grid;
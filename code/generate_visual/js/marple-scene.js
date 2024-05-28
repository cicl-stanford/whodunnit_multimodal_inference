import TILES from "./tile-mapping.js";
// Insert trial name to visualize below
export let gridName = "tv6_after";

let grid;
import(`../trials/${gridName}.js`).then(module => {
  grid = module.default;
}).catch(error => {
  console.error("Failed to load the grid:", error);
});

export default class MarpleScene extends Phaser.Scene {
  constructor() {
    super();
    this.mission = "";
    this.gridName = gridName;
  }

  preload() {
    this.load.image(
      "tiles",
      "../tilesets/Objects.png"
    );
  }

  create() {
    this.grid = JSON.parse(grid);
    console.log(this.grid);

    // CREATE BLANK MAP
    const map = this.make.tilemap({
      tileWidth: 32,
      tileHeight: 32,
      width: this.grid.width,
      height: this.grid.height + 1,
    });

    const tileset = map.addTilesetImage("tiles", null);
    this.floor = map.createBlankLayer("Floor", tileset);
    this.background = map.createBlankLayer("Background", tileset);
    this.furniture = map.createBlankLayer("Furniture", tileset);
    this.objects = map.createBlankLayer("Objects", tileset);
    this.agent = map.createBlankLayer("Agent", tileset);
    this.foreground = map.createBlankLayer("Foreground", tileset);

    const wall_type = this.grid.wall_type;
    const floor_type = this.grid.floor_type;

    // 1. ROOMS
    this.grid.rooms.initial.forEach(room => {
        // NOTE: +1 TO ALL TOP POSITIONS TO ALLOW FOR EXTRA WALL TOPPER IN ROW 0
        const top = room.top[1] + 1;
        const left = room.top[0];
        const width = room.size[0];
        const height = room.size[1];
        const right = left + width - 1;
        const bottom = top + height - 1;

        // FLOORS
        this.floor.putTileAt(TILES.FLOOR[`TOP_LEFT_${floor_type}`], left, top);
        this.floor.fill(TILES.FLOOR[`TOP_${floor_type}`], left + 1, top, width - 1, 1);
        this.floor.fill(TILES.FLOOR[`LEFT_${floor_type}`], left, top + 1, 1, height - 1);
        this.floor.fill(TILES.FLOOR[`DEFAULT_${floor_type}`], left + 1, top + 1, width - 1, height - 1);

        // ROOM CORNERS AND WALLS
        this.background.putTileAt(TILES.WALL[`TOP_LEFT_${wall_type}`], left - 1, top - 1);
        this.background.putTileAt(TILES.WALL[`TOP_RIGHT_${wall_type}`], right + 1, top - 1);
        this.background.putTileAt(TILES.WALL[`BOTTOM_RIGHT_${wall_type}`], right + 1, bottom + 1);
        this.background.putTileAt(TILES.WALL[`BOTTOM_LEFT_${wall_type}`], left - 1, bottom + 1);
        this.background.fill(TILES.WALL[`TOP_${wall_type}`], left, top - 1, width, 1);
        this.background.fill(TILES.WALL[`BOTTOM_${wall_type}`], left, bottom + 1, width, 1);
        this.background.fill(TILES.WALL[`LEFT_${wall_type}`], left - 1, top, 1, height);
        this.background.fill(TILES.WALL[`RIGHT_${wall_type}`], right + 1, top, 1, height);

        // WALL TOPPERS
        // these are above agent so agent walks behind them
        this.foreground.putTileAt(TILES.WALL_TOPPER[`TOP_LEFT_${wall_type}`], left - 1, top - 2);
        // only at rightmost edge
        if (right + 2 == map.width) {
            this.foreground.putTileAt(TILES.WALL_TOPPER[`TOP_RIGHT_${wall_type}`], right + 1, top - 2);
        }
        this.foreground.fill(TILES.WALL_TOPPER[`TOP_${wall_type}`], left, top - 2, width, 1);

        // FURNITURE
        room.furnitures.initial.forEach(item => {
          const x = item.pos[0];
          // + 1 for extra row of wall topper
          const y = item.pos[1] + 1;
          if (item.type === 'light'){
            if (item.state.toggleable == 1){
              this.furniture.putTileAt(TILES.LIGHT_ON.TOP_LEFT, x - 1, y);
              this.furniture.putTileAt(TILES.LIGHT_ON.TOP_MIDDLE, x, y);
              this.furniture.putTileAt(TILES.LIGHT_ON.TOP_RIGHT, x + 1, y);
              this.furniture.putTileAt(TILES.LIGHT_ON.MIDDLE_LEFT, x - 1, y + 1);
              this.furniture.putTileAt(TILES.LIGHT_ON.MIDDLE, x, y + 1);
              this.furniture.putTileAt(TILES.LIGHT_ON.MIDDLE_RIGHT, x + 1, y + 1);
              this.furniture.putTileAt(TILES.LIGHT_ON.BOTTOM, x, y + 2);
            } else {
              this.furniture.putTileAt(TILES.LIGHT_OFF.TOP, x, y);
              this.furniture.putTileAt(TILES.LIGHT_OFF.MIDDLE, x, y + 1);
              this.furniture.putTileAt(TILES.LIGHT_OFF.BOTTOM, x, y + 2);
            }
          } else if (item.type === 'table') {
              this.furniture.putTileAt(TILES.TABLE.TOP_LEFT, x, y);
              this.furniture.putTileAt(TILES.TABLE.TOP_MIDDLE, x + 1, y);
              this.furniture.putTileAt(TILES.TABLE.TOP_RIGHT, x + 2, y);
              this.furniture.putTileAt(TILES.TABLE.BOTTOM_LEFT, x, y + 1);
              this.furniture.putTileAt(TILES.TABLE.BOTTOM_MIDDLE, x + 1, y + 1);
              this.furniture.putTileAt(TILES.TABLE.BOTTOM_RIGHT, x + 2, y + 1);
          } else if (item.type === 'electric_refrigerator'){
              this.furniture.putTileAt(TILES.REFRIGERATOR.TOP_LEFT, x, y);
              this.furniture.putTileAt(TILES.REFRIGERATOR.TOP_RIGHT, x + 1, y);
              this.furniture.putTileAt(TILES.REFRIGERATOR.MIDDLE_LEFT, x, y + 1);
              this.furniture.putTileAt(TILES.REFRIGERATOR.MIDDLE_RIGHT, x + 1, y + 1);
              this.furniture.putTileAt(TILES.REFRIGERATOR.BOTTOM_LEFT, x, y + 2);
              this.furniture.putTileAt(TILES.REFRIGERATOR.BOTTOM_RIGHT, x + 1, y + 2);
          } else if (item.type === 'bed'){
              // this.foreground.putTileAt(TILES.BED.TOP_LEFT, x, y);
              this.furniture.putTileAt(TILES.BED.SECOND_LEFT, x, y);
              this.furniture.putTileAt(TILES.BED.SECOND_MIDDLE, x + 1, y);
              this.furniture.putTileAt(TILES.BED.SECOND_RIGHT, x + 2, y);
              this.furniture.putTileAt(TILES.BED.THIRD_LEFT, x, y + 1);
              this.furniture.putTileAt(TILES.BED.THIRD_MIDDLE, x + 1, y + 1);
              this.furniture.putTileAt(TILES.BED.THIRD_RIGHT, x + 2, y + 1);
          } else if (item.type === 'sofa'){
              this.furniture.putTileAt(TILES.SOFA.TOP_LEFT, x, y);
              this.furniture.putTileAt(TILES.SOFA.TOP_MIDDLE, x + 1, y);
              this.furniture.putTileAt(TILES.SOFA.TOP_RIGHT, x + 2, y);
              this.furniture.putTileAt(TILES.SOFA.BOTTOM_LEFT, x, y + 1);
              this.furniture.putTileAt(TILES.SOFA.BOTTOM_MIDDLE, x + 1, y + 1);
              this.furniture.putTileAt(TILES.SOFA.BOTTOM_RIGHT, x + 2, y + 1);
          } else if (item.type === 'side_table'){
              this.furniture.putTileAt(TILES.SIDE_TABLE, x, y);
          } else if (item.type === 'crumbs'){
              this.furniture.putTileAt(TILES.CRUMBS, x, y);
          } else if (item.type === 'tv'){
            if (item.state.toggleable == 1){
              this.furniture.putTileAt(TILES.TV_ON.TOP_LEFT, x, y);
              this.furniture.putTileAt(TILES.TV_ON.TOP_RIGHT, x + 1, y);
              this.furniture.putTileAt(TILES.TV_ON.BOTTOM_LEFT, x, y + 1);
              this.furniture.putTileAt(TILES.TV_ON.BOTTOM_RIGHT, x + 1, y + 1);
            } else {
              this.furniture.putTileAt(TILES.TV_OFF.BOTTOM_LEFT, x, y);
              this.furniture.putTileAt(TILES.TV_OFF.BOTTOM_RIGHT, x + 1, y);
            }
          }
        });

        // OBJECTS ON FURNITURE
        room.furnitures.initial.forEach(furniture => {
          furniture.objs.initial.forEach(item => {
            const x = item.pos[0];
            // + 1 for extra row of wall topper
            const y = item.pos[1] + 1;
            if (item.type === 'remote'){
              this.objects.putTileAt(TILES.REMOTE, x, y);
            }
          });
        });

    });

    // 2. DOORS
    this.grid.doors.initial.forEach(door => {
        const x = door.pos[0];
        // + 1 for extra row of wall topper
        const y = door.pos[1] + 1;
        const isVertical = door.dir === "vert";
        const isHorizontal = door.dir === "horz";

        if (isVertical) {
          if (door.state === "open") {
            this.floor.fill(TILES.FLOOR[`DEFAULT_${floor_type}`], x, y - 1, 2, 2);
            this.background.putTileAt(TILES.DOOR.VERTICAL[`OPEN_TOP_${wall_type}`], x, y - 1);
            this.background.putTileAt(TILES.DOOR.VERTICAL[`OPEN_BOTTOM_${wall_type}`], x, y);
            // for agent walking through open door
            this.foreground.putTileAt(TILES.DOOR.VERTICAL[`OPEN_TOP_${wall_type}`], x, y - 1);
            this.foreground.putTileAt(TILES.DOOR.VERTICAL[`OPEN_BOTTOM_${wall_type}`], x, y);
          } else {
            this.floor.fill(TILES.FLOOR[`DEFAULT_${floor_type}`], x, y - 1, 1, 2);
            this.background.putTileAt(TILES.DOOR.VERTICAL[`CLOSED_TOP_${wall_type}`], x, y - 1);
            this.background.putTileAt(TILES.DOOR.VERTICAL[`CLOSED_BOTTOM_${wall_type}`], x, y - 1);
          }
        } else if (isHorizontal) {
          if (door.state === "open"){
            this.floor.fill(TILES.FLOOR[`DEFAULT_${floor_type}`], x, y - 1, 2, 3);
            this.background.putTileAt(TILES.DOOR.HORIZONTAL.OPEN_BOTTOM_LEFT, x, y);
            this.background.putTileAt(TILES.DOOR.HORIZONTAL.OPEN_BOTTOM_RIGHT, x + 1, y);
            this.foreground.putTileAt(TILES.DOOR.HORIZONTAL.OPEN_TOP_LEFT, x, y - 1);
            this.foreground.putTileAt(TILES.DOOR.HORIZONTAL.OPEN_TOP_RIGHT, x + 1, y - 1);
          } else {
            this.floor.fill(TILES.FLOOR[`DEFAULT_${floor_type}`], x, y - 1, 2, 2);
            this.background.putTileAt(TILES.DOOR.HORIZONTAL.CLOSED_BOTTOM_LEFT, x, y);
            this.background.putTileAt(TILES.DOOR.HORIZONTAL.CLOSED_BOTTOM_RIGHT, x + 1, y);
            this.foreground.putTileAt(TILES.DOOR.HORIZONTAL.CLOSED_TOP_LEFT, x, y - 1);
            this.foreground.putTileAt(TILES.DOOR.HORIZONTAL.CLOSED_TOP_RIGHT, x + 1, y - 1);
          }
        }

    });

    // AGENTS
    this.grid.agents.initial.forEach(agent => {
      let x = agent.pos[0];
      // + 1 for extra row of wall topper
      let y = agent.pos[1] + 1;
      let direction = agent.dir;
      let name = agent.name;

      if (direction === 0) {
          this.agent.putTileAt(TILES.AGENT[`EAST_BODY_${name}`], x, y);
          this.agent.putTileAt(TILES.AGENT[`EAST_HEAD_${name}`], x, y - 1);
      } else if (direction === 1){
          this.agent.putTileAt(TILES.AGENT[`SOUTH_BODY_${name}`], x, y);
          this.agent.putTileAt(TILES.AGENT[`SOUTH_HEAD_${name}`], x, y - 1);
      } else if (direction === 2){
          this.agent.putTileAt(TILES.AGENT[`WEST_BODY_${name}`], x, y);
          this.agent.putTileAt(TILES.AGENT[`WEST_HEAD_${name}`], x, y - 1);
      } else if (direction === 3){
          this.agent.putTileAt(TILES.AGENT[`NORTH_BODY_${name}`], x, y);
          this.agent.putTileAt(TILES.AGENT[`NORTH_HEAD_${name}`], x, y - 1);
      }
    });
  }
}
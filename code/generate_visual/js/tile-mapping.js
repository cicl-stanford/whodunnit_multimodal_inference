const TILE_MAPPING = {
    BLANK: 169,
    FLOOR: {
      TOP_LEFT_1: 151,
      TOP_1: 152,
      LEFT_1: 164,
      DEFAULT_1: 165,
  
      TOP_LEFT_2: 153,
      TOP_2: 154,
      LEFT_2: 166,
      DEFAULT_2: 167,
  
      TOP_LEFT_3: 179,
      TOP_3: 180,
      LEFT_3: 192,
      DEFAULT_3: 193
  
    },
    WALL: {
      TOP_LEFT_1: 78,
      TOP_RIGHT_1: 79,
      BOTTOM_LEFT_1: 91,
      BOTTOM_RIGHT_1: 92,
      TOP_1: 80,
      LEFT_1: 81,
      RIGHT_1: 82,
      BOTTOM_1: 83,
  
      TOP_LEFT_2: 104,
      TOP_RIGHT_2: 105,
      BOTTOM_LEFT_2: 117,
      BOTTOM_RIGHT_2: 118,
      TOP_2: 106,
      LEFT_2: 107,
      RIGHT_2: 108,
      BOTTOM_2: 109,
  
      TOP_LEFT_3: 130,
      TOP_RIGHT_3: 131,
      BOTTOM_LEFT_3: 143,
      BOTTOM_RIGHT_3: 144,
      TOP_3: 132,
      LEFT_3: 133,
      RIGHT_3: 134,
      BOTTOM_3: 135,
    },
    WALL_TOPPER: {
      TOP_LEFT_1: 84,
      TOP_RIGHT_1: 85,
      TOP_1: 93,
  
      TOP_LEFT_2: 110,
      TOP_RIGHT_2: 111,
      TOP_2: 119,
  
      TOP_LEFT_3: 136,
      TOP_RIGHT_3: 137,
      TOP_3: 145
  
    },
    DOOR: {
      HORIZONTAL: {
        CLOSED_TOP_LEFT: 99,
        CLOSED_TOP_RIGHT: 100,
        CLOSED_BOTTOM_LEFT: 112,
        CLOSED_BOTTOM_RIGHT: 113,
  
        OPEN_TOP_LEFT: 101,
        OPEN_TOP_RIGHT: 102,
        OPEN_BOTTOM_LEFT: 114,
        OPEN_BOTTOM_RIGHT: 115
      },
      VERTICAL: {
       CLOSED_TOP_1: 73,
       CLOSED_BOTTOM_1: 86,
  
       CLOSED_TOP_2: 74,
       CLOSED_BOTTOM_2: 87,
  
       CLOSED_TOP_1: 75,
       CLOSED_BOTTOM_1: 88,
  
  
       OPEN_TOP_1: 125,
       OPEN_BOTTOM_1: 138,
  
       OPEN_TOP_2: 126,
       OPEN_BOTTOM_2: 139,
  
       OPEN_TOP_3: 127,
       OPEN_BOTTOM_3: 140,
  
      },
    },
    LIGHT_OFF:{
      TOP: 2,
      MIDDLE: 15,
      BOTTOM: 28
    },
    LIGHT_ON:{
      TOP_LEFT: 42,
      TOP_MIDDLE: 43,
      TOP_RIGHT: 44,
      MIDDLE_LEFT: 55,
      MIDDLE: 56,
      MIDDLE_RIGHT: 57,
      BOTTOM: 69
    },
    SOFA: {
      TOP_LEFT: 39,
      TOP_MIDDLE: 40,
      TOP_RIGHT: 41,
      BOTTOM_LEFT: 52,
      BOTTOM_MIDDLE: 53,
      BOTTOM_RIGHT: 54
    },
    REFRIGERATOR: {
      TOP_LEFT: 10,
      TOP_RIGHT: 11,
      MIDDLE_LEFT: 23,
      MIDDLE_RIGHT: 24,
      BOTTOM_LEFT: 36,
      BOTTOM_RIGHT: 37
    },
    BED: {
      SECOND_LEFT: 16,
      SECOND_MIDDLE: 17,
      SECOND_RIGHT: 18,
      THIRD_LEFT: 29,
      THIRD_MIDDLE: 30,
      THIRD_RIGHT: 31
    },
    TABLE: {
      TOP_LEFT: 6,
      TOP_MIDDLE: 7,
      TOP_RIGHT: 8,
      BOTTOM_LEFT: 19,
      BOTTOM_MIDDLE: 20,
      BOTTOM_RIGHT: 21
    },
    TV_ON: {
      TOP_LEFT: 45,
      TOP_RIGHT: 46,
      BOTTOM_LEFT: 58,
      BOTTOM_RIGHT: 59
    },
    TV_OFF: {
      TOP_LEFT: 47,
      TOP_RIGHT: 48,
      BOTTOM_LEFT: 60,
      BOTTOM_RIGHT: 61,
    },
    SANDWICH: 1,
    CRUMBS: 64,
    SIDE_TABLE: 77,
    REMOTE: 62,
    PLANT: {
      TOP: 13,
      BOTTOM: 26
    },
  
    AGENT: {
      NORTH_HEAD_A: 185,
      NORTH_BODY_A: 198,
      EAST_HEAD_A: 182,
      EAST_BODY_A: 195,
      SOUTH_HEAD_A: 183,
      SOUTH_BODY_A: 196,
      WEST_HEAD_A: 184,
      WEST_BODY_A: 197,
  
      NORTH_HEAD_B: 190,
      NORTH_BODY_B: 203,
      EAST_HEAD_B: 187,
      EAST_BODY_B: 200,
      SOUTH_HEAD_B: 188,
      SOUTH_BODY_B: 201,
      WEST_HEAD_B: 189,
      WEST_BODY_B: 202,
  
      NORTH_HEAD_C: 211,
      NORTH_BODY_C: 224,
      EAST_HEAD_C: 208,
      EAST_BODY_C: 221,
      SOUTH_HEAD_C: 209,
      SOUTH_BODY_C: 222,
      WEST_HEAD_C: 210,
      WEST_BODY_C: 223,
  
      NORTH_HEAD_D: 216,
      NORTH_BODY_D: 229,
      EAST_HEAD_D: 213,
      EAST_BODY_D: 226,
      SOUTH_HEAD_D: 214,
      SOUTH_BODY_D: 227,
      WEST_HEAD_D: 215,
      WEST_BODY_D: 228,
  
      NORTH_HEAD_E: 237,
      NORTH_BODY_E: 250,
      EAST_HEAD_E: 234,
      EAST_BODY_E: 247,
      SOUTH_HEAD_E: 235,
      SOUTH_BODY_E: 248,
      WEST_HEAD_E: 236,
      WEST_BODY_E: 249,
  
      NORTH_HEAD_F: 242,
      NORTH_BODY_F: 255,
      EAST_HEAD_F: 239,
      EAST_BODY_F: 252,
      SOUTH_HEAD_F: 240,
      SOUTH_BODY_F: 253,
      WEST_HEAD_F: 241,
      WEST_BODY_F: 254
    }
  
  };
  
  
  export default TILE_MAPPING;
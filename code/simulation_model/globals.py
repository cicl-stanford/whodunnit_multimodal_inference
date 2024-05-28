
SIMPLE_PATH_CUTOFF = 20 # Maximum number of steps to consider in simple path search
SOFTMAX_TEMP = 1 # Temperature parameter for softmax function (default: 1.0)
SAMPLE_PATHS = 1000 # Number of simple paths to sample
DOOR_CLOSE_PROB = 0.5 # Probability of closing door behind agent
REMOTE_TABLE_PROB = 0.5 # Probability of remote being on table vs side table
STEP_DIFFERENCE_THRESHOLD = 4 # Threshold for step count difference between audio and visual evidence


FURNITURE_SIZE = {
    'bed': [3, 2],
    'sofa': [3, 2],
    'light': [1, 1],
    'table': [3, 2],
    'side_table': [1, 1],
    'electric_refrigerator': [2, 3],
    'tv': [2, 2]
}


import json
import argparse
import os


for f in os.listdir('trials'):
    if f.endswith('.json'):
        ff = os.path.join('trials', f)
        with open(ff, 'r') as infile:
            x = json.loads(infile.read())['Grid']
        
        with open(ff.rstrip('.json') + '.js', 'w') as outfile:
            outfile.write(f"const grid = '{json.dumps(x)}';\n\n")
            outfile.write("export default grid;")
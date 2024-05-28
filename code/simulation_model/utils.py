import csv
import numpy as np



def normalized_slider_prediction(value_A, value_B):
    if sum([value_A, value_B]) == 0: return 50
    else: return round(100 * (value_B / (value_A + value_B)), 0)


def softmax_list_vals(vals, temp):
    return list(np.exp(np.array(vals) / temp) / np.sum(np.exp(np.array(vals) / temp), axis=0))


# takes in a list of dict objects for each row, writes to csv file at filename
def write_to_csv(data, filename, append=False):
    open_style = 'w' if not append else 'a'
    with open(filename, open_style) as f:
        csvwriter = csv.writer(f, delimiter=',')
        if not append: csvwriter.writerow(data[0].keys())
        for row in data:
            csvwriter.writerow(row.values())


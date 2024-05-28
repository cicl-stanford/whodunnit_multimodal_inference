import os 
import re 
import json
import base64


def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')


def filter_and_sort_files(file_list, first_keyword, second_keyword):
    filtered_files = [
        file for file in file_list
        if first_keyword in file.split("_")[0] and second_keyword in file
    ]
    def extract_number(file_name):
        # Extracts the numeric part from the file name
        match = re.search(rf'{first_keyword}(\d+)', file_name)
        return int(match.group(1)) if match else 0

    filtered_files = [
        file for file in file_list
        if first_keyword in file.split("_")[0] and second_keyword in file
    ]

    # Sort based on the extracted number
    filtered_files.sort(key=extract_number)
    return filtered_files


def get_images(data_args):
    
    image_files = os.listdir(os.path.join(data_args['dir'], data_args['images']))
    
    tv_files_before = filter_and_sort_files(image_files, "tv", "before")
    tv_files_after = filter_and_sort_files(image_files, "tv", "after")
    snack_files_before = filter_and_sort_files(image_files, "snack", "before")
    snack_files_after = filter_and_sort_files(image_files, "snack", "after")

    encoded_tv_files_before = [encode_image(os.path.join(data_args['dir'], data_args['images'], file)) for file in tv_files_before]
    encoded_tv_files_after = [encode_image(os.path.join(data_args['dir'], data_args['images'], file)) for file in tv_files_after]
    encoded_snack_files_before = [encode_image(os.path.join(data_args['dir'], data_args['images'], file)) for file in snack_files_before]
    encoded_snack_files_after = [encode_image(os.path.join(data_args['dir'], data_args['images'], file)) for file in snack_files_after]
    
    return {
        "tv": {
            "before": encoded_tv_files_before,
            "after": encoded_tv_files_after,
            "before_files": tv_files_before,
            "after_files": tv_files_after
        },
        "snack": {
            "before": encoded_snack_files_before,
            "after": encoded_snack_files_after,
            "before_files": snack_files_before,
            "after_files": snack_files_after,
        }
    }
    
    
def get_scene_graphs(data_args):
    
    scene_graph_files = os.listdir(os.path.join(data_args['dir'], data_args['scene_graphs']))
    
    tv_files_before = filter_and_sort_files(scene_graph_files, "tv", "before")
    tv_files_after = filter_and_sort_files(scene_graph_files, "tv", "after")
    snack_files_before = filter_and_sort_files(scene_graph_files, "snack", "before")
    snack_files_after = filter_and_sort_files(scene_graph_files, "snack", "after")
    
    tv_scene_graphs_before = [json.load(open(os.path.join(data_args['dir'], data_args['scene_graphs'], file))) for file in tv_files_before]
    tv_scene_graphs_after = [json.load(open(os.path.join(data_args['dir'], data_args['scene_graphs'], file))) for file in tv_files_after]
    snack_scene_graphs_before = [json.load(open(os.path.join(data_args['dir'], data_args['scene_graphs'], file))) for file in snack_files_before]
    snack_scene_graphs_after = [json.load(open(os.path.join(data_args['dir'], data_args['scene_graphs'], file))) for file in snack_files_after]
    
    
    return {
        "tv": {
            "before": tv_scene_graphs_before,
            "after": tv_scene_graphs_after,
            "before_files": tv_files_before,
            "after_files": tv_files_after,
        },
        "snack": {
            "before": snack_scene_graphs_before,
            "after": snack_scene_graphs_after,
            "before_files": snack_files_before,
            "after_files": snack_files_after,
        }
    }


def generate_payload(image_before, mission, image_after=None, audio=None, max_tokens=200, temperature=0.5, n=2):
    """
    Generates the payload for the GPT-4 Vision model, optionally including audio and/or a second image.
    """
    content = [
        {
            "type": "text",
            "text": "Take a deep breath. Your task is to analyze and determine which of two agents (A or B) is more likely to have done a specific action in an apartment. This decision should be based on a logical and consistent analysis of the initial state of the apartment and clue(s) about what happened.\n\nInitial State of the Apartment:"
        },
        {
            "type": "image_url",
            "image_url": {"url": f"data:image/jpeg;base64,{image_before}"}
        }
    ]

    if image_after:
        content.extend([
            {"type": "text", "text": "Final State of the Apartment (carefully analyze state changes, position of objects, and any new elements. Ensure your conclusions are consistent with the numerical and logical analysis of the clues):"},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_after}"}}
        ])

    if audio:
        content.append({
            "type": "text",
            "text": f"""Audio Recording of what Happened (focus on the precise details like the number of steps and sounds, ensuring your interpretation aligns with these numerical clues):
{audio}

Note: One step corresponds to one move on the grid, so consider the distance in steps from each agent to key locations when analyzing the audio clues."""
        })
       

    content.append({
        "type": "text",
        "text": f"\n\nBased on your analysis, you must answer the following question: *{mission}*.\n\nAnswer Options:\n0 - 100 (where 0 = definitely Agent A and 100 = definitely Agent B).\n\nStrictly follow this response format:\nReasoning: [your detailed 'Let's think step-by-step...' reasoning in no more than 200 words. Ensure your reasoning is numerically and logically consistent with the initial state and clues provided.]\nAnswer: [answer here]"
    })

    return {
        "model": "gpt-4-vision-preview",
        "messages": [{"role": "user", "content": content}],
        "max_tokens": max_tokens,
        "temperature": temperature,
        "n": n,
    }


    
    
def generate_prompt(state_before, mission, state_after=None, audio=None, max_tokens=200, temperature=0.5, n=2):
    """
    Generates the payload for a text-based model, optionally including descriptions of a second state and/or audio clues.
    """
    common_text = "Take a deep breath. Your task is to analyze and determine which of two agents (A or B) is more likely to have done a specific action in an apartment. This decision should be based on a logical and consistent analysis of the initial state of the apartment and clue(s) about what happened.\n\nInitial State of the Apartment:"

    answer_options = f"\n\nBased on your analysis, you must answer the following question: *{mission}*.\n\nAnswer Options:\n0 - 100 (where 0 = definitely Agent A and 100 = definitely Agent B).\n\nStrictly follow this response format:\nReasoning: [your detailed 'Let's think step-by-step...' reasoning in no more than 200 words. Ensure your reasoning is numerically and logically consistent with the initial state and clues provided.]\nAnswer: [answer here]"

    if state_after and audio:
        messages = [
        {
            "role": "user",
            "content": f"""{common_text}
{state_before}

Final State of the Apartment (carefully analyze state changes, position of objects, and any new elements. Ensure your conclusions are consistent with the numerical and logical analysis of the clues):
{state_after}

Audio Recording of what Happened (focus on the precise details like the number of steps and sounds, ensuring your interpretation aligns with these numerical clues):
{audio}

Note: One step corresponds to one move on the grid, so consider the distance in steps from each agent to key locations when analyzing the audio clues.{answer_options}"""
        }
    ]
        
    elif state_after and not audio:
        messages = [
        {
            "role": "user",
            "content": f"""{common_text}
{state_before}

Final State of the Apartment (carefully analyze state changes, position of objects, and any new elements. Ensure your conclusions are consistent with the numerical and logical analysis of the clues):
{state_after}{answer_options}"""
        }
    ]
        
    elif not state_after and audio:
        messages = [
        {
            "role": "user",
            "content": f"""{common_text}
{state_before}

Audio Recording of what Happened (focus on the precise details like the number of steps and sounds, ensuring your interpretation aligns with these numerical clues):
{audio}

Note: One step corresponds to one move on the grid, so consider the distance in steps from each agent to key locations when analyzing the audio clues.{answer_options}"""
        }
    ]
        
    else:
        messages = [
        {
            "role": "user",
            "content": f"""{common_text}
{state_before}{answer_options}"""
        }
    ]
   
    return {
        "model": "gpt-4-32k",
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": temperature,
        "n": n,
    }

    
    
def extract_answers(responses, default_reason="NA", default_answer=50):
    answers = []
    reasons = []
    for response in responses:
        try:
            reason = response['message']['content'].split("Reasoning:")[1].split('Answer:')[0].strip()
            answer = int(response['message']['content'].split('Answer:')[1].strip())
        except:
            print(f"Could not convert {response['message']['content']} to integer.")
            print(f"Using defalult answer {default_answer} and default reason {default_reason}")
            answer = default_answer
            reason = default_reason
        answers.append(answer)
        reasons.append(reason)
    return answers, reasons


def extract_answers_scene_graph(responses, default_reason="NA", default_answer=50):
    responses = [r.message.content for r in responses.choices]
    reasons = []
    answers = []

    for response in responses:
        try:
            reason = response.split("Reasoning:")[1].split('Answer:')[0].strip()
            answer = response.split('Answer:')[1].strip()
            
        except:
            print(f"Could not convert {response} to integer.")
            print(f"Using defalult answer {default_answer} and default reason {default_reason}")
            answer = default_answer
            reason = default_reason
        answers.append(answer)
        reasons.append(reason)
    return answers, reasons







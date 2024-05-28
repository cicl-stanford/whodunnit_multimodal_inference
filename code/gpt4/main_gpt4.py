import os
import hydra
import pandas as pd
from tqdm import tqdm
from omegaconf import DictConfig

from openai import AzureOpenAI

from helpers import *
from prompts import MISSIONS



def get_responses(client, messages):
    return client.chat.completions.create(**messages)
    

@hydra.main(version_base=None, config_path="conf", config_name="config")
def main(args: DictConfig) -> None:
   
    # Get data   
    audios = pd.read_csv(f"{args.data.dir}{args.data.audios}.csv")
    scene_graphs = get_scene_graphs(args.data)
    
    
    # Setup OpenAI API
    client = AzureOpenAI(
        azure_endpoint = os.getenv("AZURE_OPENAI_ENDPOINT"),
        api_version = "2023-05-15",
        api_key = os.getenv("AZURE_OPENAI_API_KEY"),
    )

    n = 30
    temp = 0.7

    # Processing and storing results
    results = []

    for category in ["tv", "snack"]:
        # Find matching audio entries for each category
        category_audios = audios[audios['trial'].str.startswith(category)]

        for i, (before, after, before_id, after_id) in tqdm(enumerate(zip(
            scene_graphs[category]["before"],
            scene_graphs[category]["after"],
            scene_graphs[category]["before_files"],
            scene_graphs[category]["after_files"],
        ))):
            print(f"Processing {category}_{i + 1}")
            # Extracting the specific audio entry for the current index
            audio = category_audios.iloc[i]['audio']
            mission = MISSIONS[category]

            prompt_vision = generate_prompt(before, state_after=after, mission=mission, max_tokens=400, temperature=temp, n=n)
            prompt_audio = generate_prompt(before, audio=audio, mission=mission, max_tokens=400, temperature=temp, n=n)
            prompt_both = generate_prompt(before, state_after=after, audio=audio, mission=mission, max_tokens=400, temperature=temp, n=n)

            responses_vision = get_responses(client, prompt_vision)
            responses_audio = get_responses(client, prompt_audio)
            responses_both = get_responses(client, prompt_both)

            answers_vision, reasons_vision = extract_answers_scene_graph(responses_vision)
            answers_audio, reasons_audio = extract_answers_scene_graph(responses_audio)
            answers_both, reasons_both = extract_answers_scene_graph(responses_both)
            
            # Store results for each response
            trial_id = f"{category}_{i + 1}"
            answer_idx = 0
            for reason, answer in zip(reasons_vision, answers_vision):
                results.append({
                    "condition": "vision", 
                    "trial_id": trial_id, 
                    "before": before_id, 
                    "after": after_id,
                    "n": answer_idx + 1, 
                    "reason": reason,
                    "response": answer, 
                })
                answer_idx += 1
            
            answer_idx = 0
            for reason, answer in zip(reasons_audio, answers_audio):
                results.append({
                    "condition": "audio", 
                    "trial_id": trial_id, 
                    "before": before_id, 
                    "after": after_id,
                    "n": answer_idx + 1, 
                    "reason": reason,
                    "response": answer, 
                })
                answer_idx += 1
                
            answer_idx = 0
            for reason, answer in zip(reasons_both, answers_both):
                results.append({
                    "condition": "both", 
                    "trial_id": trial_id, 
                    "before": before_id, 
                    "after": after_id,
                    "n": answer_idx + 1, 
                    "reason": reason,
                    "response": answer, 
                })
                answer_idx += 1
                
            # Convert results to DataFrame and update CSV file
            df = pd.DataFrame(results)
            df.to_csv("results_gpt4.csv", index=False)


if __name__ == '__main__':
    main()


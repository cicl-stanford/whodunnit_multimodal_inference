import os
import requests
import time
import hydra
import pandas as pd
from omegaconf import DictConfig


from helpers import *
from prompts import MISSIONS



def get_responses(payload, headers, max_retries=5, delay=10):
    """
    Sends a request to the GPT-4 Vision model and returns the responses.
    Handles rate limits by retrying the request after a delay.
    """
    retries = 0
    while retries < max_retries:
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        if response.status_code == 200:
            return response.json()['choices']
        elif response.status_code == 429:  # Status code for rate limiting
            print(f"Rate limit hit. Waiting for {delay} seconds before retrying...")
            time.sleep(delay)
            retries += 1
        else:
            response.raise_for_status()  # Raise an exception for other HTTP errors

    raise Exception(f"Max retries reached. Last response: {response.text}")


@hydra.main(version_base=None, config_path="conf", config_name="config")
def main(args: DictConfig) -> None:
   
    # Get data   
    images = get_images(args.data)
    audios = pd.read_csv(f"{args.data.dir}{args.data.audios}.csv")


    # Setup OpenAI API
    api_key = os.getenv("OPENAI_API_KEY")
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }

    n = 5
    temp = 0.7
    for attempt in range(6):
        print(f"Attempt {attempt + 1}")

        # Processing and storing results
        results = []


        for category in ["tv", "snack"]:
            # Find matching audio entries for each category
            category_audios = audios[audios['trial'].str.startswith(category)]

            for i, (before, after, before_id, after_id) in enumerate(zip(
                images[category]["before"], 
                images[category]["after"],
                images[category]["before_files"],
                images[category]["after_files"],
            )):
                # Extracting the specific audio entry for the current index
                audio = category_audios.iloc[i]['audio']
                mission = MISSIONS[category]
                print(f"Processing {category}_{i + 1}")
                payload_vision = generate_payload(before, image_after=after, mission=mission, max_tokens=400, temperature=temp, n=n)
                payload_audio = generate_payload(before, audio=audio, mission=mission, max_tokens=400, temperature=temp, n=n)
                payload_both = generate_payload(before, image_after=after, audio=audio, mission=mission, max_tokens=400, temperature=temp, n=n)
                # breakpoint()
                responses_vision = get_responses(payload_vision, headers)
                responses_audio = get_responses(payload_audio, headers)
                responses_both = get_responses(payload_both, headers)

                answers_vision, reasons_vision = extract_answers(responses_vision)
                answers_audio, reasons_audio = extract_answers(responses_audio)
                answers_both, reasons_both = extract_answers(responses_both)
                
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
                df.to_csv(f"results_gpt4v_{attempt+1}.csv", index=False)

if __name__ == '__main__':
    main()

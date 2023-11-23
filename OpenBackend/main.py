from flask import Flask, request
from flask_cors import CORS
import openai
import time
import re
import csv
import os 
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

@app.route('/api/assistant', methods=['POST'])
# def process_csv_data():
#     try:
#         with open('assistant_responses.csv', newline='') as csvfile:
#             reader = csv.reader(csvfile)
#             for row in reader:
#                 name = row[0]    
#                 content = row[1] 
#                 print(f"Name: {name}")
#                 print(f"Content: {content}")
#                 print("---------------------------------")
#         return {"name": name, "content": content}, 200
#     except Exception as e:
#         print(f"Error reading from CSV: {e}")
def assistant():
    openai_key = os.getenv('OPENAI_KEY')
    assistant_key = os.getenv('ASSISTANT_KEY')
    content = request.json.get('content', '')
    thread_id = request.json.get('thread_id')  # Extract thread_id from the request JSON
    # {KALVIN}
    client = openai.Client(api_key=openai_key)

    try:
        # {KALVIN}
        assistant = client.beta.assistants.retrieve(assistant_key)

        if thread_id:  # Check if thread_id is present in the request
            thread = client.beta.threads.retrieve(thread_id)  # Use the provided thread_id
            client.beta.threads.messages.create(
                thread_id=thread_id,
                role="user",
                content=content
            )
        else:
            thread = client.beta.threads.create(
                messages=[
                    {
                        "role": "user",
                        "content": content,
                    }
                ]
            )
            thread_id = thread.id
        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id
        )
        # print(run)
        while True:
            run = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )
            
            if run.status in ['completed', 'failed']:
                break
            time.sleep(1)  

        if run.status == 'completed':
            messages = client.beta.threads.messages.list(
                thread_id=thread.id
            )
            
            # Initialize variables to hold the latest user input and assistant response
            latest_user_input = None
            latest_assistant_response = None

            # Iterate through messages to find the latest user input and assistant response
            for msg in reversed(messages.data):
                if msg.role == "user":
                    latest_user_input = {
                        "role": msg.role,
                        "content": msg.content[0].text.value
                    }
                elif msg.role in ["system", "assistant"]:
                    latest_assistant_response = {
                        "role": msg.role,
                        "content": msg.content[0].text.value
                    }
            if latest_assistant_response and "Fame Score" in latest_assistant_response["content"] and "Membership Value" in latest_assistant_response["content"] and "Supplemental Information" in latest_assistant_response["content"]:
                print("Fame Score found in the latest assistant response.")

                name_match = re.search(r'\*\*(.+?)\*\*', latest_assistant_response["content"])
                name = name_match.group(1) if name_match else 'Unknown'
                print(f"Extracted name: {name}")

                csv_data = [name, latest_assistant_response["content"]]
                print(f"Data to be written to CSV: {csv_data}")

                try:
                    with open('assistant_responses.csv', mode='a', newline='') as file:
                        writer = csv.writer(file)
                        writer.writerow(csv_data)
                    print("Data written to CSV successfully.")
                except Exception as e:
                    print(f"Error writing to CSV: {e}")

            if latest_user_input and latest_assistant_response:
                combined_message = {
                    "messages": [
                        {
                            "content": latest_user_input["content"],
                            "role": "user"
                        },
                        {
                            "content": latest_assistant_response["content"],
                            "role": "assistant"
                        }
                    ],
                    "thread_id": thread.id
                }
                return combined_message, 200
            else:
                return {"error": "Required messages not found"}, 500



    except openai.error.OpenAIError as e:
        return {"error": f"An OpenAI API error occurred: {e}"}, 500

    except Exception as e:
        return {"error": f"An unexpected error occurred: {e}"}, 500

if __name__ == '__main__':
    # process_csv_data()
    app.run(debug=True)
from flask import Flask, request
import brain
import json
from pprint import pprint
app = Flask(__name__)

print "Creating the Redis client..."
redis_client = brain.createRedisClient()

print "Loading predefined headlines..."
headlines_filename = 'headlines.txt'
with open(headlines_filename) as f:
    questions = [x.strip() for x in f.readlines()]
    ids = map(lambda x: str(x), range(0, len(questions)))
    brain.recompute_model(ids, questions, redis_client)

print "Computed a model from headlines"

@app.route("/similar/", methods=['GET'])
def similar():
    global redis_client
    query = request.args.get('q', '')
    id_list = brain.find_similar(query, redis_client)
    json_response = json.dumps({'ids': id_list})
    pprint(json_response)
    return json_response

@app.route("/update/", methods=['POST'])
def update():
    global redis_client
    idsAndTitles = request.get_json().items()
    ids, titles = zip(*idsAndTitles)
    brain.recompute_model(ids, titles, redis_client)
    return "" # an empty response

if __name__ == "__main__":
    app.run()

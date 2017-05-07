from flask import Flask, request
import brain
import json
from pprint import pprint

app = Flask(__name__)

print "Creating the Redis client..."
redis_client = brain.createRedisClient()

# print "Loading predefined headlines..."
# headlines_filename = 'headlines.txt'
# with open(headlines_filename) as f:
#     questions = [x.strip() for x in f.readlines()]
#     ids = map(lambda x: str(x), range(0, len(questions)))
#     brain.recompute_model(ids, questions, redis_client)

# print "Computed a model from headlines"

@app.route("/similar/", methods=['GET'])
def similar():
    global redis_client
    print "Received request for similar questions"
    query = request.args.get('q', '')
    id_list = brain.find_similar(query, redis_client)
    json_response = json.dumps({'ids': id_list})
    print "Reply back with:"
    pprint(json_response)
    return json_response

@app.route("/update/", methods=['POST'])
def update():
    global redis_client
    print "Received request for update"
    idsAndTitles = request.get_json().items()
    ids, titles = zip(*idsAndTitles)
    print "Received %i questions to recompute model" % len(ids)
    # brain.recompute_model(ids, titles, redis_client)
    print "Model is recomputed"
    return "" # an empty response

if __name__ == "__main__":
    with open('final_headlines.txt', 'r') as inp:
        lines = inp.readlines()
    N = 1000
    qs = [x.strip() for x in lines]
    ids = map(lambda x: str(x + 1000), range(0, len(qs)))
    print "Computing the similarity model..."
    brain.recompute_model(ids, qs, redis_client)

    app.run(host='0.0.0.0', port=5000)

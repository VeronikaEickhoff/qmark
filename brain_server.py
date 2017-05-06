from flask import Flask, request
app = Flask(__name__)

@app.route("/similar/", methods=['GET'])
def hello():
	return "Your request is %s" % request.args.get('q', '')

if __name__ == "__main__":
    app.run()
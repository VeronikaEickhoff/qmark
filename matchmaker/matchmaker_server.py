
import psycopg2
from flask import Flask, request
from multiprocessing import Process
from time import sleep

app = Flask(__name__)

db_host='192.168.28.162'
db_port=5432

try:
    conn = psycopg2.connect("dbname='qmark' user='anselm' host='%s' port=%i" % (db_host, db_port))
except Exception as e:
    print "I am unable to connect to the database"
    print e

def next_article_id():
    query = """
        select max(id) from article;
    """
    cur = conn.cursor()
    cur.execute(query)
    old = cur.fetchall()[0][0]
    if old is None:
        old = "0"
    return int(old) + 1

def get_question_title(qid):
    query = """
        select title from question where id=%i;
    """ % qid
    print "Executing:", query
    cur = conn.cursor()
    cur.execute(query)
    return cur.fetchall()[0][0]

def insert_new_article(article_id, article_title, writer_id):
    query = """
        insert into article values (%i, '%s', null, %i);
    """ % (article_id, article_title.replace('\'', '\\\''), writer_id)
    print "Executing:", query
    cur = conn.cursor()
    cur.execute(query)


def update_question_response(qid, article_id):
    query = """
        update question set response_id=%i where id=%i;
    """ % (article_id, qid)
    print "Executing:", query
    cur = conn.cursor()
    cur.execute(query)

def choose_writer(qid):
    print "Choosing the writer for question #%s" % qid
    query = """
        select u.id, max(user_average_rating(u)) from application a
        inner join "user" u on a.journalist_id=u.id
        where a.question_id=%i 
        group by u.id;
    """ % qid
    cur = conn.cursor()
    cur.execute(query)
    writer_id = cur.fetchall()[0][0]
    print "Chosen one is", writer_id
    article_id = next_article_id()
    print "New article id is", article_id
    article_title = get_question_title(qid)
    print "New article title is", article_title
    #TODO insert new article into the DB
    insert_new_article(article_id, article_title, writer_id)
    update_question_response(qid, article_id)
    conn.commit()


def booking_hook(qid, sleepSecs=5):
    print "Sleeping for %i seconds..." % sleepSecs
    sleep(sleepSecs)
    choose_writer(qid)

@app.route("/book/", methods=['POST'])
def book():
    posted = request.get_json() # { 'qid': <id>, 'category': <int>}
    qid = posted.get('qid')
    if qid is None:
        print 'qid is not provided'
        return ""
    qid = int(qid)
    cat = posted.get('cat')
    if cat is None:
        print 'cat is not provided'
        return ""
    cat = int(qid)
    Process(target=booking_hook, args=(qid,)).start()
    print "Started new process"
    # start timer
    # when timer finishes run a handler to choose the journalist
    return "" # an empty response

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5001)

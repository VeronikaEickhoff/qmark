
import psycopg2
import random

filename = 'final_headlines.txt'

db_host='192.168.28.162'
db_port=5432

try:
    conn = psycopg2.connect("dbname='qmark' user='anselm' host='%s' port=%i" % (db_host, db_port))
except Exception as e:
    print "I am unable to connect to the database"
    print e

def main():
    with open(filename, 'r') as inp:
        lines = filter(lambda l: len(l) < 600, inp.readlines())
    print "Lines", len(lines)
    N = 1000
    qs = [x.strip() for x in lines]
    ids = map(lambda x: str(x + N), range(0, len(qs)))
    d = dict(zip(ids, qs))

    for (key, value) in d.iteritems():
        qid = key
        author_id = random.randint(1, 7)
        title = value
        query = """
            insert into question values (%s, %i, null, 0, '%s');
        """ % (qid, author_id, title.replace('\'', '').replace('\"', ''))
        # print "Executing:", query
        cur = conn.cursor()
        cur.execute(query)

    conn.commit()



if __name__ == "__main__":
    main()

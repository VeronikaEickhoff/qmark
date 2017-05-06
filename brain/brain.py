import cPickle
import numpy as np
from scipy.sparse import csr_matrix, vstack
from sklearn.feature_extraction.text import TfidfVectorizer, TfidfTransformer, HashingVectorizer
import redis


def createRedisClient():
    return redis.StrictRedis(host='localhost', port=6379, db=0)


def _save_question_ids_redis(question_ids, redis_client):
    question_ids = ';'.join(e for e in question_ids)
    redis_client.set('question_ids', question_ids)


def _get_question_ids_redis(redis_client):
    return redis_client.get('question_ids').split(";")


def _save_csr_matrix_redis(redis_client, csr_matrix):
    """Save matrix components in Redis (vectorizer, vectorized matrix, transformer and tfidf_matrix)"""

    redis_client.set('data', csr_matrix.data.tostring())
    redis_client.set('indices', csr_matrix.indices.tostring())
    redis_client.set('indptr', csr_matrix.indptr.tostring())
    redis_client.set('shape1', csr_matrix.shape[0])
    redis_client.set('shape2', csr_matrix.shape[1])


def _get_csr_matrix_redis(redis_client):
    """Compose csr matrix from its components in Redis"""

    data = np.fromstring(redis_client.get('data'), dtype=float)
    indices = np.fromstring(redis_client.get('indices'), dtype=np.int32)
    indptr = np.fromstring(redis_client.get('indptr'), dtype=np.int32)
    shape1 = redis_client.get('shape1')
    shape2 = redis_client.get('shape2')

    return csr_matrix((data, indices, indptr), shape=(shape1, shape2), dtype=float)


from pattern.text.en import parsetree
from pattern.en import tag


def preprocess_text(text):
    lemmata_text = " ".join(
        map(lambda sentence: " ".join(sentence.lemmata), parsetree(text, lemmata=True).sentences))
    tagged_terms = tag(lemmata_text)

    filtered_terms = \
        map(lambda term_tag: term_tag[0],
            filter(lambda term_tag:
                   (term_tag[1] == "NN" or term_tag[1] == "VB" or term_tag[1] == "NNP-LOC"
                    or term_tag[1] == "FW" or term_tag[1] == "NNP" or term_tag[1] == "NNS"),
                   tagged_terms))

    if len(filtered_terms) == 0:
        return lemmata_text
    return " ".join(filtered_terms)

#
# print preprocess_text(
# "Former President of the Philippines Corazon Aquino dies at the age of 76 of cardiopulmonary arrest after complications of colon cancer. A memorial service and funeral is scheduled for August 5. (Philippine Daily Inquirer)")

def recompute_model(question_ids, question_texts, redis_client, n_features=100000):
    # redis_client = rc()

    _save_question_ids_redis(question_ids, redis_client)

    question_texts = map(lambda text: preprocess_text(text), question_texts)

    vectorizer = HashingVectorizer(n_features=n_features)
    vectorized_matrix = vectorizer.transform(question_texts)
    transformer = TfidfTransformer()
    tfidf = transformer.fit_transform(vectorized_matrix)

    redis_client.set('vectorizer', cPickle.dumps(vectorizer))
    redis_client.set('transformer', cPickle.dumps(transformer))
    _save_csr_matrix_redis(redis_client, tfidf)


def update_model(new_question_text, redis_client):
    vectorizer = cPickle.loads(redis_client.get('vectorizer'))
    transformer = cPickle.loads(redis_client.get('transformer'))
    tfidf = _get_csr_matrix_redis(redis_client)

    new_question_text = preprocess_text(new_question_text)
    new_question_vectorized = vectorizer.transform([new_question_text])
    new_question_tfidf = transformer.transform(new_question_vectorized)
    tfidf = vstack((tfidf, new_question_tfidf))

    # _save_csr_matrix_redis(redis_client, tfidf)

    return tfidf


def find_similar(new_question_text, redis_client, topN=5):
    """
        return a list of IDs
    """
    # redis_client = rc()

    tfidf = update_model(new_question_text, redis_client)
    new_question_vector = (tfidf[-1]).toarray()

    similarity_scores = np.transpose(tfidf.dot(np.transpose(new_question_vector)))[0]

    question_ids = _get_question_ids_redis(redis_client)
    return map(lambda x: x[0], sorted(zip(question_ids, similarity_scores[:-1]), key=lambda x: -x[1])[:topN])


# rc().flushall()

# questions = ["How Trump became the president", "Trump is a president", "Putin eats kids"]
# recompute_model(["q1", "q2", "q3"], questions)
#
# new_question = "This is Mr. Putin"
# find_similar(new_question)


# with open("headlines.txt") as f :
#     questions = f.readlines()

# questions = [x.strip() for x in questions]
# ids = map(lambda x: str(x), range(0, len(questions)))

# recompute_model(ids, questions)

# new_question = "Will Putin be win the next presidential elections in Russia?"
# print find_similar(new_question)

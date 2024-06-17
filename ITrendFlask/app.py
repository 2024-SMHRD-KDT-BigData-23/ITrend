# app.py
import json
from flask import Flask, request, jsonify, send_file
import numpy as np
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
import tensorflow as tf
from tensorflow.keras.preprocessing.text import tokenizer_from_json
from wordcloud import WordCloud
import matplotlib.pyplot as plt
from collections import Counter
from io import BytesIO
import os  


app = Flask(__name__)

# 모델과 토크나이저, 레이블 인코더 로드
model = load_model('./data/my_model.keras')
# JSON 파일에서 Tokenizer 로드
with open('./data/tokenizer.json') as json_file:
    tokenizer_json = json.load(json_file)
tokenizer = tokenizer_from_json(tokenizer_json)

# JSON 파일에서 LabelEncoder 로드
with open('./data/label_encoder.json') as json_file:
    label_encoder_classes = json.load(json_file)
label_encoder = LabelEncoder()
label_encoder.classes_ = np.array(label_encoder_classes)

@app.route('/recommend', methods=['POST'])
def recommend_jobs():
    data = request.json
    skills = data.get('categories')
    
    num_recommendations = data.get('num_recommendations', 3)
    
    sequences = tokenizer.texts_to_sequences([skills])
    max_len = model.input_shape[1]
    padded_sequence = pad_sequences(sequences, maxlen=max_len)
    padded_sequence = np.reshape(padded_sequence, (padded_sequence.shape[0], padded_sequence.shape[1], 1))
    
    predictions = model.predict(padded_sequence)
    top_indices = predictions[0].argsort()[-num_recommendations:][::-1]
    recommended_jobs = label_encoder.inverse_transform(top_indices)
    
    return jsonify({'recommended_jobs': recommended_jobs.tolist()})

@app.route('/sdwordcloud', methods=['POST'])
def generate_sdwordcloud():
    data = request.json
    text_list = data.get('text_list')
    
    # 리스트의 각 요소를 공백으로 구분된 하나의 문자열로 결합
    text = ' '.join(text_list)

    # 데이터 전처리
    text = text.strip()

    # 쉼표를 기준으로 단어 분할 후 각 단어에서 쉼표 제거
    words_list = [word.replace(',', '') for word in text.split()]
    
    # 단어 빈도수 계산
    word_counts = Counter(words_list)
    
    # 상위 40개 단어만 추출
    top_40_words = dict(word_counts.most_common(40))
    
    # 워드클라우드 생성
    font_path = 'C:\\Windows\\Fonts\\malgun.ttf'
    wordcloud = WordCloud(
        font_path=font_path,
        prefer_horizontal = 1,
        width=800,
        height=400,
        background_color='white',
        contour_color='black',
        contour_width=1,
        colormap='BuPu',
        mode='RGB'
    ).generate_from_frequencies(top_40_words)
    
    # 이미지로 변환
    img_data = BytesIO()
    wordcloud.to_image().save(img_data, format='PNG')
    img_data.seek(0)
    
    return send_file(img_data, mimetype='image/png')
    
@app.route('/jobwordcloud', methods=['POST'])
def generate_jobwordcloud():
    data = request.json
    text_list = data.get('text_list')
    
    # 리스트의 각 요소를 공백으로 구분된 하나의 문자열로 결합
    text = ' '.join(text_list)

    # 데이터 전처리
    text = text.strip()

    # 쉼표를 기준으로 단어 분할 후 각 단어에서 쉼표 제거
    words_list = [word.replace(',', '') for word in text.split()]
    
    # 단어 빈도수 계산
    word_counts = Counter(words_list)
    
    # 상위 40개 단어만 추출
    top_40_words = dict(word_counts.most_common(40))
    
    # 워드클라우드 생성
    font_path = 'C:\\Windows\\Fonts\\malgun.ttf'
    wordcloud = WordCloud(
        font_path=font_path,
        prefer_horizontal = 1,
        width=800,
        height=400,
        background_color='white',
        contour_color='black',
        contour_width=1,
        colormap='BuPu',
        mode='RGB'
    ).generate_from_frequencies(top_40_words)
    
    # 이미지로 변환
    img_data = BytesIO()
    wordcloud.to_image().save(img_data, format='PNG')
    img_data.seek(0)
    
    return send_file(img_data, mimetype='image/png')
    
@app.route('/jobwordcloudfq', methods=['POST'])
def generate_jobwordcloudfq():
    data = request.json
    text_list = data.get('text_list')
    
    # 리스트의 각 요소를 공백으로 구분된 하나의 문자열로 결합
    text = ' '.join(text_list)

    # 데이터 전처리
    text = text.strip()

    # 쉼표를 기준으로 단어 분할 후 각 단어에서 쉼표 제  거
    words_list = [word.replace(',', '') for word in text.split()]
    
    # 단어 빈도수 계산
    word_counts = Counter(words_list)
    
    # 단어 빈도수 정보를 순위와 함께 저장
    top_words_with_rank = {}
    rank = 1
    for word, count in word_counts.most_common(40):
        top_words_with_rank[word] = {'count': count, 'rank': rank}
        rank += 1
    
    return jsonify({'word_counts_with_rank': top_words_with_rank})
    
@app.route('/sdwordcloudfq', methods=['POST'])
def generate_sdwordcloudfq():
    data = request.json
    text_list = data.get('text_list')
    
    # 리스트의 각 요소를 공백으로 구분된 하나의 문자열로 결합
    text = ' '.join(text_list)

    # 데이터 전처리
    text = text.strip()

    # 쉼표를 기준으로 단어 분할 후 각 단어에서 쉼표 제거
    words_list = [word.replace(',', '') for word in text.split()]
    
    # 단어 빈도수 계산
    word_counts = Counter(words_list)
    
    # 단어 빈도수 정보를 순위와 함께 저장
    top_words_with_rank = {}
    rank = 1
    for word, count in word_counts.most_common(40):
        top_words_with_rank[word] = {'count': count, 'rank': rank}
        rank += 1
    
    return jsonify({'word_counts_with_rank': top_words_with_rank})

if __name__ == '__main__':
    app.run('127.0.0.1', port=5000)
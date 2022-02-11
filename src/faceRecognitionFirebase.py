import face_recognition
import cv2
from face_recognition.api import face_encodings
import pyrebase
from flask import Flask, jsonify, request
import os.path
import pytesseract

app = Flask(__name__)
tessdata_dir_config = r'--tessdata-dir "./tessdata"'

@app.route("/fetchData")
def dataTest():
    return {"members": ["Hello", "This Works", "Do better stuff man"]}

@app.route('/personData', methods=['POST', 'GET'])
def personData():
    f = request.files['file']
    f.save(f.filename)
    person_json = {"Img":f.filename, "Path":"./" + f.filename}
    person_json = jsonify(findPerson(person_json))

    return person_json

@app.route('/missingPeople', methods=['POST', 'GET'])
def missingPeople():
    config = {
    "apiKey": "AIzaSyBOkIXeckED7TmUTpaLW23BYuVtWIanQyY",
    "authDomain": "face-recognition-c1e84.firebaseapp.com",
    "databaseURL": "https://face-recognition-c1e84-default-rtdb.firebaseio.com",
    "projectId": "face-recognition-c1e84",
    "storageBucket": "face-recognition-c1e84.appspot.com",
    "messagingSenderId": "225780171266",
    "appId": "1:225780171266:web:b63f0946a7ee9732eedd1b",
    "measurementId": "G-VVWZECG12S"
    }

    fb = pyrebase.initialize_app(config)

    storage = fb.storage()
    db = fb.database()

    requestData = request.get_json()
    print(requestData)
    path = requestData["Who"].replace(" ", "") + ".jpg"
    storage.child(path).put("./"+requestData["Img"])
    db.child("People").child(requestData["Who"]).update({"Name":requestData["Who"], "Img":path})

    return jsonify("All Good")
    

def findPerson(personData_json):
    config = {
    "apiKey": "AIzaSyBOkIXeckED7TmUTpaLW23BYuVtWIanQyY",
    "authDomain": "face-recognition-c1e84.firebaseapp.com",
    "databaseURL": "https://face-recognition-c1e84-default-rtdb.firebaseio.com",
    "projectId": "face-recognition-c1e84",
    "storageBucket": "face-recognition-c1e84.appspot.com",
    "messagingSenderId": "225780171266",
    "appId": "1:225780171266:web:b63f0946a7ee9732eedd1b",
    "measurementId": "G-VVWZECG12S"
    }

    fb = pyrebase.initialize_app(config)

    storage = fb.storage()
    db = fb.database()

    path = personData_json['Path'] #input("Please input path to subject image: ")
    img_name = personData_json['Img'] #input("Please input just the name of the subjects' image: Ex: ElonMusk.jpg ")

    img = cv2.imread(path)
    img = cv2.resize(img, (400, int(400*img.shape[0]/img.shape[1])))
    rgb_img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    try:
        encodedimg = face_recognition.face_encodings(rgb_img)[0]
    except:
        return {'Name':'No clear face', 'Found':True, 'Img':img_name}


    people = db.child("People").get()

    for person in people.each():
        person_img = person.val()['Img']
        if not os.path.exists(person_img):
            print("Downloading", person_img)
            storage.child(person_img).download(person_img)

    found = False

    for person in people.each(): #for each person, figure out their name and get their image
        person_val = person.val()
        print(person_val)

        person_img = person_val['Img']
        person_name = person_val['Name']

        new_path = "./" + person_img
        new_img = cv2.imread(new_path)
        new_rgb_img = cv2.cvtColor(new_img, cv2.COLOR_BGR2RGB)
        new_encodedimg = face_recognition.face_encodings(new_rgb_img)[0]

        if face_recognition.compare_faces([new_encodedimg], encodedimg)[0]: #if its a match, then say who the person is and box their face
            print(person_name)
            found = True
            break
    if found:
        return {"Name":person_name, "Found":True, "Img": img_name}
    else:
        return {"Img":img_name, "Found":False}

@app.route('/textRecog', methods=['POST', 'GET'])
def findText():
    f = request.files['file']
    f.save("./" + f.filename)
    path = "./" + f.filename
    name = f.filename
    
    img = cv2.imread(path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = cv2.threshold(img, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)[1]
    img = cv2.medianBlur(img, 5)

    text = pytesseract.image_to_string(img, config=tessdata_dir_config)
    print(text)

    cv2.imshow(name, img)
    cv2.waitKey(10000)
    cv2.destroyAllWindows()

    if len(text) > 0:
        response = jsonify({'Img':name, 'Text':text, 'Found':True})
    else:
        response = jsonify({'Img':name, 'Found':False})

    return response
    
if __name__ == "__main__":  
    app.run(debug=True)
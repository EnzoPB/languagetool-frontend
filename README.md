# LanguageTool frontend
Simple pure HTML frontend for the [LanguageTool open-source API](https://dev.languagetool.org/http-server)

![screenshot](https://github.com/user-attachments/assets/a3285b52-a87e-47da-a648-d50b9eb14286)


## Installation
The frontend is in pure HTML/CSS/JS. You just need to statically serve the files of this repository using a web server (like NGinx, Github Pages, or the [static-web-server](https://hub.docker.com/r/joseluisq/static-web-server/) Docker image).\
You may want to host the LanguageTool API and the frontend under the same host, to avoid dealing with CORS.\
You must edit `config.js` to set the API URL.

## Usage
Put the text you want to check in the textbox, and click "Submit". A list of detected errors and suggested corrections will appear under.\
Click "locate" to find where this mistake is located in the text, click "correct" to automatically replace the mistake with the correction.

## License
[MIT License](https://github.com/EnzoPB/languagetool-frontend/blob/main/LICENSE)

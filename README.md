

# Passport Analyzer API

This is a simple Express.js API that uses AWS Textract to analyze a passport image uploaded by the user and extract the date of birth and expiry date information. 

## Setup

1. Clone the repository to your local machine
2. Install dependencies using `npm install`
3. Set your AWS access key ID and secret access key in environment variables `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` respectively.
4. Start the server using `npm start`
5. Use an API testing tool such as Postman to send a POST request to the API endpoint `http://localhost:3000/api/passport` with a passport image file attached as `passport` key in form-data.

## API Endpoint

### POST /api/passport

#### Request

- Method: POST
- Headers: Content-Type: multipart/form-data
- Body: passport image file as `passport` key in form-data

#### Response

- Status Code: 200 OK
- Body: JSON object with extracted date of birth and expiry date in `dob` and `expiry` properties respectively.

If there was an error with the request, the response will have a non-200 status code and an error message in the `error` property of the response body. 

## Dependencies

- Express.js: A popular Node.js web framework for building APIs and web applications.
- AWS SDK: A Node.js library for interacting with various AWS services.
- Multer: A Node.js middleware for handling `multipart/form-data` requests, such as file uploads.
- fs: A Node.js built-in module for working with the file system.

## License

This code is licensed under the MIT License.

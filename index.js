const api = require('instagram-node').instagram();
const fs = require('fs');
var http = require('http');
var express = require('express');
var msg, token;
const app = express();
const port = process.env.PORT || 3000

exports.robot = function (req, res) {
    if (req) {
        fs.readFile('comment.txt', 'utf8', function (err, data) {
            if (err) throw err;
            console.log(data);
            msg = data;

            postMessage();
        });
    }
};

function postMessage() {
    let user = '1098348926'; //id's user
    if (msg) {
        token = exports.handleauth
        /* OPTIONS: { [count], [min_timestamp], [max_timestamp], [min_id], [max_id] }; */
        api.user_media_recent(user, [10],
            function (err, medias, pagination, remaining, limit) {
                if (err) throw err;
                if (medias)
                    console.log(medias);

            });
    } else {
        throw new Error('err to open file.');
    }

};

api.use({
    client_id: '74f62af4c9c4454cb2c32eb4d1e6d96c',
    client_secret: '27123e5da8864f67b7e83f7b2dbf3899'
});

var redirect_uri = 'http://localhost:3000/handleauth';

exports.authorize_user = function (req, res) {
    res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function (req, res) {
    api.authorize_user(req.query.code, redirect_uri, function (err, result) {
        if (err) {
            console.log(err.body);
            res.send("Didn't work");
        } else {
            console.log('Yay! Access token is ' + result.access_token);
            res.send('You made it!!');
            return result.access_token;
        }
    });
};
app.get('/authorize_user', exports.authorize_user);
app.get('/handleauth', exports.handleauth);
app.get('/robot', exports.robot);

app.listen(port, () => console.log(`server listening on port ${port}!`))
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
    let user = 'xxxxxx'; //id's user
    if (msg) {
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
    client_id: 'xxxxxxxx',
    client_secret: 'xxxxxxxx'
});

//api.use({ access_token: 'xxxxxxxxx' });

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
        }
    });
};


app.get('/authorize_user', exports.authorize_user);
app.get('/handleauth', exports.handleauth);
app.get('/robot', exports.robot);

app.listen(port, () => console.log(`server listening on port ${port}!`))
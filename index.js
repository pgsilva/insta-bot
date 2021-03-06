//https://api.instagram.com/oauth/authorize/?client_id=74f62af4c9c4454cb2c32eb4d1e6d96c&redirect_uri=http://localhost:3000/handleauth&response_type=code&scope=public_content
const api = require('instagram-node').instagram();
const fs = require('fs');
var http = require('http');
var express = require('express');
var msg, user;
const app = express();
const port = process.env.PORT || 3000

api.use({
    client_id: 'xxx',
    client_secret: 'xxx'
});

//api.use({ access_token: 'xxx' });

var redirect_uri = 'http://localhost:3000/handleauth';

exports.authorize_user = function (req, res) {
    res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};

exports.handleauth = function (req, res) {
    api.use({
        client_id: 'xxxx',
        client_secret: 'xxx'
    });
    api.authorize_user(req.query.code, redirect_uri, function (err, result) {
        if (err) {
            console.log(err);
            res.send("Didn't work");
        } else {
            console.log('Yay! Access token is ' + result.access_token);
            res.send('You made it!!');
        }
    });
};


app.get('/authorize_user', exports.authorize_user);
app.get('/handleauth', exports.handleauth);
app.get('/robot', (req, res) => {
    if (req.query.user) {
        fs.readFile('comment.txt', 'utf8', function (err, data) {
            if (err) throw err;
            console.log(data);
            msg = data;
            getUsername(req.query.user);
        });
    } else {
        res.send('Not found');
    }
});

function getUsername(username) {
    api.use({ access_token: 'xxx' });
    api.user_search(username, [1], function (err, users, remaining, limit) {
        if (err) throw err;
        console.log(users);
        user = users;
        postMessage();
    });
};
function postMessage() {
    api.use({ access_token: 'xxx' });
    if (user) {
        /* OPTIONS: { [count], [min_timestamp], [max_timestamp], [min_id], [max_id] }; */
        api.user_media_recent(user.user_id, [10],
            function (err, medias, pagination, remaining, limit) {
                if (err) throw err;
                if (medias)
                    console.log(medias);

            });
    } else {
        throw new Error('err to open file.');
    }

};

app.listen(port, () => console.log(`server listening on port ${port}!`))
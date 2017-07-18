window.dash = window.dash || {};
var db = require('diskdb'),
    bcrypt = require('bcrypt-nodejs');
 
db = db.connect('collections', ['users', 'settings']);
 
dash.registerUser = function(name, userid, password) {
 
    if (db.users.findOne({
        userid: userid
    })) return 0; 
 
    var savedUser = db.users.save({
        name: name,
        userid: userid,
        password: bcrypt.hashSync(password)
    });
    return populateUser(savedUser);
};
 
dash.authUser = function(userid, password) {
    
 
    var user = db.users.findOne({
        userid: userid
    });
    if (user) {
        if (bcrypt.compareSync(password, user.password)) {
            return populateUser(user);
        } else {
            return 3;
        }
 
    } else {
        return 0;
    }
};
 
dash.signOut = function () {
 
	localStorage.removeItem('user');
	localStorage.removeItem('settings');
	return 1;
};
 
var populateUser = function(user) {
    
 
    delete user.password; 
    
    localStorage.setItem('user', JSON.stringify(user));
 
    var setg = db.settings.findOne({
        uid: user._id
    });
    if (setg) {
        localStorage.setItem('settings', JSON.stringify(setg.settings));
        return 1;
    } else {
        return 2;
    }
};
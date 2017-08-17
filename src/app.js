/**
 * Created by 文朝希 on 2017/8/16.
 */
import './css/reset.css';
import './css/slideBanner.css';
import './css/contactPop.css';
import './css/aboutMe.css';
import './css/myView.css';
import './css/main.css';
import './css/morePro.css';

require('./js/boots.js');
require('./js/main.js');
require('./js/aboutMe.js');
require('./js/myView.js');
// require('./js/morePro.js');

import '../index.html';

$(document).ready(function(){
    $("html,body").animate({"scrollTop": 0}, 100);
});
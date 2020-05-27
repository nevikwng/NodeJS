const express = require('express')
const app = express();
// const multer = require('multer')
// const upload = multer({ dest: 'tmp_files/' })
const fs = require('fs')
const upload = require(__dirname + '/upload-module');
const session = require('express-session');
const MysqlStore = require('express-mysql-session')(session);
const db = require(__dirname+'/db_connect');
const sessionStore = new MysqlStore({}, db);
const cors = require('cors');
const whitelist = [undefined,'http://localhost:8080', 'http://localhost:8080', 'http://localhost:5050', 'http://127.0.0.1:5500', 'http://localhost:63342']
const corsOptions = {
    credentials: true,
    origin:function(origin,cb){
        console.log(origin)
        if(whitelist.indexOf(origin)!==-1){
            cb(null,true)
        }else{
            cb(null,false)
        }
    }
}
app.use(cors(corsOptions));
//套件
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(__dirname + '/public'))
app.use(session({

    saveUninitialized:false,
    resave:false,
    secret:'nevikwng',
    cookie:{
        maxAge:1200000,
    },
    store: sessionStore,
}))


app.get('/', (mes, res) => {
    res.render('main', { name: 'darren' })
})
app.get('/try-upload', (req, res)=>{
    res.render('try-upload');
})
// app.post('/try-upload', upload.single('avatar'), (req, res)=>{
//     const output = {
//         success: false,
//         uploadedImg: '',
//         nickname: '',
//         errorMsg: ''
//     }
//     output.nickname = req.body.nickname || '';
//     if(req.file && req.file.originalname){
//         switch(req.file.mimetype){
//             case 'image/png':
//             case 'image/jpeg':
//                 fs.rename(req.file.path, './public/img/'+ req.file.originalname, error=>{
//                     if(!error){
//                         output.success = true;
//                         output.uploadedImg = '/img/' + req.file.originalname;
//                     }
//                     res.render('try-upload', output);
//                 })
//                 break;
//             default:
//                 fs.unlink(req.file.path, error=>{
//                     output.errorMsg = '檔案類型錯誤'
//                     res.render('try-upload', output);
//                 })
//         }
//     }
// });
app.post('/try-upload2', upload.single('avatar'), (req, res)=>{
    res.json({
        filename: req.file.filename,
        // body: req.body
    });
})
app.get('/my-params/:action/id',(req,res)=>{
    res.json(req.query)
})

// app.get('/jsontest',(reqnes,res)=>{

//     const data =require(__dirname + '/../data/sales')
//     res.render('sales',{ data } )

// })
app.get('/try-post', (req, res) => {
    res.render('form-post')
})
// app.post('/try-post', (req, res) => {
//     // res.render('main', {name:req.body.name} )
//     res.render('form-post',req.body)
// })

app.post('/try-post', (req, res) => {
    // res.render('main', {name:req.body.name} )
    const contentType = req.get('Content-Type')
    // res.render('form-post',req.body)
    res.json(req.body)
})
app.get('/try', (mesreq, res) => {
    res.json(mesreq.query)
})
app.get('/pend', (mes, res) => {

    res.render('main', { name: 'darren' })


})

const admin2Router = require(__dirname + '/admin/admin2');
app.use(admin2Router);
// const admin2Router = (require( __dirname + '/admin/admin2');
// app.use('/my', require(__dirname + '/admins/admin2'));



app.get('/try-session',(req,res)=>{
    req.session.my_var = req.session.my_var || 0;
    req.session.my_var++;

    res.json({
        my_var: req.session.my_var,
        session: req.session
    })
})


app.use((req, res, next)=>{
    res.locals.sess = req.session || {};
    res.locals.customData = {
        name: 'ddd',
        action: 'edit'
    }
    next();
});



app.get('/login',(req,res)=>{
     res.render('login');
})

app.post('/login',upload.none(),(req,res)=>{
    console.log(req.body)
        
    const users = {

        'wang':{
            pass:'12345',
            nickname:'wang'
        },

       'wwww':{
            pass:'12345',
            nickname:'wwww'
        }
    }

    const output={

        success: false,
        body: req.body

    }


    if(!!users[req.body.account] && users[req.body.account].pass === req.body.password){

                output.success = true;
                req.session.user =
            {
                id:req.body.account,
                nickname:users[req.body.account].nickname,
            }
    }

        output.sess_user = req.session.user;
        res.json(output);



})


app.get('/logout',(req,res)=>{

   delete req.session.user;
     res.redirect('/login');

})


const moment = require('moment-timezone')

app.get('/moment',(req,res)=>{

    const fm = 'YYYY-MM-DD HH:mm:ss'
    const mo1 = moment(req.session.cookie.expires);

    res.json({

        'local-mo1':mo1.tz('Europe/London').format(fm)


    })

})


// const dbrouter = require(__dirname + '/adress_book')
app.use('/address_book', require(__dirname+'/adress_book'))



app.listen(5050, function () {
    // console.log('啟動 server 偵聽埠號 5050');
});









// app.use((reqMes,res)=>{
//     res.type('text/plain')
//     res.status(404)
//     res.send(`error`)
// })



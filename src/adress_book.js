const express = require('express')
const db = require(__dirname + '/db_connect')
const router = express.Router();
const moment = require('moment-timezone')
const upload = require(__dirname + '/upload-module');

router.get('/', (req, res) => {
    res.redirect(req.baseUrl + '/list');
});

router.use((req, res, next)=>{
    const white = ['list', 'login','list2','api'];
    let u = req.url.split('/')[1];
    u = u.split('?')[0];

    if(!req.session.admin){
        if(white.indexOf(u) !==-1){
            next();
        } else {
            res.status(403).send('賣來');
        }
    } else {
        next();
    }
});
router.get('/list2', async (req, res)=>{
    res.render('address-book/list2');
})
router.get('/login', (req, res)=>{
    if(req.session.admin){
        res.redirect('/address_book/list');
    } else {
        res.render('address-book/login');
    }

});
router.post('/login', upload.none(), (req, res)=>{
    const  output = {
        body: req.body,
        success: false
    }
    //res.render('address-book/login');
    const sql = "SELECT `sid`, `account`, `name`, `pwd`  FROM `admin` WHERE account = ? AND pwd = ?";
    db.query(sql, [req.body.account, req.body.password])
        .then(([r])=>{
            console.log([r])
          
                req.session.admin = r[0];
                output.success = true;
            
            res.json(output);
        })

    //res.json(req.body);
});



router.get('/logout',(req,res)=>{
    delete req.session.admin;
    res.redirect('/address_book/list')
})



router.get('/add', (req, res) => {
    res.render('address-book/add')
})
router.post('/add', upload.none(), (req, res) => {
    console.log(req)
    const output = {
        success: false,
    }
    req.body.created_at = new Date();
    const sql = "INSERT INTO address_book set ?"
    db.query(sql,[req.body])
        .then(([r]) => {
            console.log([r])
            output.results = r;
            if(r.affectedRows && r.insertId){
                output.success = true;
            }
            res.json(output);
        })
    //res.json(req.body);
})

router.get('/edit/:sid', (req, res) => {

    const sql = "SELECT * FROM address_book WHERE sid = ? "
    console.log(req)
    db.query(sql,[req.params.sid])
    .then(([r])=>{
        console.log(r)
        if(r && r.length){
            r[0].birthday = moment(r[0].birthday).format('YYYY-MM-DD');
            res.render('address-book/edit', r[0])
        } else {
            res.redirect('/address-book/list')
        }
    })
})

router.post('/edit', upload.none(), (req, res) => {
    const output = {

        success:false,
        body:req.body,

    }
    console.log(req.body.sid)
    let sid = parseInt(req.body.sid);
    if(!req.body.sid){
        output.err = 'No primay Key';
        return res.json(output);
    }
    const sql = "UPDATE `address_book` SET ? WHERE sid = ?"
    delete req.body.sid;
    db.query(sql,[req.body,sid])
    .then(([r])=>{
        output.results = r;
        if(r.affectedRows && r.changedRows){
            output.success=true;
        }
        res.json(output)

    })
})



router.get('/del/:sid',(req,res)=>{
    let refer = req.get('Referer')
    const sql = "DELETE FROM `address_book` WHERE sid=?";
    db.query(sql, [req.params.sid])
    .then(([r])=>{
        console.log([r])
        if(refer){
            res.redirect(refer)
        }else{
            res.redirect('/address_book/list')
        }
    })
})






const getDataList = async (req) => {
    const perPage = 5;
    let page = parseInt(req.params.page) || 1;
    const output = {
        // page: page,
        perPage: perPage,
        totalRows: 0, // 總共有幾筆資料
        totalPages: 0, //總共有幾頁
        rows: []
    }
    const [r1] = await db.query("SELECT COUNT(1) num FROM address_book");
    output.totalRows = r1[0].num;
    output.totalPages = Math.ceil(output.totalRows / perPage);
    if (page < 1) page = 1;
    if (page > output.totalPages) page = output.totalPages;
    if (output.totalPages === 0) page = 0;
    output.page = page;

    if (!output.page) {
        return output;
    }
    const sql = `SELECT * FROM address_book ORDER BY sid DESC LIMIT ${(page - 1) * perPage}, ${perPage}`
    const [r2] = await db.query(sql);
    if (r2) output.rows = r2;

    r2.forEach(element => {
        element.birthday = moment(element.birthday).format('YYYY-MM-DD')
    });

    return output;
};

router.get('/list/:page?', async (req, res) => {

    const output = await getDataList(req);
    if(req.session.admin)
    res.render('address-book/list', output);
    else
    res.render('address-book/list-no-admin', output);
})
router.get('/api/list/:page?', async (req, res) => {
    const output = await getDataList(req);
    res.json(output);
})

module.exports = router;

